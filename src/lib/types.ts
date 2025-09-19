export type AnalysisResult = {
  summary: string;
  riskFactors: string[];
  checklist: string;
};

export type FullAnalysisResult = {
  original: AnalysisResult;
  translated?: AnalysisResult;
};
