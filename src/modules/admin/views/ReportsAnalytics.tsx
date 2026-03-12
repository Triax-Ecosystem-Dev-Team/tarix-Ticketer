import { useState } from 'react';
import { 
  Calendar, BarChart2, LineChart, Bus, Users, DollarSign, 
  Download, Eye, Printer, Trash2, 
  RefreshCw, FileSpreadsheet, Plus, Edit2, PauseCircle, X
} from 'lucide-react';
import clsx from 'clsx';

// Mock Data
const REPORT_CARDS = [
  {
    id: 1,
    title: 'Daily Reports',
    description: 'Daily performance metrics and summaries',
    generated: 'Generated today at 11:30 AM',
    metric: '24 trips completed',
    icon: Calendar,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    status: 'Ready'
  },
  {
    id: 2,
    title: 'Weekly Reports',
    description: 'Weekly performance trends and analysis',
    generated: 'Generated yesterday at 6:00 PM',
    metric: '156 trips completed',
    icon: BarChart2,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    status: 'Ready'
  },
  {
    id: 3,
    title: 'Monthly Reports',
    description: 'Comprehensive monthly business analysis',
    generated: 'Generated Nov 30 at 11:59 PM',
    metric: '620 trips completed',
    icon: LineChart,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    status: 'Ready'
  },
  {
    id: 4,
    title: 'Bus Reports',
    description: 'Individual bus performance and utilization',
    generated: 'Generated 1 hour ago',
    metric: '24 buses tracked',
    icon: Bus,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    status: 'Ready'
  },
  {
    id: 5,
    title: 'Driver Reports',
    description: 'Driver performance and earnings summary',
    generated: 'Generated 30 minutes ago',
    metric: '42 drivers tracked',
    icon: Users,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    status: 'Ready'
  },
  {
    id: 6,
    title: 'Revenue Reports',
    description: 'Detailed revenue breakdown and analysis',
    generated: 'Generated 2 hours ago',
    metric: '₦20.5M revenue',
    icon: DollarSign,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    status: 'Ready'
  }
];

const REPORT_HISTORY = [
  { id: 1, name: 'Daily Report - December 1, 2025', type: 'Daily', date: 'Dec 1, 2025 at 11:30 AM', size: '2.5 MB', status: 'Ready' },
  { id: 2, name: 'Weekly Report - Nov 24 - Nov 30, 2025', type: 'Weekly', date: 'Nov 30, 2025 at 11:59 PM', size: '4.2 MB', status: 'Ready' },
  { id: 3, name: 'Monthly Report - November 2025', type: 'Monthly', date: 'Nov 30, 2025 at 11:59 PM', size: '8.7 MB', status: 'Ready' },
  { id: 4, name: 'Bus Performance Report - November 2025', type: 'Bus', date: 'Nov 30, 2025 at 11:00 PM', size: '3.1 MB', status: 'Ready' },
];

const SCHEDULED_REPORTS = [
  { id: 1, name: 'Daily Report', schedule: 'Every day at 11:30 AM', recipients: 'manager@tarix.com, admin@tarix.com', status: 'Active' },
  { id: 2, name: 'Weekly Report', schedule: 'Every Sunday at 11:59 PM', recipients: 'manager@tarix.com', status: 'Active' },
  { id: 3, name: 'Monthly Report', schedule: 'Last day of month at 11:59 PM', recipients: 'manager@tarix.com, finance@tarix.com', status: 'Active' },
];

