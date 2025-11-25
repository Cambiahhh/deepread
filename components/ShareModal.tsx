import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Check, Image as ImageIcon, Loader2, Smartphone, Monitor, Link2, Palette, Eye, Settings2 } from 'lucide-react';
import { toPng } from 'html-to-image';
import QRCode from 'qrcode';
import { AnalysisResult } from '../types';
import SummaryCard from './SummaryCard';
import MindMap from './MindMap';
import OppositionView from './OppositionView';
import WritingAnalysisCard from './WritingAnalysisCard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: AnalysisResult;
  url: string | null;
}

type ThemeKey = 'modern' | 'classic' | 'dark' | 'simple';

const THEMES: Record<ThemeKey, { name: string, bg: string, ring: string }> = {
    modern: { name: '现代', bg: 'bg-white', ring: 'ring-indigo-500' },
    classic: { name: '经典', bg: 'bg-[#F4F1EA]', ring: 'ring-[#8B4513]' },
    dark: { name: '暗夜', bg: 'bg-[#0f172a]', ring: 'ring-sky-500' },
    simple: { name: '极简', bg: 'bg-white', ring: 'ring-slate-900' },
};

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data, url }) => {
  const [sections, setSections] = useState({
    summary: true,
    mindmap: true,
    opposition: true,
    writing: true,
  });
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');
  const [theme, setTheme] = useState<ThemeKey>('modern');
  const [activeTab, setActiveTab] = useState<'settings' | 'preview'>('settings'); // Mobile only
  const [isGenerating, setIsGenerating] = useState(false);
  const [fontStyles, setFontStyles] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;700;900&display=swap';
    fetch(fontUrl)
      .then(res => res.text())
      .then(css => setFontStyles(css))
      .catch(err => console.warn('Font load error:', err));
  }, []);

  const effectiveUrl = url || manualUrl;

  useEffect(() => {
    if (effectiveUrl && effectiveUrl.trim()) {
        QRCode.toDataURL(effectiveUrl.trim(), { 
            margin: 1, 
            width: 120, 
            color: { 
                dark: theme === 'dark' ? '#e2e8f0' : '#1e293b', 
                light: theme === 'dark' ? '#1e293b' : '#ffffff' 
            } 
        })
            .then(dataUrl => setQrCodeUrl(dataUrl))
            .catch(err => console.error("QR Gen Error", err));
    } else {
        setQrCodeUrl(null);
    }
  }, [effectiveUrl, theme]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (previewRef.current === null) return;
    setIsGenerating(true);

    const width = mode === 'desktop' ? 800 : 420;

    try {
      // Small delay to ensure render
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await toPng(previewRef.current, { 
        cacheBust: false,
        pixelRatio: 2.5,
        skipAutoScale: true,
        skipFonts: true,
        width: width,
      });
      
      const link = document.createElement('a');
      link.download = `deepread-${theme}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('生成图片失败，请重试。');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getThemeStyles = () => {
    const baseSelector = '.share-capture';
    
    switch (theme) {
        case 'classic':
            return `
                ${baseSelector} { background-color: #F4F1EA !important; color: #2C2420 !important; font-family: 'Noto Serif SC', serif !important; }
                ${baseSelector} .font-serif { font-family: 'Noto Serif SC', serif !important; }
                ${baseSelector} .bg-white { background-color: #F4F1EA !important; border: 1px solid #D6CFC7 !important; box-shadow: none !important; }
                ${baseSelector} .text-slate-900 { color: #2C2420 !important; }
                ${baseSelector} .text-slate-800 { color: #433630 !important; }
                ${baseSelector} .text-slate-700 { color: #5D544F !important; }
                ${baseSelector} .text-slate-600 { color: #786C66 !important; }
                ${baseSelector} .text-slate-500 { color: #9A8F89 !important; }
                ${baseSelector} .text-slate-400 { color: #B0A6A0 !important; }
                
                /* Accents - Classic Rust/Brown */
                ${baseSelector} .bg-indigo-600 { background-color: #8B4513 !important; }
                ${baseSelector} .text-indigo-600 { color: #8B4513 !important; }
                ${baseSelector} .bg-indigo-100 { background-color: #E8DAC6 !important; color: #8B4513 !important; }
                ${baseSelector} .border-indigo-50 { border-color: #D6CFC7 !important; }
                ${baseSelector} .hover\\:bg-indigo-50 { background-color: #E8DAC6 !important; }

                /* Components Overrides */
                ${baseSelector} .bg-slate-50 { background-color: #EFEDE6 !important; }
                ${baseSelector} .bg-slate-50\\/50 { background-color: #EFEDE6 !important; border-left-color: #8B4513 !important; }
                
                /* Writing/Opposition Colors mapped to Earth Tones */
                ${baseSelector} .text-emerald-600 { color: #3A5F0B !important; } /* Olive */
                ${baseSelector} .bg-emerald-50\\/50 { background-color: #F1F5E6 !important; border-color: #DDE6D0 !important; }
                ${baseSelector} .border-emerald-100 { border-color: #DDE6D0 !important; }
                ${baseSelector} .bg-emerald-400 { background-color: #3A5F0B !important; }

                ${baseSelector} .text-red-500 { color: #A52A2A !important; } /* Brownish Red */
                ${baseSelector} .bg-red-50\\/50 { background-color: #F5E6E6 !important; border-color: #E6D0D0 !important; }
                
                ${baseSelector} .text-blue-500 { color: #2A4FA5 !important; } /* Muted Blue */
                ${baseSelector} .bg-blue-50\\/30 { background-color: #E6ECF5 !important; border-color: #D0DBE6 !important; }

                /* Lines */
                ${baseSelector} .bg-slate-200 { background-color: #D6CFC7 !important; }
            `;
        case 'dark':
            return `
                ${baseSelector} { background-color: #020617 !important; color: #E2E8F0 !important; }
                ${baseSelector} .bg-white { background-color: #1E293B !important; border: 1px solid #334155 !important; box-shadow: none !important; }
                
                /* Text Inversion */
                ${baseSelector} .text-slate-900, ${baseSelector} .text-slate-800 { color: #F8FAFC !important; }
                ${baseSelector} .text-slate-700 { color: #CBD5E1 !important; }
                ${baseSelector} .text-slate-600, ${baseSelector} .text-slate-500 { color: #94A3B8 !important; }
                ${baseSelector} .text-slate-400 { color: #64748B !important; }
                
                /* Backgrounds */
                ${baseSelector} .bg-slate-50 { background-color: #0F172A !important; border-color: #334155 !important; }
                ${baseSelector} .bg-slate-50\\/50 { background-color: #0F172A !important; border-left-color: #38BDF8 !important; }
                ${baseSelector} .bg-slate-100 { background-color: #334155 !important; color: #fff !important; }

                /* Accents - Neon Blue/Cyan */
                ${baseSelector} .bg-indigo-600 { background-color: #0EA5E9 !important; color: #fff !important; }
                ${baseSelector} .text-indigo-600 { color: #38BDF8 !important; }
                ${baseSelector} .bg-indigo-100 { background-color: rgba(56, 189, 248, 0.2) !important; color: #38BDF8 !important; }
                ${baseSelector} .border-indigo-50 { border-color: #334155 !important; }
                
                /* MindMap Lines */
                ${baseSelector} .bg-slate-200 { background-color: #334155 !important; }
                ${baseSelector} .bg-white.border-2 { background-color: #0F172A !important; border-color: #38BDF8 !important; color: #38BDF8 !important; }

                /* Specific Cards */
                ${baseSelector} .bg-emerald-50\\/50 { background-color: rgba(16, 185, 129, 0.1) !important; border-color: rgba(16, 185, 129, 0.3) !important; }
                ${baseSelector} .text-emerald-600, ${baseSelector} .text-emerald-800 { color: #34D399 !important; }
                ${baseSelector} .border-emerald-100 { border-color: rgba(16, 185, 129, 0.3) !important; }

                ${baseSelector} .bg-red-50\\/50 { background-color: rgba(244, 63, 94, 0.1) !important; border-color: rgba(244, 63, 94, 0.3) !important; }
                ${baseSelector} .text-red-500 { color: #FB7185 !important; }
                ${baseSelector} .border-red-100 { border-color: rgba(244, 63, 94, 0.3) !important; }

                ${baseSelector} .bg-blue-50\\/30 { background-color: rgba(59, 130, 246, 0.1) !important; border-color: rgba(59, 130, 246, 0.3) !important; }
                ${baseSelector} .text-blue-500 { color: #60A5FA !important; }
                
                /* Footer */
                ${baseSelector} .border-t { border-top-color: #334155 !important; }
            `;
        case 'simple':
            return `
                ${baseSelector} { background-color: #FFFFFF !important; color: #000000 !important; font-family: 'Inter', sans-serif !important; }
                ${baseSelector} .bg-white { background-color: #FFFFFF !important; border: 2px solid #000000 !important; box-shadow: 4px 4px 0px #000000 !important; border-radius: 0 !important; }
                ${baseSelector} .rounded-2xl, ${baseSelector} .rounded-xl, ${baseSelector} .rounded-lg { border-radius: 0 !important; }
                ${baseSelector} .rounded-full { border-radius: 999px !important; border: 1px solid #000 !important; }
                
                /* Text */
                ${baseSelector} .text-slate-900, ${baseSelector} .text-slate-800, ${baseSelector} .text-slate-700 { color: #000000 !important; }
                ${baseSelector} .text-slate-600, ${baseSelector} .text-slate-500, ${baseSelector} .text-slate-400 { color: #444444 !important; }
                
                /* Headers */
                ${baseSelector} .bg-indigo-600 { background-color: #000000 !important; color: #fff !important; }
                ${baseSelector} .text-indigo-600 { color: #000000 !important; font-weight: 800 !important; text-decoration: underline !important; }
                
                /* Badges */
                ${baseSelector} .bg-indigo-100 { background-color: #fff !important; border: 1px solid #000 !important; color: #000 !important; }
                
                /* Cards Background Removal */
                ${baseSelector} .bg-slate-50, ${baseSelector} .bg-slate-50\\/50 { background-color: #fff !important; border: 1px solid #000 !important; }
                ${baseSelector} .border-slate-100, ${baseSelector} .border-slate-200 { border-color: #000 !important; }
                
                /* Specific Cards */
                ${baseSelector} .text-emerald-600, ${baseSelector} .text-red-500, ${baseSelector} .text-blue-500 { color: #000 !important; font-weight: bold !important; }
                ${baseSelector} .bg-emerald-50\\/50, ${baseSelector} .bg-red-50\\/50, ${baseSelector} .bg-blue-50\\/30 { background-color: #fff !important; border: 1px solid #000 !important; }
                ${baseSelector} .border-emerald-100, ${baseSelector} .border-red-100, ${baseSelector} .border-blue-100 { border-color: #000 !important; }
                
                /* MindMap */
                ${baseSelector} .bg-white.border-2 { border-color: #000 !important; color: #000 !important; box-shadow: none !important; }
                ${baseSelector} .bg-slate-200 { background-color: #000 !important; }
            `;
        default:
            return '';
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full md:max-w-6xl h-full md:h-[90vh] md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Mobile Header (Tabs) */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon size={18} className="text-indigo-600"/> 
                分享长图
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                <X size={20} />
            </button>
        </div>

        {/* Mobile Tab Bar */}
        <div className="md:hidden flex border-b border-slate-200 bg-slate-50 shrink-0">
            <button 
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500'}`}
            >
                <Settings2 size={16} /> 设置
            </button>
            <button 
                onClick={() => setActiveTab('preview')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-500'}`}
            >
                <Eye size={16} /> 预览
            </button>
        </div>

        {/* Left: Controls (Settings) */}
        <div className={`
            w-full md:w-80 bg-slate-50/80 backdrop-blur-sm p-6 border-r border-slate-200 
            flex flex-col shrink-0 overflow-hidden h-full md:h-auto
            ${activeTab === 'settings' ? 'block' : 'hidden md:flex'}
        `}>
          <div className="hidden md:flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <div className="p-1.5 bg-indigo-600 rounded text-white"><ImageIcon size={18}/></div> 
                分享设置
            </h2>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto pr-1 min-h-0 custom-scrollbar pb-20 md:pb-0">
            
            {/* 1. View Mode */}
            <div className="space-y-2">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">版式 (Layout)</p>
                 <div className="bg-white p-1 rounded-xl flex border border-slate-200 shadow-sm">
                    <button 
                        onClick={() => setMode('desktop')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'desktop' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <Monitor size={16} />
                        电脑
                    </button>
                    <button 
                        onClick={() => setMode('mobile')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'mobile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                        <Smartphone size={16} />
                        手机
                    </button>
                </div>
            </div>

            {/* 2. Theme Selector */}
            <div className="space-y-2">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Palette size={12}/> 风格 (Theme)
                 </p>
                 <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(THEMES) as ThemeKey[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTheme(t)}
                            className={`relative px-3 py-3 rounded-xl border-2 text-left transition-all ${theme === t ? `border-indigo-600 ring-1 ring-indigo-600 bg-indigo-50/50` : 'border-transparent bg-white hover:border-slate-200'}`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded-full border shadow-sm ${THEMES[t].bg} ${t === 'simple' ? 'border-black' : 'border-slate-200'}`}></div>
                                <span className={`text-sm font-medium ${theme === t ? 'text-indigo-900' : 'text-slate-600'}`}>{THEMES[t].name}</span>
                            </div>
                        </button>
                    ))}
                 </div>
            </div>

            {/* 3. URL input */}
            {!url && (
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2 flex items-center gap-1">
                        <Link2 size={12}/> 补充链接二维码
                    </p>
                    <input 
                        type="url" 
                        placeholder="粘贴链接..."
                        value={manualUrl}
                        onChange={(e) => setManualUrl(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-white shadow-sm"
                    />
                </div>
            )}

            {/* 4. Toggles */}
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-2">显示内容</p>
                <div className="space-y-2">
                    <SectionToggle label="文章精华" checked={sections.summary} onChange={() => toggleSection('summary')} />
                    <SectionToggle label="思维脉络" checked={sections.mindmap} onChange={() => toggleSection('mindmap')} />
                    <SectionToggle label="反方视角" checked={sections.opposition} onChange={() => toggleSection('opposition')} />
                    <SectionToggle label="爆文拆解" checked={sections.writing} onChange={() => toggleSection('writing')} />
                </div>
            </div>
          </div>

          <div className="pt-6 mt-auto border-t border-slate-200 shrink-0 hidden md:block">
            <button 
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-lg hover:shadow-xl transform active:scale-95"
            >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Download size={18} />}
                {isGenerating ? '正在渲染...' : '保存图片'}
            </button>
          </div>
        </div>

        {/* Right: Preview Area */}
        <div className={`
            flex-1 bg-slate-200/50 overflow-y-auto p-4 md:p-8 relative justify-center custom-scrollbar
            ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'}
        `}>
            <button onClick={onClose} className="hidden md:block absolute top-6 right-6 p-2 bg-white rounded-full shadow-lg hover:bg-slate-50 text-slate-500 z-20 transition-transform hover:rotate-90">
                <X size={20} />
            </button>

            {/* The Capture Container */}
            <div className="my-auto shadow-2xl shadow-slate-900/10 rounded-lg overflow-hidden origin-top transition-all duration-300 transform h-fit">
                <div 
                    ref={previewRef} 
                    className={`share-capture min-h-[600px] flex flex-col ${mode === 'desktop' ? 'w-[800px]' : 'w-[420px] share-mobile'}`}
                >
                    {/* Inject fonts + Theme Overrides */}
                    {fontStyles && <style>{fontStyles}</style>}
                    <style>{`
                        /* Base Layout Resets */
                        .share-capture h2 { text-wrap: balance !important; }
                        .share-capture p { text-wrap: pretty !important; text-align: justify !important; }
                        
                        /* Mobile Layout Overrides */
                        .share-mobile .grid { display: flex !important; flex-direction: column !important; gap: 1rem !important; }
                        .share-mobile .md\\:grid-cols-2, .share-mobile .lg\\:grid-cols-2 { grid-template-columns: 1fr !important; }

                        /* THEME INJECTION */
                        ${getThemeStyles()}
                    `}</style>

                    {/* Branding Header */}
                    <div className={`bg-indigo-600 text-white text-center flex flex-col justify-center transition-colors duration-300 ${mode === 'desktop' ? 'px-12 py-12' : 'px-6 py-10'}`}>
                        <div className={`${mode === 'desktop' ? 'text-5xl' : 'text-3xl'} font-serif font-black mb-3 tracking-tight`}>DeepRead 深度阅读</div>
                        <div className="text-indigo-100 text-sm tracking-widest opacity-80 font-medium uppercase">AI 驱动的批判性阅读助手</div>
                    </div>

                    {/* Content Area */}
                    <div className={`${mode === 'desktop' ? 'px-10 py-10 space-y-6' : 'px-6 py-8 space-y-5'} bg-slate-50 flex-1 transition-colors duration-300`}>
                        {sections.summary && (
                            <div className="pointer-events-none">
                                <SummaryCard data={data} />
                            </div>
                        )}
                        
                        {sections.writing && data.writingAnalysis && (
                            <div className="pointer-events-none">
                                <WritingAnalysisCard analysis={data.writingAnalysis} />
                            </div>
                        )}

                        {sections.mindmap && (
                             <div className="pointer-events-none">
                                <MindMap flow={data.logicalFlow} />
                             </div>
                        )}

                        {sections.opposition && (
                            <div className="pointer-events-none">
                                <OppositionView counterArguments={data.counterArguments} similarViews={data.similarViews} />
                            </div>
                        )}
                    </div>

                    {/* Branding Footer */}
                    <div className={`bg-white border-t border-slate-100 mt-auto transition-colors duration-300 ${mode === 'desktop' ? 'px-10 py-8 flex items-center justify-between' : 'px-6 py-8 flex flex-col gap-6 text-center'}`}>
                         <div className={mode === 'desktop' ? 'text-left' : ''}>
                            <div className="text-slate-900 font-bold text-2xl mb-1 font-serif">DeepRead</div>
                            <div className="text-slate-400 text-sm">Generated by AI Analysis</div>
                         </div>

                         {qrCodeUrl ? (
                             <div className={`flex items-center gap-5 ${mode === 'mobile' ? 'flex-col-reverse' : ''}`}>
                                 <div className={mode === 'desktop' ? 'text-right' : 'text-center'}>
                                     <div className="text-sm font-bold text-slate-700">扫码阅读原文</div>
                                     <div className="text-xs text-slate-400">Scan to read</div>
                                 </div>
                                 <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 rounded-lg border border-slate-200 p-1.5 bg-white shadow-sm" />
                             </div>
                         ) : (
                             <div className="text-slate-300 text-sm italic font-serif">
                                 "Every insight matters."
                             </div>
                         )}
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile Floating Action Button (Save) */}
        {activeTab === 'preview' && (
            <div className="md:hidden absolute bottom-6 right-6 z-30">
                 <button 
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center disabled:opacity-70 active:scale-95 transition-transform"
                >
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Download size={24} />}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

const SectionToggle: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 transition-colors select-none group shadow-sm">
        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700">{label}</span>
        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${checked ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-300'}`}>
            {checked && <Check size={12} className="text-white" />}
        </div>
        <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
    </label>
);

export default ShareModal;