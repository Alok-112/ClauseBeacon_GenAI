'use client';
import { useState, useTransition } from 'react';
import { AppHeader } from '@/components/app/header';
import { DocumentInput } from '@/components/app/document-input';
import { AnalysisDisplay } from '@/components/app/analysis-display';
import { ClauseExplanationDialog } from '@/components/app/clause-explanation-dialog';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { analyzeDocumentAction, explainClauseAction, translateAnalysisAction, askQuestionAction } from '@/app/actions';
import type { AnalysisResult, FullAnalysisResult, ChatMessage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Home() {
  const { toast } = useToast();
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [isExplaining, startExplaining] = useTransition();
  const [isTranslating, startTranslating] = useTransition();
  const [isAsking, startAsking] = useTransition();

  const [document, setDocument] = useState<{ text: string; dataUri: string; fileType: string } | null>(null);
  const [analysis, setAnalysis] = useState<FullAnalysisResult | null>(null);
  const [currentLang, setCurrentLang] = useState('English');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    clause: string;
    explanation: string | null;
  }>({ open: false, clause: '', explanation: null });

  const handleDocumentChange = (doc: { text: string; dataUri: string; fileType: string } | null) => {
    setDocument(doc);
    setAnalysis(null);
    setCurrentLang('English');
    setChatHistory([]);
  };

  const handleAnalyze = () => {
    if (!document) return;
    setAnalysis(null);
    setCurrentLang('English');
    setChatHistory([]);

    startAnalyzing(async () => {
      try {
        const result = await analyzeDocumentAction(document.text);
        setAnalysis({ original: result });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
      }
    });
  };

  const handleAskQuestion = (question: string) => {
    if (!document) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: question }];
    setChatHistory(newHistory);

    startAsking(async () => {
      try {
        const answer = await askQuestionAction(document.text, question);
        setChatHistory(prev => [...prev, { role: 'assistant', content: answer }]);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setChatHistory(prev => [...prev, { role: 'assistant', content: `Error: ${errorMessage}` }]);
        toast({
          variant: 'destructive',
          title: 'Error Answering Question',
          description: errorMessage,
        });
      }
    });
  };

  const handleExplainClause = (clause: string) => {
    if (!document) return;
    setDialogState({ open: true, clause, explanation: null });
    startExplaining(async () => {
      try {
        const explanation = await explainClauseAction(document.text, clause);
        setDialogState(prev => ({ ...prev, explanation }));
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Explanation Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
        setDialogState(prev => ({ ...prev, open: false }));
      }
    });
  };

  const handleLanguageChange = (language: string) => {
    if (!analysis?.original || language === currentLang) return;

    setCurrentLang(language);

    if (language === 'English') {
      return;
    }
    
    startTranslating(async () => {
      try {
        const translatedResult = await translateAnalysisAction(analysis.original, language);
        setAnalysis(prev => (prev ? { ...prev, translated: translatedResult } : null));
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Translation Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
        setCurrentLang('English');
      }
    });
  }

  const handleDownload = () => {
    if (!analysis) return;

    const currentAnalysis = (currentLang !== 'English' && analysis.translated) ? analysis.translated : analysis.original;
    
    const reportTitle = `Legal Document Analysis (${currentLang})\n\n`;
    const summarySection = `SUMMARY\n-------\n${currentAnalysis.summary}\n\n`;
    const risksSection = `POTENTIAL RISK FACTORS\n----------------------\n${currentAnalysis.riskFactors.map(r => `- ${r}`).join('\n')}\n\n`;
    const checklistSection = `ACTIONABLE CHECKLIST\n--------------------\n${currentAnalysis.checklist}`;

    const reportContent = reportTitle + summarySection + risksSection + checklistSection;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'clause-beacon-report.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const displayAnalysis = (currentLang !== 'English' && analysis?.translated) ? analysis.translated : analysis?.original;
  const isLoading = isAnalyzing || (currentLang !== 'English' && isTranslating && !analysis?.translated);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <div className="h-full">
            <DocumentInput 
              onAnalyze={handleAnalyze} 
              isAnalyzing={isAnalyzing}
              document={document}
              onDocumentChange={handleDocumentChange}
            />
          </div>
          <div className="h-full">
            {isLoading ? (
              <Card className="h-full p-6 flex flex-col gap-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                  <div className="flex-grow flex flex-col gap-4 pt-4">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-full w-full" />
                  </div>
              </Card>
            ) : displayAnalysis ? (
                <AnalysisDisplay 
                    analysis={displayAnalysis} 
                    onExplainClause={handleExplainClause}
                    onLanguageChange={handleLanguageChange}
                    onDownload={handleDownload}
                    isTranslating={isTranslating}
                    onAskQuestion={handleAskQuestion}
                    chatHistory={chatHistory}
                    isAsking={isAsking}
                />
            ) : (
                <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed bg-card/50">
                    <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                    <h2 className="text-xl font-semibold">Your Analysis Awaits</h2>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        Upload a document to get started. We'll provide a summary, identify risks, and create a checklist for you.
                    </p>
                </Card>
            )}
          </div>
        </div>
      </main>
      <Toaster />
      <ClauseExplanationDialog
        open={dialogState.open}
        onOpenChange={(open) => setDialogState(prev => ({ ...prev, open }))}
        clause={dialogState.clause}
        explanation={dialogState.explanation}
        isLoading={isExplaining}
      />
    </div>
  );
}
