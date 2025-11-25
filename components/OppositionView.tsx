import React, { useState } from 'react';
import { ShieldAlert, Users, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { CounterArgument, RelatedView } from '../types';

interface OppositionViewProps {
  counterArguments: CounterArgument[];
  similarViews: RelatedView[];
}

const OppositionView: React.FC<OppositionViewProps> = ({ counterArguments, similarViews }) => {
  const [isCounterOpen, setIsCounterOpen] = useState(true);
  const [isSimilarOpen, setIsSimilarOpen] = useState(true);

  return (
    <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
      {/* Devil's Advocate (Counter Arguments) */}
      <div className="bg-white rounded-2xl shadow-sm border border-red-100 h-fit overflow-hidden">
        <div 
            onClick={() => setIsCounterOpen(!isCounterOpen)}
            className="p-5 md:p-6 border-b border-red-50 flex items-center justify-between cursor-pointer hover:bg-red-50/30 transition-colors"
        >
            <div>
                <h3 className="text-red-500 font-semibold uppercase tracking-wider text-xs mb-1 flex items-center gap-1">
                    <ShieldAlert size={14} /> 反方视角
                </h3>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 text-balance">批判性思考</h2>
            </div>
            <div className="text-red-300">
                {isCounterOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
        </div>
        
        {isCounterOpen && (
            <div className="p-5 md:p-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                {counterArguments.map((arg, idx) => (
                    <div key={idx} className="p-3 md:p-4 rounded-lg bg-red-50/50 border border-red-100">
                    <div className="flex items-start gap-2 mb-2">
                        <Scale className="text-red-400 mt-0.5 flex-shrink-0" size={16} />
                        <p className="text-slate-900 font-semibold text-sm leading-snug text-balance">{arg.point}</p>
                    </div>
                    <p className="text-slate-600 text-sm pl-6 border-l-2 border-red-200 leading-relaxed text-balance">{arg.rebuttal}</p>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Similar Views */}
      <div className="bg-white rounded-2xl shadow-sm border border-blue-100 h-fit overflow-hidden">
        <div 
            onClick={() => setIsSimilarOpen(!isSimilarOpen)}
            className="p-5 md:p-6 border-b border-blue-50 flex items-center justify-between cursor-pointer hover:bg-blue-50/30 transition-colors"
        >
            <div>
                <h3 className="text-blue-500 font-semibold uppercase tracking-wider text-xs mb-1 flex items-center gap-1">
                    <Users size={14} /> 知识联想
                </h3>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 text-balance">过往相似观点</h2>
            </div>
            <div className="text-blue-300">
                {isSimilarOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
        </div>

        {isSimilarOpen && (
            <div className="p-5 md:p-8 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {similarViews.map((view, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-3 md:p-4 rounded-lg bg-blue-50/30 border border-blue-100">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-800 text-sm md:text-base">{view.thinker}</h4>
                </div>
                <p className="text-slate-700 text-sm font-medium leading-snug text-balance">{view.perspective}</p>
                <p className="text-slate-500 text-xs mt-1 text-balance">{view.context}</p>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default OppositionView;