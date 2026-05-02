import React from 'react';
import { HelpCircle, ChevronRight, MessageSquare, Phone, Mail } from 'lucide-react';

const FAQs = [
  {
    question: "How do I update a passenger's seat after booking?",
    answer: "Currently, seat updates must be handled by cancelling the existing ticket and re-booking. We are working on a dedicated 'Swap Seat' feature for the next update."
  },
  {
    question: "What is the maximum weight for extra baggage?",
    answer: "Standard baggage is included up to 10kg. Extra baggage is charged per 5kg increments. Maximum weight per passenger is 50kg."
  },
  {
    question: "How do I process a refund?",
    answer: "Refunds can be initiated through the 'Find Ticket' module. Select the ticket and click 'Cancel/Refund'. Note that a 10% administrative fee applies to all cancellations."
  },
  {
    question: "The terminal printer is not responding. What should I do?",
    answer: "First, check the USB/Network connection. Restart the printer and the dashboard. If the issue persists, contact IT support via the 'Report a Bug' link in your settings."
  }
];

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Help Center</h1>
        <p className="text-slate-500 text-sm">Find answers to frequently asked questions and get support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare className="w-6 h-6 text-[#0ea5e9]" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Live Chat</h3>
          <p className="text-xs text-slate-500 mb-4">Chat with our operations support team</p>
          <button className="text-[13px] font-bold text-[#0ea5e9] hover:underline flex items-center gap-1">
            Start Chat <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Phone className="w-6 h-6 text-emerald-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Call Support</h3>
          <p className="text-xs text-slate-500 mb-4">24/7 emergency terminal support</p>
          <p className="text-[13px] font-bold text-emerald-600">+234 (0) 700 TARIX HELP</p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Mail className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Email</h3>
          <p className="text-xs text-slate-500 mb-4">For non-urgent administrative queries</p>
          <p className="text-[13px] font-bold text-purple-600">ops@tarix.com</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#0ea5e9]" />
            <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {FAQs.map((faq, index) => (
            <div key={index} className="p-6 hover:bg-slate-50/50 transition-colors">
              <h3 className="text-[15px] font-bold text-slate-800 mb-2">{faq.question}</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
