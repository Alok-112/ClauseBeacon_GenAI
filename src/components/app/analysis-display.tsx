import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Languages, Loader } from 'lucide-react';
import type { AnalysisResult, ChatMessage } from '@/lib/types';
import { SummaryTab } from './summary-tab';
import { RisksTab } from './risks-tab';
import { ChecklistTab } from './checklist-tab';
import { ChatTab } from './chat-tab';

type AnalysisDisplayProps = {
  analysis: AnalysisResult;
  originalAnalysis: AnalysisResult;
  onExplainClause: (clause: string) => void;
  onLanguageChange: (language: string) => void;
  currentLanguage: string;
  onDownload: () => void;
  isTranslating: boolean;
  onAskQuestion: (question: string) => void;
  chatHistory: ChatMessage[];
  isAsking: boolean;
  isDownloading: boolean;
};

const supportedLanguages = ["Hindi", "Hinglish", "Spanish", "French", "German", "Japanese", "Mandarin Chinese", "Italian", "Portuguese", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu"];

export function AnalysisDisplay({ 
    analysis, 
    originalAnalysis,
    onExplainClause, 
    onLanguageChange, 
    currentLanguage,
    onDownload, 
    isTranslating, 
    onAskQuestion,
    chatHistory,
    isAsking,
    isDownloading
}: AnalysisDisplayProps) {
  return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
             <Select onValueChange={onLanguageChange} value={currentLanguage} disabled={isTranslating}>
                <SelectTrigger className="w-full sm:w-[200px] bg-card">
                    <Languages className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Translate" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="English">English (Original)</SelectItem>
                    {supportedLanguages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={onDownload} className="w-full sm:w-auto" disabled={isDownloading}>
                {isDownloading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4"/>}
                {isDownloading ? 'Generating PDF...' : 'Download Report'}
            </Button>
        </div>
        <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-10">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="risks">Risk Factors</TabsTrigger>
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="chat">Ask a Question</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
                <SummaryTab summary={analysis.summary} />
            </TabsContent>
            <TabsContent value="risks">
                <RisksTab 
                  riskFactors={analysis.riskFactors} 
                  originalRiskFactors={originalAnalysis.riskFactors}
                  onExplainClause={onExplainClause} 
                />
            </TabsContent>
            <TabsContent value="checklist">
                <ChecklistTab checklist={analysis.checklist} />
            </TabsContent>
            <TabsContent value="chat">
                <ChatTab 
                    onAskQuestion={onAskQuestion}
                    chatHistory={chatHistory}
                    isAsking={isAsking}
                />
            </TabsContent>
        </Tabs>
    </div>
  );
}
