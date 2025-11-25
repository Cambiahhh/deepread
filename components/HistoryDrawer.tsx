import React from 'react';
import { X, Clock, Link2, FileText, Trash2, ArrowRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ 
  isOpen, 
  onClose, 
  history, 
  onSelect, 
  onDelete,
  onClearAll
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-indigo-600" size={20} />
            历史记录
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
              <Clock size={48} className="opacity-20" />
              <p className="text-sm">暂无历史记录</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelect(item)}
                className="group relative bg-white border border-slate-100 rounded-xl p-4 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-fit ${item.type === 'url' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                    {item.type === 'url' ? <Link2 size={10} /> : <FileText size={10} />}
                    {item.type === 'url' ? '链接' : '文本'}
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-slate-900 font-bold text-sm mb-1 line-clamp-2 leading-snug">
                  {item.data.title || "未命名分析"}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2">
                  {item.data.summary}
                </p>

                {/* Delete Button (Visible on Hover) */}
                <button
                  onClick={(e) => onDelete(item.id, e)}
                  className="absolute bottom-3 right-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors md:opacity-0 group-hover:opacity-100"
                  title="删除此记录"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <button 
              onClick={() => {
                if(window.confirm('确定要清空所有历史记录吗？')) {
                  onClearAll();
                }
              }}
              className="w-full py-2.5 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              清空历史记录
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default HistoryDrawer;