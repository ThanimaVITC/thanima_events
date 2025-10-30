import { getEventById, submitParticipant } from '@/app/apply/actions';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RegistrationToast } from '@/components/registration-toast';

export default async function ApplyPage({ params, searchParams }: { params: Promise<{ eventId: string }>, searchParams?: Promise<Record<string, string>> }) {
  const { eventId } = await params;
  const qp = (await (searchParams || Promise.resolve({} as Record<string, string>))) as Record<string, string>;
  const event = await getEventById(eventId);
  if (!event) return notFound();

  async function action(formData: FormData) {
    'use server';
    const res = await submitParticipant(eventId, formData);
    if (!res.success) {
      redirect(`/apply/${eventId}?error=1`);
    }
    redirect(`/apply/${eventId}/success`);
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl content-backdrop">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">Register for {event.title}</CardTitle>
            <CardDescription className="text-center">{event.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationToast showError={Boolean(qp.error)} />
            <form action={action} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="regNo">Registration Number</Label>
                <Input id="regNo" name="regNo" required/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">WhatsApp number</Label>
                <Input id="phone" name="phone" required />
              </div>
              <Button type="submit" className="button-glow interactive-element">Submit</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


