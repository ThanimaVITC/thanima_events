import { z } from 'zod';

export const coordinatorSchema = z.object({
  name: z.string().min(2, 'Coordinator name is required'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^[+]?[- 0-9()]*$/, 'Invalid phone number'),
});

export const eventSchema = z
  .object({
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
    isTeamBased: z.boolean().default(false),
    minTeamSize: z
      .number({ invalid_type_error: 'Min team size must be a number' })
      .int('Min team size must be an integer')
      .min(1, 'Min team size must be at least 1')
      .max(50, 'Min team size too large')
      .default(1),
    maxTeamSize: z
      .number({ invalid_type_error: 'Max team size must be a number' })
      .int('Max team size must be an integer')
      .min(1, 'Max team size must be at least 1')
      .max(50, 'Max team size too large')
      .default(1),
  })
  .refine((data) => {
    if (!data.isTeamBased) {
      return data.minTeamSize === 1 && data.maxTeamSize === 1;
    }
    if (data.minTeamSize < 2) return false;
    if (data.maxTeamSize < data.minTeamSize) return false;
    return true;
  }, {
    message: 'Invalid team configuration',
    path: ['maxTeamSize'],
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

export const teamMemberSchema = z.object({
  name: z.string().min(2, 'Member name is required'),
  email: z.string().email('Valid email required'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^[+]?[- 0-9()]*$/, 'Invalid phone number'),
  regNo: z.string().optional(),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

export const teamRegistrationSchema = z.object({
  teamName: z.string().min(2, 'Team name is required'),
  // Number of members validated against event configuration in server action
  teamMembers: z.array(teamMemberSchema),
});

export type TeamRegistrationInput = z.infer<typeof teamRegistrationSchema>;


