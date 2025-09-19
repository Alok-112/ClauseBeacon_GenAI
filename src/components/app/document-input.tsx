'use client';
import { useState, useRef, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Sparkles, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { extractTextAction } from '@/app/actions';

type DocumentInputProps = {
  onAnalyze: () => void;
  isAnalyzing: boolean;
  documentText: string;
  setDocumentText: (text: string) => void;
};

const placeholderText = `Paste your legal document here, or upload a .txt, .pdf, .png, or .jpg file.

For example:

NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into by and between [Disclosing Party] ("Disclosing Party") and [Receiving Party] ("Receiving Party") for the purpose of preventing the unauthorized disclosure of Confidential Information as defined below.

1. Definition of Confidential Information. "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.

2. Obligations of Receiving Party. Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party.

...and so on.
`;

const allowedFileTypes = [
  'text/plain',
  'application/pdf',
  'image/png',
  'image/jpeg',
];

export function DocumentInput({ onAnalyze, isAnalyzing, documentText, setDocumentText }: DocumentInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isExtracting, startExtracting] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (allowedFileTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUri = e.target?.result as string;
          if (file.type === 'text/plain') {
            // For plain text, we can just use the text content directly
            const textContent = atob(dataUri.substring(dataUri.indexOf(',') + 1));
            setDocumentText(textContent);
          } else {
            // For other file types, we call the text extraction action
            startExtracting(async () => {
              try {
                const extractedText = await extractTextAction(dataUri);
                setDocumentText(extractedText);
                toast({
                  title: "Text Extracted",
                  description: "The text from your document has been successfully extracted.",
                });
              } catch (error) {
                toast({
                  variant: "destructive",
                  title: "Text Extraction Failed",
                  description: error instanceof Error ? error.message : "An unknown error occurred.",
                });
              }
            });
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please upload a .txt, .pdf, .png, or .jpg file.",
        });
      }
    }
    // Reset file input to allow uploading the same file again
    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeClick = () => {
    if (!documentText.trim()) {
        toast({
            variant: "destructive",
            title: "Empty Document",
            description: "Please paste or upload a document before analyzing.",
        });
        return;
    }
    onAnalyze();
  };
  
  const isLoading = isAnalyzing || isExtracting;

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle>Your Document</CardTitle>
        <CardDescription>Paste text directly, or upload a .txt, .pdf, .png, or .jpg file.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Textarea
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          placeholder={placeholderText}
          className="flex-grow resize-none text-sm"
          rows={20}
          disabled={isLoading}
        />
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt,.pdf,.png,.jpg,.jpeg"
          disabled={isLoading}
        />
        <Button variant="outline" onClick={handleUploadClick} disabled={isLoading}>
          {isExtracting ? (
            <Loader className="mr-2 animate-spin" />
          ) : (
            <Upload className="mr-2" />
          )}
          {isExtracting ? 'Extracting Text...' : 'Upload File'}
        </Button>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalyzeClick} disabled={isLoading || !documentText.trim()} className="w-full">
          {isAnalyzing ? <Loader className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
          {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
        </Button>
      </CardFooter>
    </Card>
  );
}
