'use client';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock } from 'lucide-react';

export function AdminLogin({
  onLogin,
}: {
  onLogin: (formData: FormData) => Promise<void>;
}) {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <Card className="w-full max-w-sm border-0 shadow-none bg-transparent">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl text-foreground">Admin Access</CardTitle>
        <CardDescription>
          Enter the password to access the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={onLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="font-code"
            />
          </div>
           {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" className="w-full button-glow interactive-element pulse-animation glow-effect">
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
