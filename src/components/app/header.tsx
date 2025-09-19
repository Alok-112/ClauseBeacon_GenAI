import { FileSearch } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto flex items-center gap-3 p-4">
        <FileSearch className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground font-headline">
          ClauseBeacon
        </h1>
      </div>
    </header>
  );
}
