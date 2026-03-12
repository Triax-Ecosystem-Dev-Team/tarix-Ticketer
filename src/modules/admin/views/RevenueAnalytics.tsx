import { useState } from 'react';
import { 
  Download, FileText, TrendingUp, TrendingDown,
  Award, PieChart as PieChartIcon, Search,
  Plus, Edit2, Trash2, LayoutGrid
} from 'lucide-react';
import clsx from 'clsx';

// Mock data for the chart
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MOCK_REVENUE = [520000, 580000, 620000, 550000, 680000, 720000, 610000];
const MOCK_EXPENSES = [95000, 105000, 110000, 98000, 120000, 125000, 102000];
const MAX_VALUE = 800000;

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

const ROUTE_PERFORMANCE = [
  { id: 1, route: 'Lagos → Owerri', distance: '450 km', trips: 24, passengers: 1152, occupancy: 96, revenue: 2736000, revGrowth: 8, expenses: 456000, profit: 2280000, profitGrowth: 12, margin: 83, status: 'Top Performer' },
  { id: 2, route: 'Lagos → Abuja', distance: '780 km', trips: 18, passengers: 864, occupancy: 96, revenue: 3456000, revGrowth: 15, expenses: 624000, profit: 2832000, profitGrowth: 18, margin: 82, status: 'Top Performer' },
  { id: 3, route: 'Lagos → Port Harcourt', distance: '520 km', trips: 20, passengers: 960, occupancy: 96, revenue: 2880000, revGrowth: 10, expenses: 520000, profit: 2360000, profitGrowth: 14, margin: 82, status: 'Top Performer' },
  { id: 4, route: 'Abuja → Kano', distance: '340 km', trips: 16, passengers: 720, occupancy: 90, revenue: 1440000, revGrowth: 5, expenses: 272000, profit: 1168000, profitGrowth: 7, margin: 81, status: 'Average' },
];

const MOCK_EXPENSE_LIST = [
  { id: 1, category: 'Fuel', amount: 456000, percentage: 31, status: 'On Budget' },
  { id: 2, category: 'Tolls & Permits', amount: 280000, percentage: 19, status: 'On Budget' },
  { id: 3, category: 'Maintenance', amount: 320000, percentage: 22, status: 'Over Budget' },
  { id: 4, category: 'Driver Salaries', amount: 240000, percentage: 16, status: 'On Budget' },
  { id: 5, category: 'Insurance', amount: 160000, percentage: 11, status: 'On Budget' },
];

