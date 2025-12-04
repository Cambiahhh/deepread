import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import SummaryCard from './components/SummaryCard';
import MindMap from './components/MindMap';
import OppositionView from './components/OppositionView';
import WritingAnalysisCard from './components/WritingAnalysisCard';
import GroundingSources from './components/GroundingSources';
import ShareModal from './components/ShareModal';
import HistoryDrawer from './components/HistoryDrawer';
import ApiKeyModal from './components/ApiKeyModal';
import { analyzeContent } from './services/geminiService';
import { AnalysisResult, GroundingSource, HistoryItem } from './types';
import { AlertTriangle } from 'lucide-react';

const STORAGE_KEY = 'deepread_history_v1';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Modal States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [hasUserKey, setHasUserKey] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Check for user key on mount
  useEffect(() => {
    const key = localStorage.getItem('deepread_user_api_key');
    setHasUserKey(!!key);
  }, []);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save history whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const addToHistory = (
    data: AnalysisResult, 
    sources: GroundingSource[], 
    input: string, 
    type: 'url' | 'text'
  ) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      type,
      input,
      data,
      groundingChunks: sources
    };
    
    // Add to top, prevent generic duplicates
    setHistory(prev => {
      const filtered = prev.filter(item => item.input !== input);
      return [newItem, ...filtered].slice(0, 50); 
    });
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResult(item.data);
    setGroundingSources(item.groundingChunks);
    setCurrentUrl(item.type === 'url' ? item.input : null);
    setError(null);
    setIsHistoryOpen(false);
    
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleAnalyze = async (input: string, type: 'url' | 'text') => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    if (type === 'url') {
        setCurrentUrl(input);
    } else {
        setCurrentUrl(null);
    }
    
    try {
      const response = await analyzeContent(input, type);
      if (response.data) {
        setResult(response.data);
        setGroundingSources(response.groundingChunks || []);
        addToHistory(response.data, response.groundingChunks || [], input, type);
        setTimeout(() => {
            resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        setError("无法分析该内容。");
      }
    } catch (err: any) {
      let msg = err.message || "发生未知错误。";
      if (msg.includes("JSON")) {
         msg = "内容过于复杂或无法访问，请尝试直接粘贴文本。";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 relative overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background Mesh Gradient */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-50/80 via-white to-transparent -z-10" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply" />

      <Header 
        hasResult={!!result} 
        hasUserKey={hasUserKey}
        onShareClick={() => setIsShareModalOpen(true)} 
        onHistoryClick={() => setIsHistoryOpen(true)}
        onApiKeyClick={() => setIsApiKeyModalOpen(true)}
      />
      
      <main className="container mx-auto px-4 md:px-6 relative z-0">
        <div className="transition-all duration-700 ease-out">
            <UrlInput onAnalyze={handleAnalyze} isLoading={loading} hasUserKey={hasUserKey} />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto bg-white border border-red-100 p-6 rounded-2xl flex items-start gap-4 mb-8 animate-fade-in shadow-xl shadow-red-500/5">
            <div className="p-2 bg-red-50 rounded-full text-red-500">
                <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-lg">分析中断</h3>
              <p className="text-slate-600 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div ref={resultRef} className="max-w-6xl mx-auto animate-fade-in-up space-y-6 md:space-y-8 pb-12">
            
            <SummaryCard data={result} />

            <div className="grid lg:grid-cols-12 gap-6 md:gap-8">
                {/* MindMap - 4 Cols */}
                <div className="lg:col-span-4 h-full">
                   <MindMap flow={result.logicalFlow} />
                </div>

                {/* Analysis - 8 Cols */}
                <div className="lg:col-span-8 space-y-6 md:space-y-8 flex flex-col">
                    {result.writingAnalysis && (
                         <WritingAnalysisCard analysis={result.writingAnalysis} />
                    )}

                    <OppositionView 
                        counterArguments={result.counterArguments}
                        similarViews={result.similarViews}
                    />
                </div>
            </div>

            <GroundingSources sources={groundingSources} />
          </div>
        )}
      </main>

      {/* Overlays */}
      {result && (
        <ShareModal 
            isOpen={isShareModalOpen} 
            onClose={() => setIsShareModalOpen(false)} 
            data={result} 
            url={currentUrl}
        />
      )}

      <HistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
        onDelete={deleteHistoryItem}
        onClearAll={clearHistory}
      />

      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyChange={setHasUserKey}
      />
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;