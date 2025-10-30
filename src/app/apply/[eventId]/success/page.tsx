import { getEventById } from '@/app/apply/actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function SuccessPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = await getEventById(eventId);
  if (!event) return notFound();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl content-backdrop">
        <Card className="border-0 shadow-none bg-transparent text-center">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">You're in!</CardTitle>
            <CardDescription>Join the WhatsApp group for {event.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="button-glow interactive-element">
              <Link href={event.whatsappLink} target="_blank" rel="noopener noreferrer">
                Join WhatsApp Group
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


