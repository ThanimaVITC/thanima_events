'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

async function copyText(text: string) {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  // Fallback for some mobile browsers
  try {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    const ok = document.execCommand('copy');
    document.body.removeChild(tempInput);
    return ok;
  } catch {
    return false;
  }
}

export function CopyToClipboard({ text, label = 'Copy link' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    const ok = await copyText(text);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button type="button" variant="outline" onClick={onClick} className="interactive-element">
      {copied ? 'Copied!' : label}
    </Button>
  );
}