export default function ReportsAnalytics() {
  const [historyFilter, setHistoryFilter] = useState('All');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto w-full animate-in fade-in duration-300 pb-10">
      {/* Header Section */}
      <div className="bg-[#0ea5e9] -mx-4 sm:-mx-6 -mt-8 px-4 sm:px-6 pt-12 pb-32 mb-8">
        <div className="flex justify-between items-start mb-2">
          <div className="text-white/80 text-sm font-medium">
            Dashboard &gt; Reports & Analytics
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Reports & Analytics Center</h1>
            <p className="text-white/90 text-[15px] font-medium max-w-md leading-relaxed">
              Generate and manage business reports
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white text-[#0ea5e9] px-5 py-2.5 rounded-xl font-bold text-[14px] shadow-sm hover:bg-slate-50 transition-colors">
              <FileSpreadsheet className="w-4 h-4" />
              Generate Report
            </button>
            <button className="p-2.5 text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-colors">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 -mt-24 mb-8">
        {/* ── Report Type Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {REPORT_CARDS.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:border-[#0ea5e9]/30 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center", card.bgColor)}>
                  <card.icon className={clsx("w-6 h-6", card.color)} />
                </div>
                <span className="bg-[#10b981] text-white text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                  {card.status}
                </span>
              </div>
              
              <h3 className="text-[17px] font-bold text-[#1e293b] mb-1.5">{card.title}</h3>
              <p className="text-[13px] text-slate-500 mb-6 flex-1">{card.description}</p>
              
              <div className="mb-6 space-y-1">
                <p className="text-[12px] text-slate-400 font-medium">{card.generated}</p>
                <p className="text-[13px] font-bold text-[#1e293b]">{card.metric}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
                <button className="flex-1 flex justify-center items-center gap-2 py-2 border border-[#0ea5e9]/20 text-[#0ea5e9] bg-[#f0f9ff] hover:bg-[#e0f2fe] rounded-xl text-[13px] font-semibold transition-colors">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button className="flex-1 flex justify-center items-center gap-2 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-xl text-[13px] font-semibold transition-colors">
                  <Download className="w-4 h-4" /> Download
                </button>
                <button className="p-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-xl transition-colors shrink-0">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Report History ── */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#1e293b] mb-1">Report History</h2>
              <p className="text-[13.5px] text-slate-500">Previously generated reports</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 self-start sm:self-auto">
              {['All', 'Daily', 'Weekly', 'Monthly'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setHistoryFilter(filter)}
                  className={clsx(
                    "px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all",
                    historyFilter === filter 
                      ? "bg-[#0ea5e9] text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-4 px-4 rounded-tl-xl w-[35%]">Report Name</th>
                  <th className="py-4 px-4">Type</th>
                  <th className="py-4 px-4">Date Generated</th>
                  <th className="py-4 px-4">Size</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4 rounded-tr-xl text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50/80">
                {REPORT_HISTORY.filter(report => historyFilter === 'All' || report.type === historyFilter).map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4 px-4">
                      <p className="text-[13.5px] font-semibold text-[#1e293b] mb-1">{report.name}</p>
                      <span className="inline-block px-2 py-0.5 bg-[#0ea5e9] text-white text-[10px] font-bold rounded-full">
                        {report.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[13.5px] font-medium text-slate-700">{report.type}</td>
                    <td className="py-4 px-4 text-[13px] text-slate-500">{report.date}</td>
                    <td className="py-4 px-4 text-[13px] font-medium text-slate-600">{report.size}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10b981] text-white text-[11px] font-bold tracking-wide">
                        {report.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-[#0ea5e9] hover:bg-[#e0f2fe] rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-[#0ea5e9] hover:bg-[#e0f2fe] rounded-lg transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-[#ef4444] hover:bg-[#fee2e2] rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Scheduled Reports ── */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-[#1e293b] mb-1">Scheduled Reports</h2>
              <p className="text-[13.5px] text-slate-500">Automatically generated reports</p>
            </div>
            <button 
              onClick={() => setIsScheduleModalOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0ea5e9] text-white rounded-xl text-[14px] font-bold shadow-sm hover:bg-[#0284c7] transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Schedule New Report
            </button>
          </div>

          <div className="space-y-4">
            {SCHEDULED_REPORTS.map((schedule) => (
              <div key={schedule.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-[#0ea5e9]/30 hover:bg-slate-50/50 transition-all gap-4">
                <div>
                  <h3 className="text-[14.5px] font-bold text-[#1e293b] mb-1.5">{schedule.name}</h3>
                  <div className="space-y-1">
                    <p className="text-[13px] text-slate-500 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 shrink-0" /> {schedule.schedule}
                    </p>
                    <p className="text-[13px] text-slate-500 flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 shrink-0" /> {schedule.recipients}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-48">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10b981] text-white text-[11px] font-bold tracking-wide">
                    {schedule.status}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-[#0ea5e9] hover:bg-[#e0f2fe] rounded-lg transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-[#f59e0b] hover:bg-[#fef3c7] rounded-lg transition-colors" title="Pause">
                      <PauseCircle className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-[#ef4444] hover:bg-[#fee2e2] rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Schedule New Report Modal ── */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col font-sans max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <h2 className="text-[20px] font-bold text-[#1e293b]">Schedule New Report</h2>
              <button 
                onClick={() => setIsScheduleModalOpen(false)} 
                className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div>
                <label className="block text-[13.5px] font-semibold text-[#1e293b] mb-2">
                  Report Type <span className="text-[#ef4444]">*</span>
                </label>
                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all appearance-none cursor-pointer">
                  <option value="" disabled selected>Select report type</option>
                  <option value="daily">Daily Report</option>
                  <option value="weekly">Weekly Report</option>
                  <option value="monthly">Monthly Report</option>
                  <option value="bus">Bus Performance Report</option>
                  <option value="driver">Driver Report</option>
                  <option value="revenue">Revenue Report</option>
                </select>
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#1e293b] mb-3">
                  Schedule Frequency <span className="text-[#ef4444]">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input type="radio" name="frequency" value="daily" defaultChecked className="peer sr-only" />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-[#0ea5e9] peer-checked:bg-[#0ea5e9] transition-colors"></div>
                      <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[14.5px] font-medium text-[#1e293b] group-hover:text-[#0ea5e9] transition-colors">Daily</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input type="radio" name="frequency" value="weekly" className="peer sr-only" />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-[#0ea5e9] peer-checked:bg-[#0ea5e9] transition-colors"></div>
                      <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[14.5px] font-medium text-[#1e293b] group-hover:text-[#0ea5e9] transition-colors">Weekly</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input type="radio" name="frequency" value="monthly" className="peer sr-only" />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-[#0ea5e9] peer-checked:bg-[#0ea5e9] transition-colors"></div>
                      <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[14.5px] font-medium text-[#1e293b] group-hover:text-[#0ea5e9] transition-colors">Monthly</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#1e293b] mb-2">
                  Time <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <input type="time" defaultValue="11:30" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#1e293b] mb-2">
                  Email Recipients <span className="text-[#ef4444]">*</span>
                </label>
                <input 
                  type="text" 
                  defaultValue="manager@tarix.com, admin@tarix.com" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-500 focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] transition-all mb-2" 
                />
                <button className="text-[13px] font-medium text-[#0ea5e9] hover:underline flex items-center gap-1">
                  + Add Recipient
                </button>
              </div>

              <div>
                <label className="block text-[13.5px] font-semibold text-[#1e293b] mb-3">
                  Report Format <span className="text-[#ef4444]">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input type="radio" name="format" value="pdf" defaultChecked className="peer sr-only" />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-[#0ea5e9] peer-checked:bg-[#0ea5e9] transition-colors"></div>
                      <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[14.5px] font-medium text-[#1e293b] group-hover:text-[#0ea5e9] transition-colors">PDF</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input type="radio" name="format" value="excel" className="peer sr-only" />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-[#0ea5e9] peer-checked:bg-[#0ea5e9] transition-colors"></div>
                      <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[14.5px] font-medium text-[#1e293b] group-hover:text-[#0ea5e9] transition-colors">Excel</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5">
                      <input type="radio" name="format" value="both" className="peer sr-only" />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-[#0ea5e9] peer-checked:bg-[#0ea5e9] transition-colors"></div>
                      <div className="absolute w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-[14.5px] font-medium text-[#1e293b] group-hover:text-[#0ea5e9] transition-colors">Both</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 sticky bottom-0">
              <button 
                onClick={() => setIsScheduleModalOpen(false)} 
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[14px] font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button className="px-6 py-2.5 bg-[#0ea5e9] text-white rounded-xl text-[14px] font-bold hover:bg-[#0284c7] shadow-sm transition-colors">
                Schedule Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
