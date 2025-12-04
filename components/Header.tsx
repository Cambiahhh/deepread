import React from 'react';
import { BookOpen, BrainCircuit, Share2, Clock, Key } from 'lucide-react';

interface HeaderProps {
  onShareClick?: () => void;
  onHistoryClick: () => void;
  onApiKeyClick: () => void;
  hasResult?: boolean;
  hasUserKey: boolean;
}

const Header: React.FC<HeaderProps> = ({ onShareClick, onHistoryClick, onApiKeyClick, hasResult, hasUserKey }) => {
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
      
      <div className="flex items-center gap-2 md:gap-3">
        <button 
            onClick={onApiKeyClick}
            className={`flex items-center justify-center w-9 h-9 md:w-auto md:h-auto md:px-3 md:py-1.5 rounded-full text-sm font-medium transition-colors border ${hasUserKey ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-100 hover:text-slate-600'}`}
            title={hasUserKey ? "已配置自定义 Key" : "配置 API Key"}
        >
            <Key size={16} />
            <span className="hidden md:inline ml-1.5">{hasUserKey ? '已配置' : '设置 Key'}</span>
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1 hidden md:block"></div>

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