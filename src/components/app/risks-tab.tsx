import { AlertTriangle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type RisksTabProps = {
  riskFactors: string[];
  onExplainClause: (clause: string) => void;
};

export function RisksTab({ riskFactors, onExplainClause }: RisksTabProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Potential Risk Factors</CardTitle>
        <CardDescription>
          These are clauses or terms that may be onerous or require your special attention.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] lg:h-[500px] p-1">
          {riskFactors.length > 0 ? (
            <div className="space-y-4 pr-3">
              {riskFactors.map((risk, index) => (
                <div key={index} className="p-4 border rounded-lg bg-card flex items-start gap-4 shadow-sm">
                  <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
                  <div className="flex-grow">
                    <p className="text-sm">{risk}</p>
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-2 text-primary"
                      onClick={() => onExplainClause(risk)}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Explain this in simple terms
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <AlertTriangle className="h-12 w-12 mb-4" />
              <p>No significant risk factors were identified.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
