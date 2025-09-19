'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

type TTSButtonProps = {
  textToSpeak: string;
};

export function TTSButton({ textToSpeak }: TTSButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsAvailable(true);
      const synth = window.speechSynthesis;
      const onVoicesChanged = () => {
        // Voices loaded
      };
      synth.addEventListener('voiceschanged', onVoicesChanged);
      
      const handleEnd = () => setIsSpeaking(false);
      
      // Cleanup function
      return () => {
        synth.cancel();
        synth.removeEventListener('voiceschanged', onVoicesChanged);
      };
    }
  }, []);

  const handleSpeak = useCallback(() => {
    if (!isAvailable) {
        toast({
            variant: 'destructive',
            title: 'Text-to-Speech Not Available',
            description: 'Your browser does not support this feature.',
        });
        return;
    }
      
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }

    if (textToSpeak) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
            variant: 'destructive',
            title: 'Speech Error',
            description: 'Could not play the audio.',
        });
      };
      synth.speak(utterance);
      setIsSpeaking(true);
    }
  }, [isAvailable, textToSpeak, toast]);

  if (!isAvailable) {
      return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSpeak}
      aria-label={isSpeaking ? 'Stop speaking' : 'Speak text aloud'}
    >
      {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
    </Button>
  );
}