export default function RevenueAnalytics() {
  const [timeFilter, setTimeFilter] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');

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
            
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border-2 border-white/30 hover:border-white/50 hover:bg-white/10 text-white rounded-xl text-[14.5px] font-semibold transition-all">
              <Download className="w-[18px] h-[18px]" />
              Export PDF
            </button>
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-transparent border-2 border-white/30 hover:border-white/50 hover:bg-white/10 text-white rounded-xl text-[14.5px] font-semibold transition-all">
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
            <h3 className="text-3xl font-bold text-[#10b981] mb-2">₦7,280,000</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500">This period</span>
            <span className="text-[13px] font-medium text-[#10b981]">↑ +12% vs last period</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[180px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <TrendingDown className="w-6 h-6 text-[#ef4444]" />
            </div>
            <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase mb-1">Total Expenses</p>
            <h3 className="text-3xl font-bold text-[#ef4444] mb-2">₦1,456,000</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500">This period</span>
            <span className="text-[13px] font-medium text-[#ef4444]">↑ +5% vs last period</span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[180px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-[#0ea5e9]" />
            </div>
            <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase mb-1">Net Profit</p>
            <h3 className="text-3xl font-bold text-[#0ea5e9] mb-2">₦5,824,000</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500">This period</span>
            <span className="text-[13px] font-medium text-[#10b981]">↑ +18% vs last period</span>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-[180px]">
          <div>
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-4">
              <PieChartIcon className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <p className="text-[12px] font-bold text-slate-400 tracking-wider uppercase mb-1">Profit Margin</p>
            <h3 className="text-3xl font-bold text-[#f59e0b] mb-2">80%</h3>
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
                  d={createSmoothPath(MOCK_REVENUE, MAX_VALUE)}
                  fill="none" 
                  stroke="#0ea5e9" 
                  strokeWidth="3"
                  className="drop-shadow-sm"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Expenses Line */}
                <path 
                  d={createSmoothPath(MOCK_EXPENSES, MAX_VALUE)}
                  fill="none" 
                  stroke="#ef4444" 
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Data Points & X-Axis */}
              {DAYS.map((day, i) => {
                const revenuePct = (MOCK_REVENUE[i] / MAX_VALUE) * 100;
                const expensePct = (MOCK_EXPENSES[i] / MAX_VALUE) * 100;
                
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
                        <p className="text-[13px] font-medium text-[#ef4444]">Expenses : ₦{MOCK_EXPENSES[i].toLocaleString()}</p>
                        <p className="text-[13px] font-medium text-[#0ea5e9]">Revenue : ₦{MOCK_REVENUE[i].toLocaleString()}</p>
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
                {ROUTE_PERFORMANCE.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-5 pl-4">
                      <p className="text-[14px] font-semibold text-[#1e293b] mb-0.5">{item.route}</p>
                      <p className="text-[12.5px] text-slate-500">{item.distance}</p>
                    </td>
                    <td className="py-5 align-middle">
                      <p className="text-[14.5px] font-bold text-[#1e293b] mb-0.5">{item.trips}</p>
                      <p className="text-[12.5px] text-slate-500">trips</p>
                    </td>
                    <td className="py-5 align-middle">
                      <p className="text-[14.5px] font-bold text-[#1e293b] mb-0.5">{item.passengers.toLocaleString()}</p>
                      <p className="text-[12.5px] text-slate-500">{item.occupancy}% occupancy</p>
                    </td>
                    <td className="py-5 align-middle">
                      <p className="text-[14.5px] font-bold text-[#10b981] mb-0.5">₦{item.revenue.toLocaleString()}</p>
                      <p className="text-[12.5px] text-[#10b981] flex items-center">↑ +{item.revGrowth}%</p>
                    </td>
                    <td className="py-5 align-middle">
                      <p className="text-[14.5px] font-bold text-[#ef4444] mb-0.5">₦{item.expenses.toLocaleString()}</p>
                      <p className="text-[12.5px] text-slate-500 line-clamp-1">Fuel, Tolls, etc.</p>
                    </td>
                    <td className="py-5 align-middle">
                      <p className="text-[14.5px] font-bold text-[#0ea5e9] mb-0.5">₦{item.profit.toLocaleString()}</p>
                      <p className="text-[12.5px] text-[#10b981] flex items-center">↑ +{item.profitGrowth}%</p>
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
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0ea5e9" strokeWidth="20" strokeDasharray="113.1 251.2" strokeDashoffset="0" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ec4899" strokeWidth="20" strokeDasharray="87.9 251.2" strokeDashoffset="-113.1" />
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="20" strokeDasharray="50.2 251.2" strokeDashoffset="-201" />
                </svg>
                {/* Percentage Labels */}
                <span className="absolute top-2 right-2 text-[#0ea5e9] text-[11px] font-bold">45%</span>
                <span className="absolute top-1/2 -left-6 text-[#ec4899] text-[11px] font-bold">35%</span>
                <span className="absolute bottom-2 right-2 text-[#f59e0b] text-[11px] font-bold">20%</span>
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
                    <span className="text-[12px] text-slate-500">45%</span>
                  </div>
                  <div className="flex justify-between items-center text-[12.5px]">
                    <span className="text-slate-500 font-medium">2,160 × ₦5,000</span>
                    <span className="font-bold text-[#10b981]">₦10,800,000</span>
                  </div>
                </div>
                {/* Premium */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ec4899]"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[13.5px] font-semibold text-[#1e293b]">Premium Tickets</span>
                    <span className="text-[12px] text-slate-500">35%</span>
                  </div>
                  <div className="flex justify-between items-center text-[12.5px]">
                    <span className="text-slate-500 font-medium">1,680 × ₦8,000</span>
                    <span className="font-bold text-[#10b981]">₦13,440,000</span>
                  </div>
                </div>
                {/* VIP */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f59e0b]"></div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[13.5px] font-semibold text-[#1e293b]">VIP Tickets</span>
                    <span className="text-[12px] text-slate-500">20%</span>
                  </div>
                  <div className="flex justify-between items-center text-[12.5px]">
                    <span className="text-slate-500 font-medium">960 × ₦12,000</span>
                    <span className="font-bold text-[#10b981]">₦11,520,000</span>
                  </div>
                </div>
              </div>

              {/* Total Block */}
              <div className="bg-[#e0f2fe]/60 border border-[#bae6fd] rounded-xl p-4 flex justify-between items-center">
                <span className="text-[13.5px] font-medium text-slate-600">Total: 4,800 tickets</span>
                <span className="text-[16px] font-bold text-[#0284c7]">₦35,760,000</span>
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
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] text-white rounded-xl text-[13.5px] font-medium shadow-sm hover:bg-[#0284c7] transition-colors">
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
                {MOCK_EXPENSE_LIST.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 text-[13.5px] font-medium text-[#1e293b]">{expense.category}</td>
                    <td className="py-4 px-4 text-[13.5px] font-bold text-[#1e293b]">₦{expense.amount.toLocaleString()}</td>
                    <td className="py-4 px-4 text-[13px] text-slate-500">{expense.percentage}%</td>
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
                        <button className="p-1.5 text-[#0ea5e9] hover:bg-[#e0f2fe] rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-[#ef4444] hover:bg-[#fee2e2] rounded-lg transition-colors">
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
                  <td className="py-4 px-4 text-[13.5px] font-bold text-[#ef4444]">₦1,456,000</td>
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
            <p className="text-[13px] text-slate-500">November 1 - November 30, 2025</p>
          </div>

          <div className="flex-1 flex flex-col md:flex-row gap-8 lg:gap-16">
            {/* Income Side */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-[13px] font-bold text-[#1e293b] uppercase tracking-wider mb-4 border-b border-[#bbf7d0] pb-2">Income</h3>
              
              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#1e293b] font-medium">Ticket Sales</span>
                  <span className="text-[#10b981] font-bold">₦35,760,000</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#1e293b] font-medium">Add-on Services</span>
                  <span className="text-[#10b981] font-bold">₦1,520,000</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-[14.5px] mt-6 pt-4 border-t border-[#bbf7d0]">
                <span className="text-[#1e293b] font-bold">Total Income</span>
                <span className="text-[#10b981] font-bold">₦37,280,000</span>
              </div>
            </div>

            {/* Expenses Side */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-[13px] font-bold text-[#1e293b] uppercase tracking-wider mb-4 border-b border-[#bbf7d0] pb-2">Expenses</h3>
              
              <div className="space-y-4 flex-1">
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#1e293b] font-medium">Fuel</span>
                  <span className="text-[#ef4444] font-bold">₦456,000</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#1e293b] font-medium">Tolls & Permits</span>
                  <span className="text-[#ef4444] font-bold">₦280,000</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#1e293b] font-medium">Maintenance</span>
                  <span className="text-[#ef4444] font-bold">₦320,000</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#1e293b] font-medium">Driver Salaries</span>
                  <span className="text-[#ef4444] font-bold">₦240,000</span>
                </div>
                <div className="flex justify-between items-center text-[14px]">
                  <span className="text-[#1e293b] font-medium">Insurance</span>
                  <span className="text-[#ef4444] font-bold">₦160,000</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[14.5px] mt-6 pt-4 border-t border-[#bbf7d0]">
                <span className="text-[#1e293b] font-bold">Total Expenses</span>
                <span className="text-[#ef4444] font-bold">₦1,456,000</span>
              </div>
            </div>
          </div>

          {/* Footer Profit Block */}
          <div className="mt-8 pt-6 border-t-[2.5px] border-[#4ade80] flex justify-between items-end">
            <div>
              <h3 className="text-xl font-bold text-[#1e293b] mb-1">Net Profit</h3>
              <p className="text-[13px] text-slate-500 font-medium tracking-wide">Profit Margin: 96%</p>
            </div>
            <div className="text-[32px] font-bold text-[#10b981] tracking-tight">
              ₦35,824,000
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
                  <td className="py-5 px-4 text-[14px] font-bold text-[#1e293b]">₦7,280,000</td>
                  <td className="py-5 px-4 text-[13.5px] text-slate-500 font-medium">₦6,500,000</td>
                  <td className="py-5 px-4 text-[13.5px] font-bold text-[#10b981]">₦780,000</td>
                  <td className="py-5 px-4 text-[13.5px] font-bold text-[#10b981]">↑ +12%</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-4 text-[14px] font-medium text-[#1e293b]">Total Expenses</td>
                  <td className="py-5 px-4 text-[14px] font-bold text-[#1e293b]">₦1,456,000</td>
                  <td className="py-5 px-4 text-[13.5px] text-slate-500 font-medium">₦1,387,000</td>
                  <td className="py-5 px-4 text-[13.5px] font-bold text-[#ef4444]">₦69,000</td>
                  <td className="py-5 px-4 text-[13.5px] font-bold text-[#ef4444]">↑ +5%</td>
                </tr>
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-4 text-[14px] font-medium text-[#1e293b]">Net Profit</td>
                  <td className="py-5 px-4 text-[14px] font-bold text-[#1e293b]">₦5,824,000</td>
                  <td className="py-5 px-4 text-[13.5px] text-slate-500 font-medium">₦5,113,000</td>
                  <td className="py-5 px-4 text-[13.5px] font-bold text-[#10b981]">₦711,000</td>
                  <td className="py-5 px-4 text-[13.5px] font-bold text-[#10b981]">↑ +14%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
