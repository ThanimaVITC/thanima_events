
import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ScrollAnimation from "@/components/scroll-animation";
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';

export default async function Home() {
  const nowIso = new Date().toISOString();
  const q = query(collection(db, 'events'), where('eventDate', '>=', nowIso), orderBy('eventDate', 'asc'));
  const snap = await getDocs(q);
  const liveEvents = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));

  return (
    <main className="flex min-h-dvh flex-col items-center p-4 sm:p-6 lg:p-8">
      <ScrollAnimation />
      <section className="flex flex-col items-center justify-center text-center py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mx-auto mb-8 flex h-48 w-48 md:h-56 md:w-56 lg:h-64 lg:w-64 items-center justify-center logo-container">
          <img src="/thanima logo.png" alt="Thanima Logo"  className="h-full w-full object-contain" />
        </div>

        <div className="content-backdrop">
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground text-overlay hero-title">
            Thanima Events
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground text-overlay hero-subtitle">
            Register for upcoming events and join the WhatsApp groups.
          </p>
          <div className="flex items-center gap-4 pt-6 justify-center">
            <Button asChild variant="ghost" size="icon" className="social-icon interactive-element glow-effect">
              <Link href="https://www.instagram.com/thanimavitc/" target="_blank" aria-label="Instagram">
                <Instagram size={24} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="social-icon interactive-element glow-effect">
              <Link href="https://www.linkedin.com/company/thanima-literary-club/" target="_blank" aria-label="LinkedIn">
                <Linkedin size={24} />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="social-icon interactive-element glow-effect">
              <Link href="mailto:thanimamalayalamliteraryclub@gmail.com" aria-label="Email">
                <Mail size={24} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="w-full max-w-5xl py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="mb-8 text-center content-backdrop">
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-overlay">
            Live Events
          </h2>
          <p className="mt-2 text-base sm:text-lg lg:text-xl text-muted-foreground text-overlay">
            Upcoming events you can register for now
          </p>
        </div>
        <div className="grid gap-6 sm:gap-8 grid-cols-1 md:grid-cols-2">
          {liveEvents.length === 0 ? (
            <p className="text-center col-span-full">No live events right now. Please check back later.</p>
          ) : (
            liveEvents.map((ev: any) => (
              <Card key={ev.id} className="h-full card-hover interactive-element glow-effect">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{ev.title}</CardTitle>
                  <CardDescription>{new Date(ev.eventDate).toLocaleString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{ev.description}</p>
                  <Button asChild className="button-glow interactive-element">
                    <Link href={`/apply/${ev.id}`}>
                      Register
                      <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      <footer className="w-full border-t mt-12 sm:mt-16 lg:mt-20 py-6 sm:py-8 text-center text-sm sm:text-base text-muted-foreground content-backdrop">
        <p className="text-overlay">&copy; 2025 THANIMA. All rights reserved.</p>
      </footer>
    </main>
  );
}
