import { Scale } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="bg-card border-b shadow-sm">
      <div className="container mx-auto flex items-center gap-3 p-4">
        <Scale className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold text-foreground font-headline">
          Legalese Decoder
        </h1>
      </div>
    </header>
  );
}
