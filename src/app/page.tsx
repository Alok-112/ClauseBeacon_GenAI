'use client';
import { useState, useTransition, useRef, useMemo } from 'react';
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
import { PDFReport } from '@/components/app/pdf-report';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const { toast } = useToast();
  const [isAnalyzing, startAnalyzing] = useTransition();
  const [isExplaining, startExplaining] = useTransition();
  const [isTranslating, startTranslating] = useTransition();
  const [isAsking, startAsking] = useTransition();
  const [isDownloading, setIsDownloading] = useState(false);

  const [documentText, setDocumentText] = useState<string | null>(null);
  const [documentInfo, setDocumentInfo] = useState<{ dataUri: string; fileType: string } | null>(null);

  const [analysis, setAnalysis] = useState<FullAnalysisResult | null>(null);
  const [currentLang, setCurrentLang] = useState('English');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  const [dialogState, setDialogState] = useState<{
    open: boolean;
    clause: string;
    explanation: string | null;
  }>({ open: false, clause: '', explanation: null });
  
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDocumentChange = (doc: { text: string; dataUri: string; fileType: string } | null) => {
    setDocumentText(doc?.text ?? null);
    setDocumentInfo(doc ? { dataUri: doc.dataUri, fileType: doc.fileType } : null);
    setAnalysis(null);
    setCurrentLang('English');
    setChatHistory([]);
  };

  const handleAnalyze = () => {
    if (!documentText) return;
    setAnalysis(null);
    setCurrentLang('English');
    setChatHistory([]);

    startAnalyzing(async () => {
      try {
        const result = await analyzeDocumentAction(documentText);
        setAnalysis({ original: result, translated: {} });
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
    if (!documentText) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: question }];
    setChatHistory(newHistory);

    startAsking(async () => {
      try {
        const answer = await askQuestionAction(documentText, question);
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
  
  const displayAnalysis = useMemo(() => {
    if (!analysis?.original) return null;
    if (currentLang === 'English') return analysis.original;
    return analysis.translated?.[currentLang] ?? null;
  }, [analysis, currentLang]);

  const handleExplainClause = (clause: string) => {
    if (!documentText || !displayAnalysis) return;

    // Use original document text for explanation, but use the clause from the current display language
    setDialogState({ open: true, clause, explanation: null });
    startExplaining(async () => {
      try {
        // We always want to find the clause in the original document text.
        // The `clause` argument here might be translated, but the AI should handle it.
        const explanation = await explainClauseAction(documentText, clause);
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
    if (!analysis?.original) return;
    
    setCurrentLang(language);

    if (language === 'English' || (analysis.translated && analysis.translated[language])) {
        // No need to fetch if it's English or already translated
        return;
    }

    startTranslating(async () => {
      try {
        const translatedResult = await translateAnalysisAction(analysis.original, language);
        setAnalysis(prev => {
          if (!prev) return null;
          return {
            ...prev,
            translated: {
              ...prev.translated,
              [language]: translatedResult,
            }
          }
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Translation Failed',
          description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
        setCurrentLang('English'); // Revert on failure
      }
    });
  }

  const handleDownload = async () => {
    if (!displayAnalysis || !reportRef.current) return;
    setIsDownloading(true);

    try {
        const canvas = await html2canvas(reportRef.current, {
            scale: 2, 
            useCORS: true,
            backgroundColor: null,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height],
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('clause-beacon-report.pdf');

    } catch (error) {
        toast({
            variant: "destructive",
            title: "Download Failed",
            description: "Could not generate the PDF report. Please try again."
        });
        console.error("Error generating PDF:", error);
    } finally {
        setIsDownloading(false);
    }
  };
  
  const isLoading = isAnalyzing || (currentLang !== 'English' && isTranslating && !displayAnalysis);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <div className="h-full flex flex-col">
            <DocumentInput 
              onAnalyze={handleAnalyze} 
              isAnalyzing={isAnalyzing}
              documentInfo={documentInfo}
              onDocumentChange={handleDocumentChange}
            />
          </div>
          <div className="h-full flex flex-col">
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
                    currentLanguage={currentLang}
                    onDownload={handleDownload}
                    isTranslating={isTranslating}
                    onAskQuestion={handleAskQuestion}
                    chatHistory={chatHistory}
                    isAsking={isAsking}
                    isDownloading={isDownloading}
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
      {/* Hidden report for PDF generation */}
      <div className="absolute -z-10 -left-[9999px] top-0 w-[800px]">
          {displayAnalysis && (
            <PDFReport 
                ref={reportRef}
                analysis={displayAnalysis} 
                language={currentLang}
            />
          )}
      </div>
    </div>
  );
}
