import React from 'react';
import { BookOpen, BrainCircuit, Share2, Clock } from 'lucide-react';

interface HeaderProps {
  onShareClick?: () => void;
  onHistoryClick: () => void;
  hasResult?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onShareClick, onHistoryClick, hasResult }) => {
  return (
    <header className="w-full py-4 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200/60 support-[backdrop-filter]:bg-white/60">
      <div className="flex items-center gap-2.5 text-slate-800">
        <div className="p-2 bg-slate-900 rounded-xl text-white shadow-lg shadow-indigo-500/20">
          <BrainCircuit size={20} className="md:w-5 md:h-5" />
        </div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight font-serif text-slate-900">
          DeepRead
        </h1>
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        <button 
            onClick={onHistoryClick}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors px-3 py-1.5 rounded-full hover:bg-slate-100 text-sm font-medium"
        >
            <Clock size={16} />
            <span className="hidden md:inline">历史记录</span>
        </button>
        
        {hasResult && (
            <button 
                onClick={onShareClick}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg transform active:scale-95"
            >
                <Share2 size={16} />
                <span className="hidden md:inline">分享长图</span>
                <span className="md:hidden">分享</span>
            </button>
        )}
      </div>
    </header>
  );
};

export default Header;