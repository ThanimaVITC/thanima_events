'use server';

import { db } from '@/lib/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { participantSchema, type ParticipantInput } from '@/app/events.schema';

export async function getEventById(eventId: string) {
  console.log('[apply/actions.getEventById] eventId:', eventId);
  const ref = doc(db, 'events', eventId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return { id: snap.id, ...data } as any;
}

export async function submitParticipant(eventId: string, formData: FormData): Promise<{ success: boolean; error?: string }>{
  try {
    const raw = Object.fromEntries(formData.entries());
    console.log('[apply/actions.submitParticipant] eventId:', eventId);
    console.log('[apply/actions.submitParticipant] raw form entries:', raw);
    const parsed = participantSchema.safeParse({
      name: raw.name,
      email: raw.email,
      phone: raw.phone,
      regNo: raw.regNo || undefined,
    });
    if (!parsed.success) {
      console.error('[apply/actions.submitParticipant] validation failed:', parsed.error.flatten());
      return { success: false, error: 'Invalid data' };
    }
    const res = await addDoc(collection(db, 'events', eventId, 'participants'), {
      ...parsed.data,
      submittedAt: serverTimestamp(),
    });
    console.log('[apply/actions.submitParticipant] participant created with id:', res.id);
    return { success: true };
  } catch (e) {
    console.error('[apply/actions.submitParticipant] unexpected error:', e);
    return { success: false, error: 'Failed to register' };
  }
}


