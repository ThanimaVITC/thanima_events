'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';

export function TeamRegistrationForm({ 
  action, 
  teamSize 
}: { 
  action: (formData: FormData) => void; 
  teamSize: number;
}) {
  const [memberCount, setMemberCount] = useState(Math.min(teamSize, Math.max(1, teamSize)));

  const addMember = () => {
    setMemberCount((c) => Math.min(teamSize, c + 1));
  };
  const removeMember = () => {
    setMemberCount((c) => Math.max(1, c - 1));
  };

  return (
    <form action={action} className="grid gap-4">
      {/* Team Name First */}
      <div className="grid gap-2">
        <Label htmlFor="teamName">Team name</Label>
        <Input id="teamName" name="teamName" required />
      </div>

      <CardTitle className="text-lg mt-2">Team Members</CardTitle>
      <CardDescription>
        Add all team members (including the leader). Maximum {teamSize} members allowed.
      </CardDescription>

      {/* All Team Members */}
      <div className="grid gap-6">
        {Array.from({ length: memberCount }).map((_, idx) => (
          <div key={idx} className="grid gap-4 p-4 border rounded-md">
            <CardTitle className="text-base">Member {idx + 1} {idx === 0 ? '(Leader)' : ''}</CardTitle>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`memberName_${idx}`}>Full name</Label>
                <Input id={`memberName_${idx}`} name={`memberName_${idx}`} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`memberRegNo_${idx}`}>Registration Number</Label>
                <Input id={`memberRegNo_${idx}`} name={`memberRegNo_${idx}`} required />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor={`memberEmail_${idx}`}>VIT Email</Label>
                <Input id={`memberEmail_${idx}`} name={`memberEmail_${idx}`} type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`memberPhone_${idx}`}>WhatsApp number</Label>
                <Input id={`memberPhone_${idx}`} name={`memberPhone_${idx}`} required />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Remove Member Controls */}
      <div className="flex gap-2">
        <Button type="button" onClick={addMember} disabled={memberCount >= teamSize}>
          Add member
        </Button>
        <Button type="button" variant="secondary" onClick={removeMember} disabled={memberCount <= 1}>
          Remove last
        </Button>
      </div>

      {/* Hidden field to signal how many members were added */}
      <input type="hidden" name="__team_members_count" value={String(memberCount)} />
      
      <Button type="submit" className="button-glow interactive-element">Submit Team</Button>
    </form>
  );
}
