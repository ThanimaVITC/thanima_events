import { z } from 'zod';

export const coordinatorSchema = z.object({
  name: z.string().min(2, 'Coordinator name is required'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^[+]?[- 0-9()]*$/, 'Invalid phone number'),
});

export const eventSchema = z.object({
  title: z.string().min(3, 'Event name is required'),
  description: z.string().min(10, 'Brief info is required'),
  eventDate: z.string().refine((v) => !Number.isNaN(Date.parse(v)), {
    message: 'Invalid date format',
  }),
  coordinators: z
    .array(coordinatorSchema)
    .min(1, 'At least one coordinator is required')
    .max(3, 'Maximum 3 coordinators allowed'),
  whatsappLink: z.string().url('Valid WhatsApp group link required'),
});

export type EventInput = z.infer<typeof eventSchema>;

export type EventDocument = EventInput & {
  id: string;
  createdAt: string;
};

export const participantSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^[+]?[- 0-9()]*$/, 'Invalid phone number'),
  regNo: z.string().optional(),
});

export type ParticipantInput = z.infer<typeof participantSchema>;


