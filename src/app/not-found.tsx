import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl content-backdrop text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10 text-foreground">
          <SearchX className="h-10 w-10" />
        </div>
        <h1 className="font-headline text-2xl sm:text-3xl tracking-tight mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">The page you’re looking for doesn’t exist or has been moved.</p>
        <Button asChild size="lg" className="button-glow interactive-element">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
