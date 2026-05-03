import { useState, useEffect } from 'react';
import { 
  Download, FileText, TrendingUp, TrendingDown,
  Award, PieChart as PieChartIcon, Search,
  Plus, Trash2, LayoutGrid, Loader2, X
} from 'lucide-react';
import clsx from 'clsx';
import api from '../../../shared/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let MAX_VALUE = 800000;

export const createSmoothPath = (data: number[], maxVal: number) => {
  if (data.length === 0) return '';
  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * 100,
    y: 100 - (val / maxVal) * 100
  }));
  
  let path = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cp1x = p0.x + (p1.x - p0.x) / 3;
    const cp1y = p0.y;
    const cp2x = p1.x - (p1.x - p0.x) / 3;
    const cp2y = p1.y;
    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`;
  }
  return path;
};

export default function RevenueAnalytics() {
  const [timeFilter, setTimeFilter] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: 'Fuel',
    amount: '',
    description: '',
    status: 'On Budget'
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/analytics/revenue?period=${timeFilter.toLowerCase()}`);
      setData(res.data.data);
      const maxRev = Math.max(...(res.data.data.chart?.dailyRevenue || [0]));
      MAX_VALUE = maxRev > 0 ? maxRev * 1.2 : 800000;
    } catch (err) {
      console.error('Failed to fetch analytics data', err);
      toast.error('Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/analytics/expenses');
      setExpenses(res.data.data);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchExpenses();
  }, [timeFilter]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/analytics/expenses', newExpense);
      toast.success('Expense added successfully');
      setIsExpenseModalOpen(false);
      setNewExpense({ category: 'Fuel', amount: '', description: '', status: 'On Budget' });
      fetchData();
      fetchExpenses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await api.delete(`/analytics/expenses/${id}`);
      toast.success('Expense deleted');
      fetchData();
      fetchExpenses();
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const handleExportPDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.text(`Revenue Analytics Report - ${timeFilter}`, 14, 15);
    
    const tableData = data.routePerformance.map((r: any) => [
      r.route,
      r.trips,
      r.passengers,
      `N${r.revenue.toLocaleString()}`,
      `N${r.profit.toLocaleString()}`,
      `${r.margin}%`
    ]);

    autoTable(doc, {
      startY: 25,
      head: [['Route', 'Trips', 'Passengers', 'Revenue', 'Profit', 'Margin']],
      body: tableData,
    });

    doc.save(`Revenue_Report_${timeFilter}_${new Date().toLocaleDateString()}.pdf`);
  };

  const handleExportExcel = () => {
    if (!data) return;
    const ws = XLSX.utils.json_to_sheet(data.routePerformance);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Performance");
    XLSX.writeFile(wb, `Revenue_Report_${timeFilter}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#0ea5e9]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-slate-500 font-medium">Failed to load analytics data.</p>
        <button 
          onClick={fetchData}
          className="px-6 py-2 bg-[#0ea5e9] text-white rounded-xl font-bold shadow-sm hover:bg-[#0284c7] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const summary = data.summary || { totalRevenue: 0, totalExpenses: 0, netProfit: 0, profitMargin: 0 };
  const comparison = data.comparison || { revenueChange: 0, expenseChange: 0, profitChange: 0 };
  const chartData = data.chart || { dailyRevenue: [0, 0, 0, 0, 0, 0, 0], dailyExpenses: [0, 0, 0, 0, 0, 0, 0] };
  const routePerformanceData = data.routePerformance || [];
  const profitLoss = data.profitLoss || { income: [], expenses: [], totalIncome: 0, totalExpenses: 0 };

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-300 pb-10">
      {/* Header Section */}
      <div className="bg-[#0ea5e9] -mx-4 sm:-mx-6 -mt-8 px-4 sm:px-6 pt-12 pb-32 mb-8">
        <div className="flex justify-between items-start mb-2">
          <div className="text-white/80 text-sm font-medium">
            Dashboard &gt; Revenue Analytics
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Revenue Analytics</h1>
            <p className="text-white/90 text-[15px] font-medium max-w-md leading-relaxed">
              Track revenue, performance, and profitability
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 flex items-center border border-white/20">
              {['Daily', 'Weekly', 'Monthly'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter as any)}
                  className={clsx(
                    "px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                    timeFilter === filter 
                      ? "bg-white text-[#0ea5e9] shadow-sm"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border-2 border-white/30 hover:border-white/50 hover:bg-white/10 text-white rounded-xl text-[14.5px] font-semibold transition-all"
            >
              <Download className="w-[18px] h-[18px]" />
              Export PDF
            </button>
            <button 
              onClick={handleExportExcel}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border-2 border-white/30 hover:border-white/50 hover:bg-white/10 text-white rounded-xl text-[14.5px] font-semibold transition-all"
            >
              <FileText className="w-[18px] h-[18px]" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10 -mt-24 mb-8">
        
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[180px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-[#ecfdf5] flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[#10b981]" />
            </div>
            <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-[#10b981] mb-2">₦{summary.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500">This period</span>
            <span className={clsx(
              "text-[13px] font-medium",
              comparison.revenueChange >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
            )}>
              {comparison.revenueChange >= 0 ? '↑' : '↓'} {Math.abs(comparison.revenueChange)}% vs last period
            </span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[180px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6 text-[#ef4444]" />
            </div>
            <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase mb-1">Total Expenses</p>
            <h3 className="text-3xl font-bold text-[#ef4444] mb-2">₦{summary.totalExpenses.toLocaleString()}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500">This period</span>
            <span className={clsx(
              "text-[13px] font-medium",
              comparison.expenseChange <= 0 ? "text-[#10b981]" : "text-[#ef4444]"
            )}>
              {comparison.expenseChange >= 0 ? '↑' : '↓'} {Math.abs(comparison.expenseChange)}% vs last period
            </span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[180px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-[#0ea5e9]" />
            </div>
            <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase mb-1">Net Profit</p>
            <h3 className="text-3xl font-bold text-[#0ea5e9] mb-2">₦{summary.netProfit.toLocaleString()}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500">This period</span>
            <span className={clsx(
              "text-[13px] font-medium",
              comparison.profitChange >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
            )}>
              {comparison.profitChange >= 0 ? '↑' : '↓'} {Math.abs(comparison.profitChange)}% vs last period
            </span>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[180px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-4">
              <PieChartIcon className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase mb-1">Profit Margin</p>
            <h3 className="text-3xl font-bold text-[#f59e0b] mb-2">{summary.profitMargin}%</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500">Revenue vs Expenses</span>
            <span className="text-[13px] font-medium text-[#10b981]">Excellent</span>
          </div>
        </div>

      </div>

      {/* ── Revenue Overview Chart ── */}
      <div className="mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#1e293b] mb-1">Revenue Overview</h2>
              <p className="text-[13.5px] text-slate-500">{timeFilter} breakdown</p>
            </div>
            <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
              <button className="p-2 bg-white rounded-lg shadow-sm text-[#0ea5e9]">
                <TrendingUp className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="h-[300px] flex items-end relative pt-10">
            {/* Y-Axis Guides */}
            <div className="absolute inset-0 flex flex-col justify-between pt-10 pb-6 pointer-events-none">
              {[800, 600, 400, 200, 0].map((val) => (
                <div key={val} className="flex items-center w-full">
                  <span className="w-12 text-right pr-4 text-[12px] font-medium text-slate-400">₦{val}k</span>
                  <div className="flex-1 border-t border-dashed border-slate-200"></div>
                </div>
              ))}
            </div>

            {/* Chart Data Area */}
            <div className="flex-1 flex justify-between items-end h-[240px] pl-[60px] pr-8 pb-6 relative z-10 w-full cursor-crosshair">
              
              {/* SVG Lines */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pb-6 pl-[60px] pr-8 overflow-visible pointer-events-none pt-[12px] z-30" preserveAspectRatio="none">
                {/* Revenue Line */}
                <path 
                  d={createSmoothPath(chartData.dailyRevenue, MAX_VALUE)}
                  fill="none" 
                  stroke="#0ea5e9" 
                  strokeWidth="3"
                  className="drop-shadow-sm"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Expenses Line */}
                <path 
                  d={createSmoothPath(chartData.dailyExpenses, MAX_VALUE)}
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Data Points & X-Axis */}
              {DAYS.map((day, i) => {
                const revenuePct = (chartData.dailyRevenue[i] / MAX_VALUE) * 100;
                const expensePct = (chartData.dailyExpenses[i] / MAX_VALUE) * 100;
                
                return (
                  <div key={day} className="flex flex-col items-center justify-end h-full relative group">
                    {/* Hover Guide Line */}
                    <div className="absolute inset-y-0 w-px bg-slate-200/0 group-hover:bg-slate-200 transition-colors pointer-events-none"></div>
                    
                    {/* Revenue Dot */}
                    <div 
                      className="absolute w-3 h-3 bg-white border-2 border-[#0ea5e9] rounded-full z-20 group-hover:scale-125 transition-transform"
                      style={{ bottom: `${revenuePct}%`, transform: 'translateY(50%)' }}
                    ></div>
                    
                    {/* Expense Dot */}
                    <div 
                      className="absolute w-2.5 h-2.5 bg-white border-2 border-[#ef4444] rounded-full z-20 group-hover:scale-125 transition-transform cursor-pointer"
                      style={{ bottom: `${expensePct}%`, transform: 'translateY(50%)' }}
                    ></div>

                    {/* Tooltip */}
                    <div className={clsx(
                      "absolute top-1/4 bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-slate-100 p-4 w-[160px] opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50",
                      i > 3 ? "right-full mr-4" : "left-full ml-4"
                    )}>
                      <p className="text-[14px] font-bold text-[#1e293b] mb-3">{day}</p>
                      <div className="space-y-2">
                        <p className="text-[13px] font-medium text-[#ef4444]">Expenses : ₦{chartData.dailyExpenses[i].toLocaleString()}</p>
                        <p className="text-[13px] font-medium text-[#0ea5e9]">Revenue : ₦{chartData.dailyRevenue[i].toLocaleString()}</p>
                      </div>
                    </div>

                    <span className="text-[12.5px] font-medium text-slate-500 mt-2 translate-y-8">{day}</span>
                  </div>
                );
              })}
            </div>
            
          </div>
          
          <div className="flex justify-center items-center gap-6 mt-12">
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 rounded-full bg-[#ef4444]"></div>
              <span className="text-[13px] font-medium text-[#ef4444]">Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 rounded-full bg-[#0ea5e9]"></div>
              <span className="text-[13px] font-medium text-[#0ea5e9]">Revenue</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── Route Performance ── */}
      <div className="mb-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#1e293b] mb-1">Route Performance</h2>
              <p className="text-[13.5px] text-slate-500">Revenue and metrics by route</p>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search route..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-4 pl-4 font-bold w-[20%]">Route</th>
                  <th className="pb-4 font-bold">Trips</th>
                  <th className="pb-4 font-bold">Passengers</th>
                  <th className="pb-4 font-bold">Revenue</th>
                  <th className="pb-4 font-bold">Expenses</th>
                  <th className="pb-4 font-bold">Profit</th>
                  <th className="pb-4 font-bold">Margin %</th>
                  <th className="pb-4 font-bold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/80">
                {routePerformanceData.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-5 pl-4">
                      <p className="text-[14px] font-semibold text-[#1e293b] mb-0.5">{item.route}</p>
                      <p className="text-[12.5px] text-slate-500">{item.distance || '--'}</p>
                    </td>
                    <td className="py-5 align-middle">
                      <p className="text-[14.5px] font-bold text-[#1e293b] mb-0.5">{item.trips}</p>
                      <p className="text-[12.5px] text-slate-500">trips</p>
                    </td>
                    <td className="py-5 align-middle">
                      <p className="text-[14.5px] font-bold text-[#1e293b] mb-0.5">{item.passengers.toLocaleString()}</p>
                      <p className="text-[12.5px] text-slate-500">{item.occupancy || '--'}% occupancy</p>
                    </td>
                    <td className="py-5 align-middle">
                      <p className="text-[14.5px] font-bold text-[#10b981] mb-0.5">₦{item.revenue.toLocaleString()}</p>
                      <p className="text-[12.5px] text-[#10b981] flex items-center">↑ +{item.revGrowth || '--'}%</p>
                    </td>
                    <td className="py-5 align-middle">
                      <p className="text-[14.5px] font-bold text-[#ef4444] mb-0.5">₦{item.expenses.toLocaleString()}</p>
                      <p className="text-[12.5px] text-slate-500 line-clamp-1">Fuel, Tolls, etc.</p>
                    </td>
                    <td className="py-5 align-middle">
                      <p className="text-[14.5px] font-bold text-[#0ea5e9] mb-0.5">₦{item.profit.toLocaleString()}</p>
                      <p className="text-[12.5px] text-[#10b981] flex items-center">↑ +{item.profitGrowth || '--'}%</p>
                    </td>
                    <td className="py-5 align-middle">
                      <div className="flex flex-col gap-1 w-16">
                        <span className="text-[14.5px] font-bold text-[#f59e0b]">{item.margin}%</span>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#f59e0b] rounded-full" style={{ width: `${item.margin}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-4 align-middle text-center">
                      <span className={clsx(
                        "inline-flex px-3 py-1 rounded-full text-[12px] font-bold tracking-wide",
                        item.status === 'Top Performer' 
                          ? "bg-[#10b981] text-white" 
                          : "bg-slate-200/70 text-slate-600"
                      )}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        
        {/* ── Ticket Sales Breakdown ── */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1e293b]">Ticket Sales Breakdown</h2>
          </div>
          
          <div className="flex-1 flex flex-col lg:flex-row gap-8">
            {/* Pie Chart Area - Mockup */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <p className="w-full text-left text-[13.5px] font-semibold text-[#1e293b] mb-6">Sales by Type</p>
              
              <div className="relative w-48 h-48 mb-8">
                {/* SVG Pie Chart Mockup */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 drop-shadow-sm">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0ea5e9" strokeWidth="20" strokeDasharray="251.2 251.2" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ec4899" strokeWidth="20" strokeDasharray="0 251.2" strokeDashoffset="-251.2" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="0 251.2" strokeDashoffset="-251.2" />
                </svg>
                {/* Percentage Labels */}
                <span className="absolute top-2 right-2 text-[#0ea5e9] text-[11px] font-bold">100%</span>
                <span className="absolute top-1/2 -left-6 text-[#ec4899] text-[11px] font-bold">0%</span>
                <span className="absolute bottom-2 right-2 text-[#f59e0b] text-[11px] font-bold">0%</span>
              </div>
              
              <div className="flex justify-center gap-6">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#0ea5e9]"></div><span className="text-[12px] text-slate-500">Standard</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#ec4899]"></div><span className="text-[12px] text-slate-500">Premium</span></div>
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div><span className="text-[12px] text-slate-500">VIP</span></div>
              </div>
            </div>

            {/* Sales Summary List */}
            <div className="flex-1 flex flex-col">
              <p className="text-[13.5px] font-semibold text-[#1e293b] mb-4">Sales Summary</p>
              
              <div className="space-y-3 mb-6 flex-1">
                {/* Standard */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0ea5e9]"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[13.5px] font-semibold text-[#1e293b]">Standard Tickets</span>
                    <span className="text-[12px] text-slate-500">100%</span>
                  </div>
                  <div className="flex justify-between items-center text-[12.5px]">
                    <span className="text-slate-500 font-medium">All Sales</span>
                    <span className="font-bold text-[#10b981]">₦{summary.totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
                {/* Premium */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ec4899]"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[13.5px] font-semibold text-[#1e293b]">Premium Tickets</span>
                    <span className="text-[12px] text-slate-500">0%</span>
                  </div>
                  <div className="flex justify-between items-center text-[12.5px]">
                    <span className="text-slate-500 font-medium">0 × ₦8,000</span>
                    <span className="font-bold text-[#10b981]">₦0</span>
                  </div>
                </div>
                {/* VIP */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f59e0b]"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[13.5px] font-semibold text-[#1e293b]">VIP Tickets</span>
                    <span className="text-[12px] text-slate-500">0%</span>
                  </div>
                  <div className="flex justify-between items-center text-[12.5px]">
                    <span className="text-slate-500 font-medium">0 × ₦12,000</span>
                    <span className="font-bold text-[#10b981]">₦0</span>
                  </div>
                </div>
              </div>

              {/* Total Block */}
              <div className="bg-[#e0f2fe]/60 border border-[#bae6fd] rounded-xl p-4 flex justify-between items-center">
                <span className="text-[13.5px] font-medium text-slate-600">Total Revenue</span>
                <span className="text-[16px] font-bold text-[#0284c7]">₦{summary.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Expense Management ── */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col h-full">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#1e293b] mb-1">Expense Management</h2>
              <p className="text-[13.5px] text-slate-500">Track and manage operational expenses</p>
            </div>
            <button 
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white rounded-xl text-[13.5px] font-medium shadow-sm hover:bg-[#0284c7] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4 rounded-tl-xl w-[30%]">Category</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 rounded-tr-xl text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/80">
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">No expenses recorded for this period.</td>
                  </tr>
                )}
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 text-[13.5px] font-medium text-[#1e293b]">{expense.category}</td>
                    <td className="py-4 px-4 text-[13.5px] font-bold text-[#1e293b]">₦{expense.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-[13px] text-slate-500">{Math.round((expense.amount / Math.max(summary.totalExpenses, 1)) * 100)}%</td>
                    <td className="py-4 px-4">
                      <span className={clsx(
                        "inline-flex px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wide",
                        expense.status === 'On Budget' ? "bg-[#10b981] text-white" : "bg-[#ef4444] text-white"
                      )}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center gap-2">
                        <button className="p-1.5 text-[#ef4444] hover:bg-[#fee2e2] rounded-lg transition-colors" onClick={() => handleDeleteExpense(expense.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50/50">
                  <td className="py-4 px-4 rounded-bl-xl text-[13.5px] font-bold text-[#1e293b]">Total Expenses</td>
                  <td className="py-4 px-4 text-[13.5px] font-bold text-[#ef4444]">₦{summary.totalExpenses.toLocaleString()}</td>
                  <td className="py-4 px-4 text-[13px] font-medium text-slate-500">100%</td>
                  <td className="py-4 px-4"></td>
                  <td className="py-4 px-4 rounded-br-xl"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-10 mb-12">
        
        {/* ── Profit & Loss Statement ── */}
        <div className="bg-[#f0fdf4] rounded-3xl p-8 shadow-sm border-2 border-[#86efac] flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#1e293b] mb-1">Profit & Loss Statement</h2>
            <p className="text-[13px] text-slate-500">{timeFilter} period ending {new Date().toLocaleDateString()}</p>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-8 lg:gap-16">
            {/* Income Side */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-[13px] font-bold text-[#1e293b] uppercase tracking-wider mb-4 border-b border-[#bbf7d0] pb-2">Income</h3>
              
              <div className="space-y-4 flex-1">
                {profitLoss.income.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-[14px]">
                    <span className="text-[#1e293b] font-medium">{item.label}</span>
                    <span className="text-[#10b981] font-bold">₦{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between items-center text-[14.5px] mt-6 pt-4 border-t border-[#bbf7d0]">
                <span className="text-[#1e293b] font-bold">Total Income</span>
                <span className="text-[#10b981] font-bold">₦{profitLoss.totalIncome.toLocaleString()}</span>
              </div>
            </div>

            {/* Expenses Side */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-[13px] font-bold text-[#1e293b] uppercase tracking-wider mb-4 border-b border-[#bbf7d0] pb-2">Expenses</h3>
              
              <div className="space-y-4 flex-1">
                {profitLoss.expenses.length === 0 && <p className="text-slate-400 text-xs italic">No expenses recorded</p>}
                {profitLoss.expenses.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-[14px]">
                    <span className="text-[#1e293b] font-medium">{item.label}</span>
                    <span className="text-[#ef4444] font-bold">₦{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-[14.5px] mt-6 pt-4 border-t border-[#bbf7d0]">
                <span className="text-[#1e293b] font-bold">Total Expenses</span>
                <span className="text-[#ef4444] font-bold">₦{summary.totalExpenses.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Profit Block */}
          <div className="mt-8 pt-6 border-t-[2.5px] border-[#4ade80] flex justify-between items-end">
            <div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-1">Net Profit</h3>
              <p className="text-[13px] text-slate-500 font-medium tracking-wide">Profit Margin: {summary.profitMargin}%</p>
            </div>
            <div className="text-[32px] font-bold text-[#10b981] tracking-tight">
              ₦{summary.netProfit.toLocaleString()}
            </div>
          </div>

        </div>

        {/* ── Period Comparison ── */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#1e293b] mb-1">Period Comparison</h2>
            <p className="text-[13px] text-slate-500">Compare metrics with previous period</p>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 px-4 rounded-tl-xl w-[25%] text-slate-500">Metric</th>
                  <th className="py-4 px-4 text-slate-500">This Period</th>
                  <th className="py-4 px-4 text-slate-500">Last Period</th>
                  <th className="py-4 px-4 text-slate-500">Change</th>
                  <th className="py-4 px-4 rounded-tr-xl text-slate-500">% Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/80">
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-4 text-[14px] font-medium text-[#1e293b]">Total Revenue</td>
                  <td className="py-5 px-4 text-[14px] font-bold text-[#1e293b]">₦{summary.totalRevenue.toLocaleString()}</td>
                  <td className="py-5 px-4 text-[13.5px] text-slate-500 font-medium">₦{(summary.totalRevenue / (1 + (comparison.revenueChange || 0)/100)).toLocaleString()}</td>
                  <td className="py-5 px-4 text-[13.5px] font-bold text-[#10b981]">₦{(summary.totalRevenue * ((comparison.revenueChange || 0)/100)).toLocaleString()}</td>
                  <td className={clsx(
                    "py-5 px-4 text-[13.5px] font-bold",
                    (comparison.revenueChange || 0) >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
                  )}>
                    {(comparison.revenueChange || 0) >= 0 ? '↑' : '↓'} {Math.abs(comparison.revenueChange || 0)}%
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-4 text-[14px] font-medium text-[#1e293b]">Total Expenses</td>
                  <td className="py-5 px-4 text-[14px] font-bold text-[#1e293b]">₦{summary.totalExpenses.toLocaleString()}</td>
                  <td className="py-5 px-4 text-[13.5px] text-slate-500 font-medium">₦{(summary.totalExpenses / (1 + (comparison.expenseChange || 0)/100)).toLocaleString()}</td>
                  <td className="py-5 px-4 text-[13.5px] font-bold text-[#ef4444]">₦{(summary.totalExpenses * ((comparison.expenseChange || 0)/100)).toLocaleString()}</td>
                  <td className={clsx(
                    "py-5 px-4 text-[13.5px] font-bold",
                    (comparison.expenseChange || 0) <= 0 ? "text-[#10b981]" : "text-[#ef4444]"
                  )}>
                    {(comparison.expenseChange || 0) >= 0 ? '↑' : '↓'} {Math.abs(comparison.expenseChange || 0)}%
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-4 text-[14px] font-medium text-[#1e293b]">Net Profit</td>
                  <td className="py-5 px-4 text-[14px] font-bold text-[#1e293b]">₦{summary.netProfit.toLocaleString()}</td>
                  <td className="py-5 px-4 text-[13.5px] text-slate-500 font-medium">₦{(summary.netProfit / (1 + (comparison.profitChange || 0)/100)).toLocaleString()}</td>
                  <td className="py-5 px-4 text-[13.5px] font-bold text-[#10b981]">₦{(summary.netProfit * ((comparison.profitChange || 0)/100)).toLocaleString()}</td>
                  <td className={clsx(
                    "py-5 px-4 text-[13.5px] font-bold",
                    (comparison.profitChange || 0) >= 0 ? "text-[#10b981]" : "text-[#ef4444]"
                  )}>
                    {(comparison.profitChange || 0) >= 0 ? '↑' : '↓'} {Math.abs(comparison.profitChange || 0)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Add New Expense</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddExpense} className="p-6 space-y-5">
              <div>
                <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0ea5e9] transition-all"
                  value={newExpense.category}
                  onChange={e => setNewExpense({...newExpense, category: e.target.value})}
                >
                  {['Fuel', 'Maintenance', 'Salaries', 'Tolls & Permits', 'Insurance', 'Marketing', 'Rent', 'Utilities', 'Others'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2">Amount (N)</label>
                <input 
                  type="number" required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0ea5e9] transition-all"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[13px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#0ea5e9] transition-all h-24 resize-none"
                  placeholder="Optional details..."
                  value={newExpense.description}
                  onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                />
              </div>
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full py-4 bg-[#0ea5e9] text-white rounded-2xl font-bold shadow-lg shadow-[#0ea5e9]/20 hover:bg-[#0284c7] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Confirm Expense
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
