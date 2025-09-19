'use client';
import { useState } from 'react';
import { Bot, User, Send, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';


type ChatTabProps = {
    onAskQuestion: (question: string) => void;
    chatHistory: ChatMessage[];
    isAsking: boolean;
};

export function ChatTab({ onAskQuestion, chatHistory, isAsking }: ChatTabProps) {
    const [question, setQuestion] = useState('');

    const handleAsk = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim()) {
            onAskQuestion(question);
            setQuestion('');
        }
    }

  return (
    <Card className="shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle>Ask a Question</CardTitle>
        <CardDescription>
          Ask questions about the document and get answers from our AI assistant.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <ScrollArea className="h-[350px] lg:h-[450px] pr-4 flex-grow">
            <div className="space-y-6">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={cn("flex items-start gap-4", msg.role === 'user' ? 'justify-end' : '')}>
                        {msg.role === 'assistant' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={cn(
                            "rounded-lg p-3 max-w-[80%]",
                            msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        )}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        {msg.role === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><User /></AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                ))}
                 {isAsking && (
                    <div className="flex items-start gap-4">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg p-3 bg-muted">
                            <Loader className="h-5 w-5 animate-spin" />
                        </div>
                    </div>
                 )}
            </div>
        </ScrollArea>
        <form onSubmit={handleAsk} className="flex gap-2">
            <Input 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question..."
                disabled={isAsking}
            />
            <Button type="submit" disabled={isAsking || !question.trim()}>
                {isAsking ? <Loader className="animate-spin" /> : <Send />}
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}
