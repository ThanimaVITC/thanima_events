import { getEventById } from '@/app/apply/actions';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CopyToClipboard } from '@/components/copy-to-clipboard';
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
          <CardContent className="flex flex-col items-center gap-3">
            <Button asChild size="lg" className="button-glow interactive-element">
              <Link href={event.whatsappLink} target="_blank" rel="noopener noreferrer">
                Join WhatsApp Group
              </Link>
            </Button>
            <div className="flex items-center gap-2 w-full max-w-md">
              <input readOnly className="flex-1 px-3 py-2 rounded-md bg-background border" value={event.whatsappLink} />
              <CopyToClipboard text={event.whatsappLink} label="Copy" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


