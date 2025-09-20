import { FileSearch } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

export function AppHeader() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <FileSearch className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground font-headline">
            ClauseBeacon
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
