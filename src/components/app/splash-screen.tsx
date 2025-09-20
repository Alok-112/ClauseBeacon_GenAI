'use client';
import { FileSearch } from 'lucide-react';

export const SplashScreen = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background fixed inset-0 z-[100] animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-32 w-32 animate-pulse rounded-full bg-primary/10"></div>
        <div className="absolute h-48 w-48 animate-pulse rounded-full bg-primary/10 [animation-delay:0.3s]"></div>
        <FileSearch className="h-20 w-20 text-primary animate-in fade-in-0 zoom-in-50 duration-1000" />
      </div>
    </div>
  );
};
