import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface EscapeHatchProps {
  to: string;
  label: string;
}

const EscapeHatch: React.FC<EscapeHatchProps> = ({ to = '/', label = 'Back' }) => {
  const navigate = useNavigate();
  return (
    <button 
      onClick={() => navigate(to)}
      className="flex items-center gap-2 text-sm font-bold text-primary-blue mb-6 hover:underline group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> {label}
    </button>
  );
};

export default EscapeHatch;
