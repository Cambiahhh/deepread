import React, { useState } from 'react';
import { ArrowRight, Link2, Search, Loader2, FileText, AlignLeft, Zap } from 'lucide-react';

interface UrlInputProps {
  onAnalyze: (input: string, type: 'url' | 'text') => void;
  isLoading: boolean;
  hasUserKey: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading, hasUserKey }) => {
  const [mode, setMode] = useState<'url' | 'text'>('url');
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onAnalyze(input.trim(), mode);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 md:my-20 px-4 relative z-10">
      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 font-serif leading-tight tracking-tight">
            洞察本质<span className="text-indigo-600">.</span>
        </h2>
        <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light text-balance">
            DeepRead 是一款 AI 驱动的深度阅读助手。我们为您从复杂的长文中提取逻辑脉络、批判性视角与创作机理。
        </p>
      </div>

      <div className="bg-white p-2 rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100">
          {/* Tabs */}
          <div className="flex mb-2 px-1">
            <button 
                onClick={() => setMode('url')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'url' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <Link2 size={16} />
                文章链接
            </button>
            <button 
                onClick={() => setMode('text')}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${mode === 'text' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <AlignLeft size={16} />
                文本粘贴
            </button>
          </div>

          <form 
            onSubmit={handleSubmit} 
            className={`relative flex flex-col md:flex-row items-center gap-2 p-1`}
          >
            {mode === 'url' ? (
                <div className="relative flex-1 w-full">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                        <Link2 size={20} />
                    </div>
                    <input
                        type="url"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="在此粘贴文章链接..."
                        className="w-full pl-12 pr-4 py-4 outline-none text-slate-800 placeholder-slate-300 text-lg bg-transparent font-medium"
                        required={mode === 'url'}
                    />
                </div>
            ) : (
                <div className="relative w-full p-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="在此粘贴长文本内容..."
                        className="w-full p-4 outline-none text-slate-800 placeholder-slate-300 text-base bg-slate-50 rounded-xl min-h-[140px] resize-y border-transparent focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all"
                        required={mode === 'text'}
                    />
                </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !input}
              className={`bg-slate-900 hover:bg-black text-white rounded-2xl px-8 py-4 font-semibold text-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${mode === 'text' ? 'w-full mt-2' : 'w-full md:w-auto self-stretch'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={22} />
                  <span>解析中</span>
                </>
              ) : (
                <>
                  <span>开始阅读</span>
                  <ArrowRight size={22} />
                </>
              )}
            </button>
          </form>
      </div>

      <div className="mt-8 flex justify-center gap-4 md:gap-6 text-xs md:text-sm font-medium flex-wrap">
        <span className="flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full border border-slate-100 backdrop-blur-sm text-slate-400">
            <Search size={14} className="text-indigo-500"/> 
            Google Search Grounding
        </span>
        
        {hasUserKey ? (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100 text-amber-700 backdrop-blur-sm animate-in fade-in">
                <Zap size={14} className="text-amber-500 fill-amber-500"/> 
                Model: Gemini 2.0 Pro (Max)
            </span>
        ) : (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white/50 rounded-full border border-slate-100 backdrop-blur-sm text-slate-400">
                <FileText size={14} className="text-slate-400"/> 
                Model: Gemini 2.5 Flash
            </span>
        )}
      </div>
    </div>
  );
};

export default UrlInput;