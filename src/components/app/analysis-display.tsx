import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Languages } from 'lucide-react';
import type { AnalysisResult, ChatMessage } from '@/lib/types';
import { SummaryTab } from './summary-tab';
import { RisksTab } from './risks-tab';
import { ChecklistTab } from './checklist-tab';
import { ChatTab } from './chat-tab';

type AnalysisDisplayProps = {
  analysis: AnalysisResult;
  onExplainClause: (clause: string) => void;
  onLanguageChange: (language: string) => void;
  onDownload: () => void;
  isTranslating: boolean;
  onAskQuestion: (question: string) => void;
  chatHistory: ChatMessage[];
  isAsking: boolean;
};

const supportedLanguages = ["Spanish", "French", "German", "Japanese", "Mandarin Chinese", "Italian", "Portuguese", "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu"];

export function AnalysisDisplay({ 
    analysis, 
    onExplainClause, 
    onLanguageChange, 
    onDownload, 
    isTranslating, 
    onAskQuestion,
    chatHistory,
    isAsking
}: AnalysisDisplayProps) {
  return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 justify-end">
             <Select onValueChange={(value) => onLanguageChange(value)} disabled={isTranslating}>
                <SelectTrigger className="w-full sm:w-[200px] bg-card">
                    <Languages className="mr-2" />
                    <SelectValue placeholder="Translate" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="English">English (Original)</SelectItem>
                    {supportedLanguages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Button onClick={onDownload} className="w-full sm:w-auto">
                <Download className="mr-2"/>
                Download Report
            </Button>
        </div>
        <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="risks">Risk Factors</TabsTrigger>
                <TabsTrigger value="checklist">Checklist</TabsTrigger>
                <TabsTrigger value="chat">Ask a Question</TabsTrigger>
            </TabsList>
            <TabsContent value="summary">
                <SummaryTab summary={analysis.summary} />
            </TabsContent>
            <TabsContent value="risks">
                <RisksTab riskFactors={analysis.riskFactors} onExplainClause={onExplainClause} />
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
