export interface MindMapNode {
  id: string;
  label: string;
  description: string;
  children?: MindMapNode[];
}

export interface CounterArgument {
  point: string;
  rebuttal: string;
}

export interface RelatedView {
  thinker: string;
  perspective: string;
  context: string;
}

export interface WritingAnalysis {
  tone: string; // e.g. "Rational", "Emotional"
  audience: string; // Target audience
  structure: string; // Writing framework used
  viralFactors: string[]; // Why this article might go viral
}

export interface AnalysisResult {
  title: string;
  summary: string;
  keyInsights: string[];
  logicalFlow: MindMapNode[]; // Simplified for vertical stepper visualization
  counterArguments: CounterArgument[];
  similarViews: RelatedView[];
  writingAnalysis: WritingAnalysis;
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisResponse {
  data: AnalysisResult | null;
  groundingChunks: GroundingSource[] | null;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  type: 'url' | 'text';
  input: string; // The url string or truncated text
  data: AnalysisResult;
  groundingChunks: GroundingSource[];
}