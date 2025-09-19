import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TTSButton } from './tts-button';

type SummaryTabProps = {
  summary: string;
};

export function SummaryTab({ summary }: SummaryTabProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Document Summary</CardTitle>
        <TTSButton textToSpeak={summary} />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] lg:h-[500px] pr-4">
          <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
