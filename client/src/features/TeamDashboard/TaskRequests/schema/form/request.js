import { z } from 'zod';

export const requestCreationSchema = z.object({
  evidence: z.string().min(1, {
    message: 'Evidence is required.',
  }),
});

export const requestUpdateSchema = z.object({
  evidence: z.string().min(1, {
    message: 'Evidence is required.',
  }),
});
