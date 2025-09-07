import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().transform((val) => parseInt(val, 10)),
  FRONTEND_ORIGIN: z.string().url(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_JWT_SECRET: z.string(),
  LINE_LOGIN_CHANNEL_ID: z.string(),
  LINE_LOGIN_CHANNEL_SECRET: z.string(),
  LIFF_ID: z.string(),
  LINE_MESSAGING_CHANNEL_ID: z.string(),
  LINE_MESSAGING_CHANNEL_SECRET: z.string(),
  LINE_MESSAGING_ACCESS_TOKEN: z.string(),
  RECEIPT_BASE_URL: z.string().url(),
  BOOKING_TIMEBLOCK_MINUTES: z.string().transform((val) => parseInt(val, 10)),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validate(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(`Config validation error: ${JSON.stringify(result.error.issues)}`);
  }
  return result.data;
}
