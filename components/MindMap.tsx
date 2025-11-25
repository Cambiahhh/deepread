import React, { useState } from 'react';
import { GitMerge, ArrowDown, ChevronDown, ChevronUp } from 'lucide-react';
import { MindMapNode } from '../types';

const MindMap: React.FC<{ flow: MindMapNode[] }> = ({ flow }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-fit overflow-hidden">
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100"
      >
        <div>
            <h3 className="text-slate-500 font-semibold uppercase tracking-wider text-xs mb-1 flex items-center gap-1">
                <GitMerge size={14} /> 逻辑流
            </h3>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 text-balance">思维脉络</h2>
        </div>
        <div className="text-slate-400">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-5 md:p-8 relative animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Continuous Vertical Line */}
            {flow.length > 1 && (
            <div className="absolute left-9 md:left-12 top-8 bottom-12 w-0.5 bg-slate-200 transform -translate-x-1/2" />
            )}

            <div className="space-y-6 md:space-y-8">
                {flow.map((step, index) => (
                <div key={index} className="relative flex items-start gap-3 md:gap-4 group">
                    {/* Node Column */}
                    <div className="relative z-10 flex-shrink-0 w-8 flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-indigo-500 text-indigo-600 flex items-center justify-center text-sm font-bold shadow-sm group-hover:scale-110 transition-transform group-hover:bg-indigo-50">
                            {index + 1}
                        </div>
                        {index < flow.length - 1 && (
                            <div className="mt-2 text-slate-300 md:hidden">
                                <ArrowDown size={12} />
                            </div>
                        )}
                    </div>

                    {/* Content Column */}
                    <div className="flex-1 pt-0.5">
                        <div className="bg-slate-50 hover:bg-indigo-50 rounded-xl p-3 md:p-4 border border-slate-100 transition-colors relative">
                            {/* Triangle Pointer */}
                            <div className="absolute top-3 -left-1.5 w-3 h-3 bg-slate-50 border-l border-b border-slate-100 transform rotate-45 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors" />
                            
                            <h4 className="text-slate-900 font-bold mb-1 text-sm md:text-base text-balance">{step.label}</h4>
                            <p className="text-slate-600 text-xs md:text-sm leading-relaxed text-balance">{step.description}</p>
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default MindMap;