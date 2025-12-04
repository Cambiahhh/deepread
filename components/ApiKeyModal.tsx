import React, { useState, useEffect } from 'react';
import { Key, Save, X, ExternalLink, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyChange: (hasKey: boolean) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'cleared'>('idle');

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('deepread_user_api_key');
      if (savedKey) {
        setApiKey(savedKey);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKey.trim()) {
      handleClear();
      return;
    }
    localStorage.setItem('deepread_user_api_key', apiKey.trim());
    setStatus('saved');
    onKeyChange(true);
    setTimeout(() => {
        setStatus('idle');
        onClose();
    }, 1000);
  };

  const handleClear = () => {
    localStorage.removeItem('deepread_user_api_key');
    setApiKey('');
    setStatus('cleared');
    onKeyChange(false);
    setTimeout(() => setStatus('idle'), 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                <Key size={18} />
            </div>
            配置 API Key
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700 leading-relaxed">
            <p className="flex gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>
                默认线路有每日使用限制。建议配置您自己的 <strong>Google Gemini API Key</strong> 以获得更稳定、无限额的体验。
                <br />
                <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold underline mt-1 hover:text-blue-800"
                >
                    去 Google AI Studio 免费获取 <ExternalLink size={12} />
                </a>
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">您的 API KEY</label>
            <div className="relative">
                <input 
                    type={isVisible ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-mono text-sm"
                />
                <button 
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                    {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            <p className="text-xs text-slate-400">Key 仅存储在您浏览器的本地缓存中，不会发送给第三方服务器。</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button 
                onClick={handleClear}
                className="text-sm text-slate-500 hover:text-red-500 font-medium transition-colors"
            >
                清除 Key
            </button>
            <button 
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white transition-all transform active:scale-95 shadow-md ${status === 'saved' ? 'bg-green-500 hover:bg-green-600' : 'bg-slate-900 hover:bg-black'}`}
            >
                {status === 'saved' ? (
                    <>
                        <CheckCircle2 size={18} />
                        已保存
                    </>
                ) : (
                    <>
                        <Save size={18} />
                        保存配置
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;