'use client';
import { useRef, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Sparkles, Loader, File, Trash2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { extractTextAction } from '@/app/actions';

type DocumentInputProps = {
  onAnalyze: () => void;
  isAnalyzing: boolean;
  documentInfo: { dataUri: string; fileType: string } | null;
  onDocumentChange: (doc: { text: string; dataUri: string; fileType: string } | null) => void;
};

const allowedFileTypes = [
  'text/plain',
  'application/pdf',
  'image/png',
  'image/jpeg',
];

export function DocumentInput({ onAnalyze, isAnalyzing, documentInfo, onDocumentChange }: DocumentInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExtracting, startExtracting] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (allowedFileTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUri = e.target?.result as string;
          startExtracting(async () => {
            try {
              const extractedText = await extractTextAction(dataUri);
              onDocumentChange({
                text: extractedText,
                dataUri: dataUri,
                fileType: file.type,
              });
              toast.success("Document Uploaded", {
                description: "The text from your document has been successfully extracted.",
              });
            } catch (error) {
              onDocumentChange(null);
              toast.error("Text Extraction Failed", {
                description: error instanceof Error ? error.message : "An unknown error occurred.",
              });
            }
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Invalid File Type", {
            description: "Please upload a .txt, .pdf, .png, or .jpeg file.",
        });
      }
    }
    // Reset file input to allow re-uploading the same file
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeClick = () => {
    onAnalyze();
  };

  const handleRemoveDocument = () => {
    onDocumentChange(null);
    toast.success("Document Removed", {
        description: "The document has been cleared from the application.",
    });
  };
  
  const isLoading = isAnalyzing || isExtracting;
  const hasDocument = documentInfo !== null;

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle>Your Document</CardTitle>
        <CardDescription>Upload a .txt, .pdf, .png, or .jpeg file.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        {hasDocument ? (
            <div className="flex-grow relative border rounded-md p-2 bg-secondary/20">
                {documentInfo.fileType.startsWith('image/') ? (
                    <img src={documentInfo.dataUri} alt="Uploaded document" className="w-full h-full object-contain" />
                ) : documentInfo.fileType === 'application/pdf' ? (
                    <iframe src={documentInfo.dataUri} className="w-full h-full" title="Uploaded PDF"/>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <File className="w-16 h-16 mb-4"/>
                        <p>Text file uploaded.</p>
                        <p className="text-sm">(Viewer for .txt is not available)</p>
                    </div>
                )}
                 <Button variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={handleRemoveDocument} disabled={isLoading}>
                    <Trash2 />
                </Button>
            </div>
        ) : (
            <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-md p-8">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Drag & drop a file or click to upload</p>
                <Button variant="outline" onClick={handleUploadClick} disabled={isLoading}>
                    {isExtracting ? (
                        <Loader className="mr-2 animate-spin" />
                    ) : (
                        <Upload className="mr-2" />
                    )}
                    {isExtracting ? 'Extracting...' : 'Upload File'}
                </Button>
            </div>
        )}
        <Input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept={allowedFileTypes.join(',')}
          disabled={isLoading}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalyzeClick} disabled={isLoading || !hasDocument} className="w-full">
          {isAnalyzing ? <Loader className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
          {isAnalyzing ? 'Analyzing...' : 'Analyze Document'}
        </Button>
      </CardFooter>
    </Card>
  );
}
