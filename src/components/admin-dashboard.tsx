'use client';

import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, LogOut } from 'lucide-react';
import { createEvent, deleteEvent, listEvents, listParticipants, type ParticipantRow } from '@/app/admin/actions';
import type { EventDocument } from '@/app/events.schema';

export function AdminDashboard({ onLogout }: { onLogout: () => Promise<void> }) {
  const { toast } = useToast();
  const [events, setEvents] = useState<EventDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [participantsByEvent, setParticipantsByEvent] = useState<Record<string, ParticipantRow[]>>({});
  const [participantsLoading, setParticipantsLoading] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    whatsappLink: '',
    coordinators: [{ name: '', phone: '' }],
    isTeamBased: false,
    minTeamSize: 1,
    maxTeamSize: 1,
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await listEvents();
        setEvents(data);
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to load events', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const handleAddCoordinator = () => {
    if (form.coordinators.length >= 3) return;
    setForm({ ...form, coordinators: [...form.coordinators, { name: '', phone: '' }] });
  };

  const handleRemoveCoordinator = (idx: number) => {
    if (form.coordinators.length <= 1) return;
    setForm({ ...form, coordinators: form.coordinators.filter((_, i) => i !== idx) });
  };

  const submitEvent = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('eventDate', form.eventDate);
      fd.append('whatsappLink', form.whatsappLink);
      fd.append('coordinators', JSON.stringify(form.coordinators));
      fd.append('isTeamBased', String(form.isTeamBased));
      fd.append('minTeamSize', String(form.minTeamSize || 1));
      fd.append('maxTeamSize', String(form.maxTeamSize || 1));
      const res = await createEvent(fd);
      if (!res.success) throw new Error(res.error);
      const data = await listEvents();
      setEvents(data);
      setForm({ title: '', description: '', eventDate: '', whatsappLink: '', coordinators: [{ name: '', phone: '' }], isTeamBased: false, minTeamSize: 1, maxTeamSize: 1 });
      toast({ title: 'Event created' });
    } catch (e: any) {
      toast({ title: 'Failed', description: e?.message || 'Could not create event', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    try {
      const res = await deleteEvent(id);
      if (!res.success) throw new Error(res.error);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast({ title: 'Event deleted' });
    } catch (e: any) {
      toast({ title: 'Failed', description: e?.message || 'Could not delete event', variant: 'destructive' });
    }
  };

  const viewParticipants = async (eventId: string) => {
    setParticipantsLoading((s) => ({ ...s, [eventId]: true }));
    try {
      const rows = await listParticipants(eventId);
      setParticipantsByEvent((prev) => ({ ...prev, [eventId]: rows }));
    } catch (e: any) {
      toast({ title: 'Failed', description: e?.message || 'Could not load participants', variant: 'destructive' });
    } finally {
      setParticipantsLoading((s) => ({ ...s, [eventId]: false }));
    }
  };

  const toCsv = (rows: ParticipantRow[]) => {
    const headers = ['Team Name', 'Member Name', 'Registration Number', 'Email', 'Phone'];
    const esc = (v: any) => {
      const s = String(v ?? '');
      if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    };
    const lines = [headers.join(',')];
    for (const r of rows) {
      lines.push([
        esc(r.teamName),
        esc(r.memberName),
        esc(r.memberRegNo || ''),
        esc(r.memberEmail),
        esc(r.memberPhone),
      ].join(','));
    }
    return lines.join('\n');
  };

  const downloadCsv = (eventId: string, eventTitle: string) => {
    const rows = participantsByEvent[eventId] || [];
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileTitle = eventTitle.replace(/[^a-z0-9-_]+/gi, '_');
    a.download = `${fileTitle}_participants.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-8 w-full">
      <div className="w-full max-w-5xl">
        <div className="content-backdrop">
          <Card className="border-0 shadow-none bg-transparent">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="font-headline text-3xl">Events Admin</CardTitle>
                  <CardDescription>Manage Thanima events and registrations</CardDescription>
                </div>
                <form action={onLogout} className="mt-4 sm:mt-0">
                  <Button variant="outline" type="submit" className="button-glow interactive-element"><LogOut/>Logout</Button>
                </form>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <section>
                <CardTitle className="text-xl mb-4">Create Event</CardTitle>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Event name</Label>
                    <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Brief info</Label>
                    <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="eventDate">Event date</Label>
                    <Input id="eventDate" type="datetime-local" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="wa">WhatsApp group link</Label>
                    <Input id="wa" placeholder="https://chat.whatsapp.com/..." value={form.whatsappLink} onChange={(e) => setForm({ ...form, whatsappLink: e.target.value })} />
                  </div>
                  <Separator />
                  <CardTitle className="text-lg">Registration Type</CardTitle>
                  <div className="grid gap-4 sm:grid-cols-2 items-end">
                    <div className="grid gap-2">
                      <Label>Team based?</Label>
                      <div className="flex items-center gap-2">
                        <input id="isTeamBased" type="checkbox" checked={form.isTeamBased} onChange={(e) => setForm({ ...form, isTeamBased: e.target.checked, minTeamSize: e.target.checked ? Math.max(2, form.minTeamSize) : 1, maxTeamSize: e.target.checked ? Math.max(2, form.maxTeamSize, form.minTeamSize) : 1 })} />
                        <Label htmlFor="isTeamBased">Enable team registration</Label>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="minTeamSize">Min team size</Label>
                      <Input id="minTeamSize" type="number" min={form.isTeamBased ? 2 : 1} max={50} value={form.minTeamSize} onChange={(e) => {
                        const v = Number(e.target.value || 1);
                        setForm({ ...form, minTeamSize: v, maxTeamSize: Math.max(v, form.maxTeamSize) });
                      }} disabled={!form.isTeamBased} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxTeamSize">Max team size</Label>
                      <Input id="maxTeamSize" type="number" min={form.isTeamBased ? Math.max(2, form.minTeamSize) : 1} max={50} value={form.maxTeamSize} onChange={(e) => {
                        const v = Number(e.target.value || 1);
                        setForm({ ...form, maxTeamSize: Math.max(v, form.minTeamSize) });
                      }} disabled={!form.isTeamBased} />
                    </div>
                  </div>
                  <Separator />
                  <CardTitle className="text-lg">Coordinators</CardTitle>
                  {form.coordinators.map((c, idx) => (
                    <div key={idx} className="grid gap-4 sm:grid-cols-2 items-end">
                      <div className="grid gap-2">
                        <Label>Name</Label>
                        <Input value={c.name} onChange={(e) => {
                          const list = [...form.coordinators];
                          list[idx] = { ...list[idx], name: e.target.value };
                          setForm({ ...form, coordinators: list });
                        }} />
                      </div>
                      <div className="grid gap-2">
                        <Label>Phone</Label>
                        <Input value={c.phone} onChange={(e) => {
                          const list = [...form.coordinators];
                          list[idx] = { ...list[idx], phone: e.target.value };
                          setForm({ ...form, coordinators: list });
                        }} />
                      </div>
                      <div className="sm:col-span-2 flex justify-end gap-2">
                        {form.coordinators.length > 1 && (
                          <Button type="button" variant="destructive" onClick={() => handleRemoveCoordinator(idx)}>
                            <Trash2 className="h-4 w-4" /> Remove
                          </Button>
                        )}
                        {idx === form.coordinators.length - 1 && form.coordinators.length < 3 && (
                          <Button type="button" onClick={handleAddCoordinator}>
                            <Plus className="h-4 w-4" /> Add coordinator
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button onClick={submitEvent} disabled={saving}>{saving ? 'Saving...' : 'Create Event'}</Button>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <CardTitle className="text-xl mb-4">Events</CardTitle>
                {loading ? (
                  <p>Loading...</p>
                ) : events.length === 0 ? (
                  <p>No events yet.</p>
                ) : (
                  <div className="grid gap-4">
                    {events.map((ev) => (
                      <div key={ev.id} className="p-4 border rounded-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{ev.title}</p>
                            <p className="text-sm text-muted-foreground">{new Date(ev.eventDate).toLocaleString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => viewParticipants(ev.id)} disabled={participantsLoading[ev.id]}>
                              {participantsLoading[ev.id] ? 'Loading…' : 'View participants'}
                            </Button>
                            <Button variant="secondary" onClick={() => downloadCsv(ev.id, ev.title)} disabled={!participantsByEvent[ev.id]?.length}>
                              Download Excel
                            </Button>
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{ev.description}</p>
                        {participantsByEvent[ev.id] && (
                          <div className="mt-4 overflow-x-auto">
                            {participantsByEvent[ev.id].length === 0 ? (
                              <p className="text-sm text-muted-foreground">No participants yet.</p>
                            ) : (
                              <table className="w-full text-sm border">
                                <thead>
                                  <tr className="bg-muted">
                                    <th className="text-left p-2 border">Team Name</th>
                                    <th className="text-left p-2 border">Member Name</th>
                                    <th className="text-left p-2 border">Reg No</th>
                                    <th className="text-left p-2 border">Email</th>
                                    <th className="text-left p-2 border">Phone</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {participantsByEvent[ev.id].map((r, i) => (
                                    <tr key={r.entryId + '_' + i}>
                                      <td className="p-2 border">{r.teamName}</td>
                                      <td className="p-2 border">{r.memberName}</td>
                                      <td className="p-2 border">{r.memberRegNo || ''}</td>
                                      <td className="p-2 border">{r.memberEmail}</td>
                                      <td className="p-2 border">{r.memberPhone}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
