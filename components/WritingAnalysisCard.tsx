import React, { useState } from 'react';
import { Feather, Target, Zap, Layout, ChevronDown, ChevronUp } from 'lucide-react';
import { WritingAnalysis } from '../types';

const WritingAnalysisCard: React.FC<{ analysis: WritingAnalysis }> = ({ analysis }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden h-fit">
      {/* Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 md:p-6 flex items-center justify-between cursor-pointer hover:bg-emerald-50/30 transition-colors border-b border-emerald-50"
      >
        <div>
            <h3 className="text-emerald-600 font-semibold uppercase tracking-wider text-xs mb-1 flex items-center gap-1">
                <Feather size={14} /> 创作者视角
            </h3>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 text-balance">爆文逻辑拆解</h2>
        </div>
        <div className="text-emerald-400">
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-5 md:p-8 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Tone & Audience */}
                <div className="space-y-4">
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                        <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm">
                            <Target size={16} />
                            <span>目标受众 & 调性</span>
                        </div>
                        <p className="text-slate-700 text-sm mb-2"><span className="font-semibold">调性：</span>{analysis.tone}</p>
                        <p className="text-slate-700 text-sm"><span className="font-semibold">受众：</span>{analysis.audience}</p>
                    </div>

                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50">
                         <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm">
                            <Layout size={16} />
                            <span>文章结构框架</span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed text-balance">
                            {analysis.structure}
                        </p>
                    </div>
                </div>

                {/* Viral Factors */}
                <div>
                    <h4 className="text-sm font-bold text-emerald-800 mb-3 flex items-center gap-2">
                        <Zap size={16} />
                        传播因子 (Viral Hooks)
                    </h4>
                    <ul className="space-y-2">
                        {analysis.viralFactors.map((factor, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2" />
                                <span className="text-slate-700 text-sm leading-relaxed text-balance">{factor}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-100 italic">
                        💡 深度阅读提示：关注作者如何利用这些心理锚点来引导读者的情绪起伏。
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default WritingAnalysisCard;