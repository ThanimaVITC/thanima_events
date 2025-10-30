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
    });
    if (!parsed.success) {
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
