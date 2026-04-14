import { 
  CheckCircle, Download, Share2, Printer, 
  Clock, Bus, Activity, TrendingUp, Banknote,
  ChevronRight, MapPin, Phone, 
  Info, ExternalLink, FileDown
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import clsx from 'clsx';

// ── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_PASSENGERS = [
  { seat: '1A', name: 'Chioma Adebayo', ticketId: 'TKT-8829', checkInTime: '7:55 AM', status: 'Checked In', notes: '—' },
  { seat: '2B', name: 'Emeka Okonkwo', ticketId: 'TKT-8830', checkInTime: '8:10 AM', status: 'Checked In', notes: 'Luggage: 2 bags' },
  { seat: '3A', name: 'Fatima Yusuf', ticketId: 'TKT-8831', checkInTime: '8:05 AM', status: 'Checked In', notes: '—' },
  { seat: '4C', name: 'Oluwaseun Balogun', ticketId: 'TKT-8832', checkInTime: '8:12 AM', status: 'Checked In', notes: '—' },
  { seat: '5C', name: 'Blessing Eze', ticketId: 'TKT-8833', checkInTime: '—', status: 'No Show', notes: 'Refund processed' },
  { seat: '6A', name: 'Ibrahim Mohammed', ticketId: 'TKT-8834', checkInTime: '8:08 AM', status: 'Checked In', notes: '—' },
  { seat: '7B', name: 'Grace Okafor', ticketId: 'TKT-8835', checkInTime: '8:14 AM', status: 'Checked In', notes: 'Extra luggage' },
  { seat: '8C', name: 'Chukwudi Nwosu', ticketId: 'TKT-8836', checkInTime: '8:02 AM', status: 'Checked In', notes: '—' },
];

const REVENUE_DATA = [
  { name: 'Ticket Sales', value: 433200, color: '#0EA5E9' },
  { name: 'Add-ons', value: 22800, color: '#EC4899' },
];

// ── Components ───────────────────────────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-[19px] font-bold text-[#1E293B] mb-8">{title}</h3>
);

