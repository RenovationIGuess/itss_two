import { z } from 'zod';

export const taskCreationSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: 'Title must be at least 1 characters long',
    })
    .max(50, {
      message: 'Title cannot be longer than 50 characters',
    }),
  due: z.date().optional(),
  description: z.string().optional(),
  exp: z
    .number()
    .min(1, {
      message: 'Experience must be at least 1',
    })
    .max(100, {
      message: 'Experience cannot be greater than 100',
    })
    .default(10),
});

export const taskUpdateSchema = z.object({
  title: z
    .string()
    .min(4, {
      message: 'Title must be at least 4 characters long',
    })
    .max(50, {
      message: 'Title cannot be longer than 50 characters',
    }),
  due: z.date().optional(),
  description: z.string().optional(),
  exp: z
    .number()
    .min(1, {
      message: 'Experience must be at least 1',
    })
    .max(100, {
      message: 'Experience cannot be greater than 100',
    })
    .default(10),
});
