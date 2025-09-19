'use client';

import { Volume2, Loader, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { textToSpeechAction } from '@/app/actions';

type TTSButtonProps = {
  textToSpeak: string;
};

export function TTSButton({ textToSpeak }: TTSButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    audioRef.current = new Audio();
    
    const currentAudio = audioRef.current;
    
    const handleEnded = () => {
        // You can add logic here if needed when audio finishes
    };
    
    currentAudio.addEventListener('ended', handleEnded);
    
    return () => {
      if (currentAudio) {
        currentAudio.removeEventListener('ended', handleEnded);
        currentAudio.pause();
        currentAudio.src = '';
      }
    };

  }, []);

  const handleSpeak = useCallback(async () => {
    if (!textToSpeak || isLoading) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await textToSpeechAction(textToSpeak);

      if (result.error || !result.audio) {
        throw new Error(result.error || 'Failed to generate audio.');
      }
      
      if (audioRef.current) {
        audioRef.current.src = result.audio;
        audioRef.current.play();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Text-to-Speech Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [textToSpeak, isLoading, toast]);

  if (!isMounted) {
    return (
        <Button
            variant="ghost"
            size="icon"
            disabled={true}
            aria-label="Speak text aloud"
        >
            <Volume2 className="h-5 w-5" />
        </Button>
    );
  }

  const getIcon = () => {
    if (isLoading) return <Loader className="h-5 w-5 animate-spin" />;
    if (error) return <AlertCircle className="h-5 w-5 text-destructive" />;
    return <Volume2 className="h-5 w-5" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      disabled={isLoading}
      aria-label="Speak text aloud"
    >
      {getIcon()}
    </Button>
  );
}
