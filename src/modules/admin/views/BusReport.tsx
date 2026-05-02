import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Download, FileText, ChevronRight, Bus, Activity, 
  TrendingUp, Banknote, Users, Loader2, Calendar, 
  MapPin, Star, AlertCircle, Info
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import clsx from 'clsx';
import { useFleetStore } from '../store/useFleetStore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SectionHeader = ({ title, icon: Icon }: { title: string, icon?: any }) => (
  <div className="flex items-center gap-3 mb-8">
    {Icon && <Icon className="w-5 h-5 text-[#0EA5E9]" />}
    <h3 className="text-[19px] font-bold text-[#1E293B]">{title}</h3>
  </div>
);

const BusReport = () => {
  const { id } = useParams<{ id: string }>();
  const { busReport, isLoading, fetchBusReport } = useFleetStore();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  useEffect(() => {
    if (id) fetchBusReport(id);
  }, [id, fetchBusReport]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !busReport) return;
    setIsExportingPDF(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bus_Report_${busReport.busDetails.registrationNumber}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportCSV = () => {
    if (!busReport || busReport.tripHistory.length === 0) return;
    const headers = ['Trip ID', 'Route', 'Date', 'Revenue', 'Passengers'];
    const rows = busReport.tripHistory.map((t: any) => [
      t.id, t.route, new Date(t.date).toLocaleDateString(), t.revenue, t.passengers
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row: any) => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `Bus_History_${busReport.busDetails.registrationNumber}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading || !busReport) {
    return (
      <div className="p-6 font-sans bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" />
        <p className="text-slate-500 font-medium">Generating Performance Report…</p>
      </div>
    );
  }

  const { busDetails, stats, tripHistory } = busReport;

  const REVENUE_DATA = [
    { name: 'Lifetime Revenue', value: stats.lifetimeRevenue, color: '#0EA5E9' },
    { name: 'Est. Maint. Costs', value: stats.totalTrips * 15000, color: '#EF4444' },
  ];

  return (
    <div className="p-6 lg:p-10 font-sans bg-[#F8FAFC] min-h-screen pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-slate-400 text-[13px] font-medium mb-6">
        <Link to="/admin/buses" className="hover:text-[#0EA5E9] transition-colors">Fleet</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-bold">Performance Report</span>
      </nav>

      <div ref={reportRef} className="bg-[#F8FAFC]">
        {/* Header Banner */}
        <div className="bg-[#1E293B] rounded-[40px] p-10 lg:p-12 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl saturate-150" />
          
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-[34px] lg:text-[40px] font-bold tracking-tight">
                  {busDetails.registrationNumber}
                </h1>
                <span className="bg-[#0EA5E9] text-white px-5 py-2 rounded-full text-[13.5px] font-extrabold border border-white/10">
                  {busDetails.nickname || 'Standard Unit'}
                </span>
              </div>
              <p className="text-[19px] lg:text-[22px] text-slate-400 font-medium">
                {busDetails.manufacturer} {busDetails.model} • {busDetails.year}
              </p>
            </div>

            <div className="flex items-center gap-4" data-html2canvas-ignore>
              <button 
                onClick={handleDownloadPDF}
                disabled={isExportingPDF}
                className="flex items-center gap-3 px-8 py-4 bg-white text-[#1E293B] rounded-2xl font-bold text-[15px] hover:bg-slate-50 transition-all shadow-xl active:scale-95 disabled:opacity-70"
              >
                {isExportingPDF ? <Loader2 className="w-5.5 h-5.5 animate-spin" /> : <Download className="w-5.5 h-5.5" />}
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Lifetime Revenue', value: `₦${stats.lifetimeRevenue.toLocaleString()}`, icon: Banknote, color: 'text-[#22C55E]', bg: 'bg-green-50' },
            { label: 'Total Trips', value: stats.totalTrips, icon: Activity, color: 'text-[#0EA5E9]', bg: 'bg-sky-50' },
            { label: 'Total Passengers', value: stats.totalPassengers, icon: Users, color: 'text-[#F59E0B]', bg: 'bg-amber-50' },
            { label: 'Maint. Ratio', value: `${stats.maintenanceRatio}%`, icon: AlertCircle, color: 'text-[#EF4444]', bg: 'bg-red-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
                <stat.icon className={clsx("w-6 h-6", stat.color)} />
              </div>
              <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h2 className="text-[24px] font-black text-[#1E293B]">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Revenue Breakdown */}
          <div className="bg-white rounded-[40px] p-10 lg:p-12 border border-slate-100 shadow-sm">
            <SectionHeader title="Revenue vs. Maintenance" icon={TrendingUp} />
            <div className="h-[300px] w-full flex flex-col md:flex-row items-center gap-10">
              <div className="h-full flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={REVENUE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="100%"
                      paddingAngle={5}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {REVENUE_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `₦${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {REVENUE_DATA.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <div>
                      <p className="text-[13px] font-bold text-slate-500">{item.name}</p>
                      <p className="text-[15px] font-black text-[#1E293B]">₦{item.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Efficiency Metric */}
          <div className="bg-white rounded-[40px] p-10 lg:p-12 border border-slate-100 shadow-sm flex flex-col justify-center">
            <SectionHeader title="Operational Efficiency" icon={Activity} />
            <div className="space-y-8">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[14px] font-bold text-slate-500">Utilization Rate</span>
                  <span className="text-[20px] font-black text-[#0EA5E9]">{stats.utilizationRate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div className="bg-[#0EA5E9] h-full rounded-full" style={{ width: `${stats.utilizationRate}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[14px] font-bold text-slate-500">Passenger Satisfaction</span>
                  <span className="text-[20px] font-black text-[#F59E0B]">{stats.avgRating}/5.0</span>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={clsx("w-6 h-6", s <= Math.floor(stats.avgRating) ? "text-[#F59E0B] fill-[#F59E0B]" : "text-slate-200")} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip History Table */}
        <div className="bg-white rounded-[40px] p-10 lg:p-12 border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <SectionHeader title="Recent Trip History" icon={Calendar} />
            <button 
              onClick={handleExportCSV}
              data-html2canvas-ignore
              className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-[#1E293B] font-bold text-[14px] rounded-2xl hover:bg-slate-100 transition-all border border-slate-200"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 uppercase tracking-widest text-[11px] font-extrabold text-slate-400 border-b border-slate-100">
                  <th className="px-8 py-5">Route</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Revenue</th>
                  <th className="px-8 py-5">Passengers</th>
                  <th className="px-8 py-5 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tripHistory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-400">
                        <Info className="w-10 h-10 opacity-20" />
                        <p className="text-[15px] font-medium">No trip history available for this bus.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  tripHistory.map((trip: any) => (
                    <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-slate-300" />
                          <span className="font-bold text-[#1E293B]">{trip.route}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-500 font-medium">{new Date(trip.date).toLocaleDateString()}</td>
                      <td className="px-8 py-5 font-black text-[#22C55E]">₦{trip.revenue.toLocaleString()}</td>
                      <td className="px-8 py-5 font-bold text-[#1E293B]">{trip.passengers}</td>
                      <td className="px-8 py-5 text-right">
                        <Link to={`/admin/trips/${trip.id}`} className="text-[#0EA5E9] hover:underline font-bold text-[13px]">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BusReport;
