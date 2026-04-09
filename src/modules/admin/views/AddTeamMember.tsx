import { ArrowLeft, Ticket, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddTeamMember = () => {
  return (
    <div className="p-6 max-w-5xl font-sans">
      <Link to="/admin" className="inline-flex items-center text-[#64748B] hover:text-[#0EA5E9] mb-8 transition-colors font-medium text-sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-[28px] font-medium text-[#1E293B] mb-2 tracking-tight">Add Team Member</h1>
        <p className="text-[#64748B]">Choose the type of team member you want to add</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Add Ticketer Card */}
        <Link 
          to="/admin/team/add/ticketer" 
          className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#0EA5E9]/30 transition-all p-8 flex flex-col items-start group"
        >
          <div className="w-16 h-16 rounded-full bg-[#E0F2FE] flex items-center justify-center mb-6">
            <Ticket className="w-8 h-8 text-[#0EA5E9]" />
          </div>
          <h2 className="text-xl font-medium text-[#1E293B] mb-3">Add Ticketer</h2>
          <p className="text-[#64748B] mb-8 leading-relaxed text-[15px]">
            Register a new ticketing agent to manage bookings and ticket sales at stations
          </p>
          <div className="mt-auto flex items-center text-[#0EA5E9] font-medium text-[15px]">
            Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Add Driver Card */}
        <Link 
          to="/admin/team/add/driver"
          className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-[#EC4899]/30 transition-all p-8 flex flex-col items-start group"
        >
          <div className="w-16 h-16 rounded-full bg-[#fce7f3] flex items-center justify-center mb-6">
            <User className="w-8 h-8 text-[#EC4899]" />
          </div>
          <h2 className="text-xl font-medium text-[#1E293B] mb-3">Add Driver</h2>
          <p className="text-[#64748B] mb-8 leading-relaxed text-[15px]">
            Register a new driver with license verification and assignment to fleet vehicles
          </p>
          <div className="mt-auto flex items-center text-[#EC4899] font-medium text-[15px]">
            Get Started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AddTeamMember;
