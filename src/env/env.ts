import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test', 'staging'])
    .default('development'),
});

export type Env = z.infer<typeof envSchema>;
