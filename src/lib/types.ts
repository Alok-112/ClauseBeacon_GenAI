export type AnalysisResult = {
  summary: string;
  riskFactors: string[];
  checklist: string;
};

export type FullAnalysisResult = {
  original: AnalysisResult;
  translated?: {
    [language: string]: AnalysisResult;
  };
};

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};
