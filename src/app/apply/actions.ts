'use server';

import { db } from '@/lib/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { participantSchema, teamMemberSchema, teamRegistrationSchema } from '@/app/events.schema';

export async function getEventById(eventId: string) {
  const ref = doc(db, 'events', eventId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return { id: snap.id, ...data } as any;
}

export async function submitParticipant(eventId: string, formData: FormData): Promise<{ success: boolean; error?: string }>{
  try {
    const raw = Object.fromEntries(formData.entries());

    // Load event to know registration type
    const event = await getEventById(eventId);
    if (!event) return { success: false, error: 'Event not found' };

    let payload: any = {};

    if (event.isTeamBased && event.teamSize > 1) {
      const teamMembersCount = Number(raw.__team_members_count || 0);
      if (!raw.teamName || String(raw.teamName).trim().length < 2) {
        return { success: false, error: 'Team name is required' };
      }
      if (Number.isNaN(teamMembersCount) || teamMembersCount < 1 || teamMembersCount > event.teamSize) {
        return { success: false, error: 'Invalid number of team members' };
      }
      
      const members: Array<{ name: string; email: string; phone: string; regNo?: string }> = [];
      for (let i = 0; i < teamMembersCount; i++) {
        const nameKey = `memberName_${i}`;
        const regKey = `memberRegNo_${i}`;
        const emailKey = `memberEmail_${i}`;
        const phoneKey = `memberPhone_${i}`;
        const mParsed = teamMemberSchema.safeParse({
          name: raw[nameKey],
          email: raw[emailKey],
          phone: raw[phoneKey],
          regNo: (raw[regKey] as string) || undefined,
        });
        if (!mParsed.success) {
          console.error('[apply/actions.submitParticipant] member validation failed at index', i, mParsed.error.flatten());
          return { success: false, error: 'Invalid team member data' };
        }
        members.push(mParsed.data);
      }

      // Schema-level validation for presence and structure
      const teamParsed = teamRegistrationSchema.safeParse({ teamName: raw.teamName, teamMembers: members });
      if (!teamParsed.success) {
        console.error('[apply/actions.submitParticipant] team registration invalid:', teamParsed.error.flatten());
        return { success: false, error: 'Invalid team registration' };
      }

      payload.isTeamRegistration = true;
      payload.teamSize = members.length;
      payload.teamName = teamParsed.data.teamName;
      payload.teamMembers = members;
      // For team registration, we don't use the individual participant fields
      payload = {
        isTeamRegistration: true,
        teamSize: members.length,
        teamName: teamParsed.data.teamName,
        teamMembers: members,
      };
    } else {
      // Individual registration: validate participant fields
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
      payload = {
        ...parsed.data,
        isTeamRegistration: false,
        teamSize: 1,
      };
    }

    const res = await addDoc(collection(db, 'events', eventId, 'participants'), {
      ...payload,
      submittedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (e) {
    console.error('[apply/actions.submitParticipant] unexpected error:', e);
    return { success: false, error: 'Failed to register' };
  }
}


