import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { AnalysisResult } from '../types';

const SummaryCard: React.FC<{ data: AnalysisResult }> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-50 overflow-hidden mb-6">
      {/* Header / Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 md:p-6 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50 transition-colors select-none"
      >
        <div className="flex-1 pr-4">
             <h3 className="text-indigo-600 font-semibold uppercase tracking-wider text-xs mb-2 flex items-center gap-1">
                <Sparkles size={14} /> 文章精华
             </h3>
             <h2 className="text-xl md:text-3xl font-bold text-slate-900 font-serif leading-tight text-balance">{data.title}</h2>
        </div>
        <div className="text-slate-400 flex-shrink-0">
            {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="px-5 md:px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="mb-6 md:mb-8 text-slate-700 text-base md:text-lg leading-relaxed italic opacity-90 border-l-4 border-slate-200 pl-4 py-1 bg-slate-50/50 rounded-r-lg">
                "{data.summary}"
            </div>

            <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase mb-3 md:mb-4">核心洞察</h4>
                <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                {data.keyInsights.map((insight, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
                    <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs md:text-sm font-bold mt-0.5">
                        {idx + 1}
                    </span>
                    <p className="text-slate-700 font-medium text-sm md:text-base leading-snug">{insight}</p>
                    </div>
                ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;