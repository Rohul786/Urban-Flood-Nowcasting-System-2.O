import React from 'react';
import { useFlood } from '../context/FloodContext';
import { Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useFlood();
  if (!toastMessage) return null;

  return (
    <div className="fixed top-14 right-6 z-50 animate-in fade-in slide-in-from-top-3 duration-200 font-mono">
      <div className="bg-[#0A0E14] border border-[#00D1FF] text-white text-xs font-mono px-4 py-2.5 rounded shadow-[0_0_20px_rgba(0,209,255,0.25)] flex items-center gap-3">
        <Info className="w-4 h-4 text-[#00D1FF] flex-shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
};
