export default function GreenPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-8">
      <div className="content-backdrop">
        <div className="text-center">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground hero-title">
            Green Theme Page
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-muted-foreground hero-subtitle">
            This page follows the same consistent theme as the rest of the website.
          </p>
        </div>
      </div>
    </main>
  );
}
