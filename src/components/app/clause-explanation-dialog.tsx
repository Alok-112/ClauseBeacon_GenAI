import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

type ClauseExplanationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clause: string;
  explanation: string | null;
  isLoading: boolean;
};

export function ClauseExplanationDialog({
  open,
  onOpenChange,
  clause,
  explanation,
  isLoading,
}: ClauseExplanationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Simplified Explanation</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p className="font-semibold mt-4 mb-1">Original Clause:</p>
              <blockquote className="border-l-4 pl-4 italic text-muted-foreground">{clause}</blockquote>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
            <h3 className="font-semibold mb-2">Simplified Version:</h3>
            <ScrollArea className="h-[200px] rounded-md border p-4 bg-secondary/30">
                {isLoading && !explanation ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[75%]" />
                        <Skeleton className="h-4 w-[85%]" />
                    </div>
                ) : (
                    <p className="whitespace-pre-wrap">{explanation}</p>
                )}
            </ScrollArea>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
