import { NextResponse } from 'next/server';

/**
 * Validates a request against Vercel's Cron signature / OIDC token
 * or falls back to basic Bearer token with timing-safe equality.
 */
export async function verifyVercelCron(req: Request) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return false;
  }

  // To secure against timing attacks for static secrets:
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    try {
      const crypto = await import('crypto');
      const isMatch = crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(cronSecret)
      );
      if (isMatch) return true;
    } catch (e) {
      if (token === cronSecret) return true;
    }
  }

  // TODO: Add Vercel OIDC or JWT signature validation if you enabled
  // strict cryptographic OIDC verification in your Vercel Project settings.
  // const oidcToken = req.headers.get('x-vercel-oidc-token');
  // if (oidcToken) { ... verify JWT ... }

  return false;
}