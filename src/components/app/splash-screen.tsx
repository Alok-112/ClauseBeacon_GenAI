'use client';
import { FileSearch } from 'lucide-react';

export const SplashScreen = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background fixed inset-0 z-[100]">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-pulse rounded-full bg-primary/20"></div>
        <div className="absolute h-32 w-32 animate-pulse rounded-full bg-primary/20 [animation-delay:0.5s]"></div>
        <FileSearch className="h-16 w-16 text-primary" />
      </div>
    </div>
  );
};
