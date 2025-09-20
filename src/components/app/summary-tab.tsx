import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownRenderer } from './markdown-renderer';
import { TTSButton } from './tts-button';

type SummaryTabProps = {
  summary: string;
};

export function SummaryTab({ summary }: SummaryTabProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Document Summary</CardTitle>
            <CardDescription>A concise overview of the key points in your document.</CardDescription>
          </div>
          <TTSButton textToSpeak={summary} />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] lg:h-[500px] pr-4">
          <MarkdownRenderer content={summary} />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
