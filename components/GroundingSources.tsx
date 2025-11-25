import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { GroundingSource } from '../types';

const GroundingSources: React.FC<{ sources: GroundingSource[] }> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-slate-200">
      <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
        <Globe size={12} /> 参考来源
      </h4>
      <div className="flex flex-wrap gap-3">
        {sources.map((chunk, idx) => {
            if (!chunk.web?.uri) return null;
            return (
                <a 
                    key={idx}
                    href={chunk.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors truncate max-w-[250px]"
                >
                    <span className="truncate">{chunk.web.title || chunk.web.uri}</span>
                    <ExternalLink size={10} />
                </a>
            );
        })}
      </div>
    </div>
  );
};

export default GroundingSources;