const TripReport = () => {
  const { tripId } = useParams();

  return (
    <div className="p-6 lg:p-10 font-sans bg-[#F8FAFC] min-h-screen pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-slate-400 text-[13px] font-medium mb-6">
        <Link to="/admin/trips" className="hover:text-[#0EA5E9] transition-colors">Trips</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/admin/trips/completed" className="hover:text-[#0EA5E9] transition-colors">Completed Trips</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 font-bold">Trip Report</span>
      </nav>

      {/* Main Header Banner */}
      <div className="bg-[#0EA5E9] rounded-[40px] p-10 lg:p-12 text-white shadow-xl shadow-[#0EA5E9]/15 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl saturate-150" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-2xl opacity-60" />

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h1 className="text-[34px] lg:text-[40px] font-bold tracking-tight">
                Trip #{tripId || 'TRP-001248'} - Completed
              </h1>
              <span className="bg-[#22C55E] text-white px-5 py-2 rounded-full text-[13.5px] font-extrabold flex items-center gap-2 border-2 border-white/20 shadow-lg">
                <CheckCircle className="w-4.5 h-4.5" />
                Completed
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-white/90 font-bold tracking-tight">
              <span className="text-[19px] lg:text-[22px]">Lagos → Owerri • 450 km</span>
              <div className="hidden sm:block w-2 h-2 rounded-full bg-white/25" />
              <span className="text-[17px] lg:text-[18px]">Completed Today at 4:35 PM</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#0EA5E9] rounded-2xl font-bold text-[15px] hover:bg-white/95 transition-all shadow-xl shadow-black/5 active:scale-95">
              <Download className="w-5.5 h-5.5" />
              Download Report
            </button>
            <div className="flex items-center gap-3">
              {[Share2, Printer].map((Icon, i) => (
                <button key={i} className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/15 transition-all active:scale-95 backdrop-blur-sm">
                  <Icon className="w-5.5 h-5.5" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trip Timeline */}
      <div className="bg-white rounded-[40px] p-10 lg:p-12 border border-slate-100 shadow-sm mb-10 overflow-hidden">
        <SectionHeader title="Trip Timeline" />
        
        <div className="relative pt-4 pb-8">
          <div className="absolute top-[32px] left-[10%] right-[10%] h-[3px] bg-[#F1F5F9] -z-0" />
          <div className="absolute top-[32px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-[#0EA5E9] via-[#0EA5E9] to-[#22C55E] -z-0" />

          <div className="grid grid-cols-4 relative z-10 font-sans">
            {[
              { label: 'Scheduled', time: '8:00 AM', icon: Clock, color: 'text-[#0EA5E9]', bg: 'bg-[#E0F2FE]' },
              { label: 'Departed', time: '8:15 AM', icon: Bus, color: 'text-[#0EA5E9]', bg: 'bg-[#E0F2FE]', delay: '+15 min delay' },
              { label: 'In Transit', time: '8h 20m', icon: Activity, color: 'text-[#0EA5E9]', bg: 'bg-[#E0F2FE]' },
              { label: 'Arrived', time: '4:35 PM', icon: CheckCircle, color: 'text-[#22C55E]', bg: 'bg-[#DCFCE7]', active: true },
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={clsx(
                  "w-16 h-16 rounded-full border-[5px] border-white shadow-md flex items-center justify-center mb-6 transition-transform hover:scale-110 duration-300 cursor-default",
                  step.bg
                )}>
                  <step.icon className={clsx("w-8 h-8", step.color)} />
                </div>
                <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-1">{step.label}</p>
                <p className={clsx("text-[20px] font-extrabold tracking-tight", step.active ? 'text-[#22C55E]' : 'text-[#1E293B]')}>
                  {step.time}
                </p>
                {step.delay && (
                  <span className="mt-3 bg-amber-50 text-amber-500 text-[10.5px] font-bold px-3 py-1.5 rounded-lg border border-amber-100 uppercase tracking-widest">
                    {step.delay}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Information Cards Row */}
      <div className="bg-white rounded-[40px] p-10 lg:p-12 border border-slate-100 shadow-sm mb-10">
        <SectionHeader title="Detailed Trip Information" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          {/* Left Column: Route & Times */}
          <div className="space-y-12">
            <div>
              <p className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest mb-6">Route Information</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
                  <MapPin className="w-4.5 h-4.5 text-[#0EA5E9]" />
                </div>
                <h4 className="text-[20px] font-bold text-[#1E293B]">Lagos → Owerri</h4>
              </div>
              <p className="text-[15px] text-slate-400 font-bold ml-12">Distance: 450 km</p>
            </div>

            <div>
              <p className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest mb-6">Scheduled vs Actual Times</p>
              <div className="space-y-5 ml-2">
                {[
                  { label: 'Scheduled Departure:', value: '8:00 AM' },
                  { label: 'Actual Departure:', value: '8:15 AM', color: 'text-[#D97706]' },
                  { label: 'Scheduled Arrival:', value: '4:30 PM' },
                  { label: 'Actual Arrival:', value: '4:35 PM', color: 'text-[#22C55E]' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center max-w-md">
                    <span className="text-[15px] font-bold text-slate-400">{row.label}</span>
                    <span className={clsx("text-[16px] font-extrabold", row.color || 'text-[#1E293B]')}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Driver & Bus */}
          <div className="space-y-12 lg:border-l lg:border-slate-50 lg:pl-16">
            <div>
              <p className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest mb-6">Driver Information</p>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-[#0EA5E9] text-white flex items-center justify-center text-[18px] font-bold shadow-lg shadow-[#0EA5E9]/20">
                  AH
                </div>
                <div>
                  <h4 className="text-[22px] font-bold text-[#1E293B]">Ahmed Hassan</h4>
                  <p className="text-[14px] text-slate-400 font-bold mb-1">Driver ID: DRV-0847</p>
                  <a href="tel:+2348012345678" className="flex items-center gap-2 text-[#0EA5E9] font-bold hover:underline">
                    <Phone className="w-4 h-4" />
                    +234 801 234 5678
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-[11px] font-extrabold text-slate-300 uppercase tracking-widest mb-6">Bus Information</p>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                  <Bus className="w-5.5 h-5.5 text-[#EC4899]" />
                </div>
                <h4 className="text-[19px] font-bold text-[#1E293B]">Plate Num</h4>
              </div>
              <p className="text-[15px] text-slate-400 font-bold ml-14">Capacity: 50 seats</p>
            </div>
          </div>
        </div>
      </div>

      {/* Passenger Manifest */}
      <div className="bg-white rounded-[40px] p-10 lg:p-12 border border-slate-100 shadow-sm mb-10 overflow-hidden font-sans">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-[20px] font-bold text-[#1E293B] mb-1">Passenger Manifest</h3>
            <p className="text-[14px] text-slate-400 font-bold">48 passengers checked in</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[#0EA5E9] font-bold text-[14px] hover:bg-slate-50 transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export as CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 uppercase tracking-widest text-[11px] font-extrabold text-slate-400 border-b border-slate-100">
                <th className="px-8 py-5">Seat</th>
                <th className="px-8 py-5">Passenger Name</th>
                <th className="px-8 py-5">Ticket ID</th>
                <th className="px-8 py-5">Check-In Time</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right pr-12">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_PASSENGERS.map((p, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
                  <td className="px-8 py-5 font-bold text-[#1E293B] text-[15px]">{p.seat}</td>
                  <td className="px-8 py-5 font-bold text-[#1E293B] text-[15px]">{p.name}</td>
                  <td className="px-8 py-5 font-bold text-[#0EA5E9] text-[14px]">{p.ticketId}</td>
                  <td className="px-8 py-5 text-slate-400 font-bold text-[14px]">{p.checkInTime}</td>
                  <td className="px-8 py-5">
                    <span className={clsx(
                      "px-3 py-1.5 rounded-xl text-[12px] font-bold shadow-sm inline-block",
                      p.status === 'Checked In' ? "bg-green-50 text-[#16A34A]" : "bg-red-50 text-[#EF4444]"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right pr-12 text-slate-400 text-[14px] font-medium font-serif italic">
                    {p.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
        {/* Revenue Summary */}
        <div className="bg-white rounded-[40px] p-10 lg:p-12 border border-slate-100 shadow-sm relative pr-16">
          <SectionHeader title="Revenue Summary" />
          <div className="space-y-6 pt-2">
            {[
              { label: 'Total Tickets Sold:', value: '48', bold: true },
              { label: 'Ticket Price:', value: '₦9,500' },
              { label: 'Gross Revenue:', value: '₦456,000', color: 'text-[#22C55E]', bold: true },
              { label: 'Deductions:', value: '₦0', color: 'text-slate-400' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                <span className="text-[17px] font-bold text-slate-400 tracking-tight">{row.label}</span>
                <span className={clsx("text-[20px] font-extrabold tracking-tight", row.color || 'text-[#1E293B]')}>{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-8 mt-4 border-t-2 border-slate-50">
              <span className="text-[19px] font-extrabold text-[#1E293B]">Net Revenue:</span>
              <span className="text-[28px] font-black text-[#22C55E] tracking-tight">₦456,000</span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown Donut */}
        <div className="bg-white rounded-[40px] p-10 lg:p-12 border border-slate-100 shadow-sm">
          <SectionHeader title="Revenue Breakdown" />
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
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {REVENUE_DATA.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="space-y-6 min-w-0 md:w-64">
              {REVENUE_DATA.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-md flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-slate-500 truncate leading-none mb-1.5">{item.name} ({i === 0 ? '95%' : '5%'})</p>
                    <p className="text-[17px] font-extrabold text-[#1E293B] leading-none">₦{item.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Driver Earnings & Incentives */}
      <div className="bg-[#FEF9C3]/50 rounded-[40px] p-10 lg:p-12 border-2 border-[#FEF3C7] shadow-sm mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-[#EAB308]/10 pointer-events-none">
          <Banknote className="w-64 h-64 -mr-16 -mt-16 rotate-12" />
        </div>

        <h3 className="text-[20px] font-bold text-[#854D0E] mb-10 flex items-center gap-3 relative z-10">
          <TrendingUp className="w-6 h-6" />
          Driver Earnings & Incentives
        </h3>
        
        <div className="max-w-3xl relative z-10">
          <p className="text-[12px] font-black text-[#A16207] uppercase tracking-widest mb-8">Earnings Breakdown</p>
          <div className="space-y-6 mb-10">
            {[
              { label: 'Base Earnings:', value: '₦20,520' },
              { label: 'Bonus (On-Time):', value: '+₦2,000', color: 'text-[#16A34A]' },
              { label: 'Bonus (Safety):', value: '+₦280', color: 'text-[#16A34A]' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center text-[18px] font-bold">
                <span className="text-[#854D0E]/70">{row.label}</span>
                <span className={clsx("font-extrabold", row.color || 'text-[#451A03]')}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t-2 border-[#FEF3C7] flex justify-between items-center">
            <span className="text-[20px] font-black text-[#A16207]">Total Earnings:</span>
            <span className="text-[32px] font-black text-[#854D0E]">₦22,800</span>
          </div>
        </div>
      </div>

      {/* Footer Info / Actions */}
      <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
            <Info className="w-8 h-8" />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-[20px] font-bold text-[#1E293B] mb-1">Need More Details?</h4>
            <p className="text-[15px] text-slate-500 font-bold">View the full trip report with detailed analytics and insights.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-8 py-4 bg-[#0EA5E9] text-white rounded-2xl font-bold text-[15px] hover:bg-[#0284c7] transition-all shadow-lg active:scale-95">
            <ExternalLink className="w-5 h-5" />
            View Full Trip Report
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-white border border-[#0EA5E9] text-[#0EA5E9] rounded-2xl font-bold text-[15px] hover:bg-sky-50 transition-all active:scale-95">
            <FileDown className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripReport;
