'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function IndividualRegistrationForm({ action }: { action: (formData: FormData) => void }) {
  return (
    <form action={action} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="regNo">Registration Number</Label>
        <Input id="regNo" name="regNo" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">VIT Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="phone">WhatsApp number</Label>
        <Input id="phone" name="phone" required />
      </div>
      <Button type="submit" className="button-glow interactive-element">Submit</Button>
    </form>
  );
}
