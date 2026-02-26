import clsx from 'clsx';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications = [
  { id: 1, text: 'Trip TRP-001245 completed', time: '2 minutes ago' },
  { id: 2, text: 'New driver registered', time: '15 minutes ago' },
  { id: 3, text: 'Bus BUS-045 maintenance due', time: '1 hour ago' },
];

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop to dismiss when clicking outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Dropdown Panel */}
      <div 
        className="absolute right-0 top-12 mt-2 w-[340px] bg-white rounded-xl
                   shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#e2e8f0] z-50
                   origin-top-right animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-[#f1f5f9]">
          <h3 className="text-[17px] font-semibold text-[#1a2233]">Notifications</h3>
        </div>
        
        {/* List */}
        <div className="flex flex-col">
          {mockNotifications.map((n, i) => (
            <div 
              key={n.id} 
              className={clsx(
                "px-5 py-3.5 hover:bg-[#f8fafc] cursor-pointer transition-colors",
                i !== mockNotifications.length - 1 && "border-b border-[#f1f5f9]"
              )}
            >
              <p className="text-[14px] font-medium text-[#475569] mb-1">{n.text}</p>
              <p className="text-[12.5px] text-[#94a3b8]">{n.time}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
