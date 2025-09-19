import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownRenderer } from './markdown-renderer';

type SummaryTabProps = {
  summary: string;
};

export function SummaryTab({ summary }: SummaryTabProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Document Summary</CardTitle>
        <CardDescription>A concise overview of the key points in your document.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] lg:h-[500px] pr-4">
          <div className="prose prose-sm max-w-none">
            <MarkdownRenderer content={summary} />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
