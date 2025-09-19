'use client';
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type DocumentInputProps = {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
};

const placeholderText = `Paste your legal document here, or upload a .txt file.

For example:

NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement (the "Agreement") is entered into by and between [Disclosing Party] ("Disclosing Party") and [Receiving Party] ("Receiving Party") for the purpose of preventing the unauthorized disclosure of Confidential Information as defined below.

1. Definition of Confidential Information. "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged.

2. Obligations of Receiving Party. Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party.

...and so on.
`;

export function DocumentInput({ onAnalyze, isAnalyzing }: DocumentInputProps) {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          setText(content);
        };
        reader.readAsText(file);
      } else {
        toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please upload a .txt file.",
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
    if (!text.trim()) {
        toast({
            variant: "destructive",
            title: "Empty Document",
            description: "Please paste or upload a document before analyzing.",
        });
        return;
    }
    onAnalyze(text);
  };

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle>Your Document</CardTitle>
        <CardDescription>Paste the text of your document below or upload a .txt file.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholderText}
          className="flex-grow resize-none text-sm"
          rows={20}
        />
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".txt"
        />
        <Button variant="outline" onClick={handleUploadClick}>
          <Upload className="mr-2" />
          Upload .txt File
        </Button>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalyzeClick} disabled={isAnalyzing} className="w-full">
          <Sparkles className="mr-2" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
        </Button>
      </CardFooter>
    </Card>
  );
}
