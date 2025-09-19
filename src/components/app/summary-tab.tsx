import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TTSButton } from './tts-button';
import React from 'react';

type SummaryTabProps = {
  summary: string;
};

const renderSummary = (summaryText: string) => {
    const lines = summaryText.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
        line = line.trim();
        if (line.startsWith('##')) {
            elements.push(<h2 key={index} className="text-xl font-semibold mt-4 mb-2">{line.substring(2).trim()}</h2>);
        } else if (line.startsWith('-')) {
            elements.push(<li key={index} className="ml-5 list-disc">{line.substring(1).trim()}</li>);
        } else if (line) {
            elements.push(<p key={index} className="mb-2">{line}</p>);
        }
    });

    // Group list items
    const groupedElements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];

    elements.forEach((el, index) => {
        if (React.isValidElement(el) && el.type === 'li') {
            currentList.push(el);
        } else {
            if (currentList.length > 0) {
                groupedElements.push(<ul key={`ul-${index}`} className="space-y-1 mb-4">{currentList}</ul>);
                currentList = [];
            }
            groupedElements.push(el);
        }
    });

    if (currentList.length > 0) {
        groupedElements.push(<ul key="ul-last" className="space-y-1 mb-4">{currentList}</ul>);
    }

    return groupedElements;
}

export function SummaryTab({ summary }: SummaryTabProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Document Summary</CardTitle>
        <TTSButton textToSpeak={summary.replace(/##/g, '')} />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] lg:h-[500px] pr-4">
          <div className="whitespace-pre-wrap leading-relaxed">
            {renderSummary(summary)}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
