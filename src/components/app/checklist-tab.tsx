'use client';
import { CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { useState, useMemo } from 'react';
import { MarkdownRenderer } from './markdown-renderer';

type ChecklistTabProps = {
  checklist: string;
};

export function ChecklistTab({ checklist }: ChecklistTabProps) {
    const checklistItems = useMemo(() => {
        if (!checklist) return [];
        // This is a more robust way to parse the checklist.
        // 1. It splits by newline characters, which is the ideal case.
        // 2. Then, for each line, it splits again by "- " or "* ", which handles cases
        //    where the AI might have returned all items on a single line.
        // 3. It filters out any empty strings that might result from the splits.
        return checklist
            .split(/[\n]+/)
            .flatMap(line => line.split(/\s*(?:-|\*)\s+/))
            .map(item => item.trim())
            .filter(item => item.length > 0);
    }, [checklist]);

    const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

    const handleCheckChange = (index: number) => {
        setCheckedItems(prev => ({...prev, [index]: !prev[index]}));
    }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Actionable Checklist</CardTitle>
        <CardDescription>
        A list of suggested actions based on the document.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] lg:h-[500px] pr-2">
          {checklistItems.length > 0 ? (
            <div className="space-y-4">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-md hover:bg-secondary/50 transition-colors">
                    <Checkbox
                        id={`checklist-item-${index}`}
                        checked={checkedItems[index] || false}
                        onCheckedChange={() => handleCheckChange(index)}
                        className="mt-1"
                    />
                    <label htmlFor={`checklist-item-${index}`} className={`flex-1 text-sm cursor-pointer ${checkedItems[index] ? 'line-through text-muted-foreground' : ''}`}>
                        <MarkdownRenderer content={item} />
                    </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <CheckSquare className="h-12 w-12 mb-4" />
              <p>No actionable checklist items were generated for the selected language.</p>
              <p className="text-xs mt-1">Try translating the analysis if you haven't already.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
