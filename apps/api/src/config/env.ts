import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '4000', 10),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  CLERK_SECRET_KEY: requireEnv('CLERK_SECRET_KEY'),
  CLERK_PUBLISHABLE_KEY: requireEnv('CLERK_PUBLISHABLE_KEY'),
} as const;
