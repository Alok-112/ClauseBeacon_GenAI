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
        return checklist.split('\n').filter(item => item.trim().startsWith('- ') || item.trim().startsWith('* ')).map(item => item.trim().substring(2).trim())
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
              <p>No actionable checklist items were generated.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
