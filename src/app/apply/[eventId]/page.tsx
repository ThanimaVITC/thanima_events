import { getEventById, submitParticipant } from '@/app/apply/actions';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegistrationToast } from '@/components/registration-toast';
import { IndividualRegistrationForm } from '@/components/individual-registration-form';
import { TeamRegistrationForm } from '@/components/team-registration-form';

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
            <div className="w-full flex justify-center mb-2">
              <img src="/logo 2.png" alt="Thanima Logo" className="h-24 w-auto" />
            </div>
            <CardTitle className="font-headline text-2xl text-center">Register for {event.title}</CardTitle>
            <CardDescription className="text-center">{event.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationToast showError={Boolean(qp.error)} />
            {event.isTeamBased && ((event.minTeamSize ?? event.teamSize) > 1 || (event.maxTeamSize ?? event.teamSize) > 1) ? (
              <TeamRegistrationForm action={action} minTeamSize={Number(event.minTeamSize ?? event.teamSize ?? 1)} maxTeamSize={Number(event.maxTeamSize ?? event.teamSize ?? 1)} />
            ) : (
              <IndividualRegistrationForm action={action} />
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


