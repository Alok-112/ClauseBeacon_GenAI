'use client';

import { Volume2, Loader, AlertCircle, Play, Pause, StopCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { textToSpeechAction } from '@/app/actions';

type TTSButtonProps = {
  textToSpeak: string;
};

type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export function TTSButton({ textToSpeak }: TTSButtonProps) {
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // To ensure we don't request the same audio twice
  const lastTextSpoken = useRef<string | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    const currentAudio = audioRef.current;
    
    const handleEnded = () => setAudioState('idle');
    const handlePlay = () => setAudioState('playing');
    const handlePause = () => setAudioState('paused');

    currentAudio.addEventListener('ended', handleEnded);
    currentAudio.addEventListener('play', handlePlay);
    currentAudio.addEventListener('pause', handlePause);
    
    return () => {
      if (currentAudio) {
        currentAudio.removeEventListener('ended', handleEnded);
        currentAudio.removeEventListener('play', handlePlay);
        currentAudio.removeEventListener('pause', handlePause);
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, []);

  // Effect to stop audio when the text to speak changes
  useEffect(() => {
    return () => {
        if(audioRef.current){
            audioRef.current.pause();
            setAudioState('idle');
        }
    };
  }, [textToSpeak]);


  const handleSpeak = useCallback(async () => {
    if (!textToSpeak) return;

    if (audioState === 'playing' && audioRef.current) {
        audioRef.current.pause();
        return;
    }

    if (audioState === 'paused' && audioRef.current) {
        audioRef.current.play();
        return;
    }
    
    // If audio for this text is already loaded, just play it
    if (lastTextSpoken.current === textToSpeak && audioRef.current && audioRef.current.src) {
        audioRef.current.play();
        return;
    }

    setAudioState('loading');
    setError(null);

    try {
      const result = await textToSpeechAction(textToSpeak);

      if (result.error || !result.audio) {
        throw new Error(result.error || 'Failed to generate audio.');
      }
      
      if (audioRef.current) {
        lastTextSpoken.current = textToSpeak;
        audioRef.current.src = result.audio;
        audioRef.current.play();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setAudioState('error');
      toast({
        variant: 'destructive',
        title: 'Text-to-Speech Failed',
        description: errorMessage,
      });
    }
  }, [textToSpeak, audioState, toast]);

  const handleStop = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setAudioState('idle');
    }
  }

  const getIcon = () => {
    switch(audioState) {
        case 'loading': return <Loader className="h-5 w-5 animate-spin" />;
        case 'playing': return <Pause className="h-5 w-5" />;
        case 'paused': return <Play className="h-5 w-5" />;
        case 'error': return <AlertCircle className="h-5 w-5 text-destructive" />;
        case 'idle':
        default:
            return <Volume2 className="h-5 w-5" />;
    }
  }

  return (
    <div className="flex items-center gap-1">
        <Button
        variant="ghost"
        size="icon"
        onClick={handleSpeak}
        disabled={audioState === 'loading' || !textToSpeak}
        aria-label="Speak text aloud"
        >
        {getIcon()}
        </Button>
        {(audioState === 'playing' || audioState === 'paused') && (
            <Button
                variant="ghost"
                size="icon"
                onClick={handleStop}
                aria-label="Stop speaking"
            >
                <StopCircle className="h-5 w-5" />
            </Button>
        )}
    </div>
  );
}
