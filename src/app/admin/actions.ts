'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { eventSchema, type EventDocument, type EventInput } from '@/app/events.schema';

async function verifyAuth() {
  try {
    const cookieStore = await cookies();
    if (cookieStore.get('admin-auth')?.value !== 'true') {
      redirect('/admin');
    }
  } catch (error) {
    redirect('/admin');
  }
}

export async function createEvent(formData: FormData): Promise<{ success: boolean; error?: string }>{
  await verifyAuth();
  try {
    const raw = Object.fromEntries(formData.entries());
    const coordinators = JSON.parse((raw.coordinators as string) || '[]');
    const parsed = eventSchema.safeParse({
      title: raw.title,
      description: raw.description,
      eventDate: raw.eventDate,
      coordinators,
      whatsappLink: raw.whatsappLink,
      isTeamBased: String(raw.isTeamBased) === 'true' || String(raw.isTeamBased) === 'on',
      minTeamSize: Number(raw.minTeamSize ?? (String(raw.isTeamBased) === 'true' || String(raw.isTeamBased) === 'on' ? 2 : 1)),
      maxTeamSize: Number(raw.maxTeamSize ?? (String(raw.isTeamBased) === 'true' || String(raw.isTeamBased) === 'on' ? 2 : 1)),
    });
    if (!parsed.success) {
      console.error(parsed.error.flatten());
      return { success: false, error: 'Invalid event data' };
    }

    const ref = await addDoc(collection(db, 'events'), {
      ...parsed.data,
      createdAt: serverTimestamp(),
    });
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to create event' };
  }
}

export async function listEvents(): Promise<EventDocument[]> {
  await verifyAuth();
  const q = query(collection(db, 'events'), orderBy('eventDate', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      title: data.title,
      description: data.description,
      eventDate: data.eventDate,
      coordinators: data.coordinators || [],
      whatsappLink: data.whatsappLink,
      isTeamBased: Boolean(data.isTeamBased),
      // Backward compatibility: support old teamSize by mapping to min/max when present
      minTeamSize: Number((data as any).minTeamSize ?? (data as any).teamSize ?? 1),
      maxTeamSize: Number((data as any).maxTeamSize ?? (data as any).teamSize ?? 1),
      createdAt: (data.createdAt?.toDate?.() || new Date()).toISOString(),
    } satisfies EventDocument;
  });
}

export async function deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }>{
  await verifyAuth();
  try {
    await deleteDoc(doc(db, 'events', eventId));
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'Failed to delete event' };
  }
}

export type ParticipantRow = {
  teamName: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberRegNo?: string;
  isTeamRegistration: boolean;
  entryId: string;
};

export async function listParticipants(eventId: string): Promise<ParticipantRow[]> {
  await verifyAuth();
  const q = query(collection(db, 'events', eventId, 'participants'));
  const snap = await getDocs(q);
  const rows: ParticipantRow[] = [];
  snap.forEach((d) => {
    const data = d.data() as any;
    if (data.isTeamRegistration) {
      const teamName = String(data.teamName || '');
      const members = Array.isArray(data.teamMembers) ? data.teamMembers : [];
      for (const m of members) {
        rows.push({
          teamName,
          memberName: String(m.name || ''),
          memberEmail: String(m.email || ''),
          memberPhone: String(m.phone || ''),
          memberRegNo: m.regNo || undefined,
          isTeamRegistration: true,
          entryId: d.id,
        });
      }
    } else {
      rows.push({
        teamName: '',
        memberName: String(data.name || ''),
        memberEmail: String(data.email || ''),
        memberPhone: String(data.phone || ''),
        memberRegNo: data.regNo || undefined,
        isTeamRegistration: false,
        entryId: d.id,
      });
    }
  });
  return rows;
}
