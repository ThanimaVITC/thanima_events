'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export function RegistrationToast({ showError }: { showError: boolean }) {
  const { toast } = useToast();

  useEffect(() => {
    if (showError) {
      toast({
        title: 'Registration failed',
        description: 'Please verify your details and try again.',
        variant: 'destructive',
      });
    }
  }, [showError, toast]);

  return null;
}


