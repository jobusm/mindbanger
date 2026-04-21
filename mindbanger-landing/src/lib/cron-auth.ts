import { NextResponse } from 'next/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export async function verifyVercelCron(req: Request) {
  // 1. Try secure Vercel OIDC/JWT verification first
  const oidcToken = req.headers.get('authorization')?.replace('Bearer ', '');
  if (oidcToken) {
     try {
        const jwks = createRemoteJWKSet(new URL('https://vercel.com/api/oidc/jwks'));
        const options: any = { issuer: 'https://vercel.com' };
        
        // Strict audience verification via project ID
        // Mandate VERCEL_PROJECT_ID for OIDC!
        if (!process.env.VERCEL_PROJECT_ID) {
            console.error('Missing VERCEL_PROJECT_ID for Cron OIDC verification');
            return false;
        }
        
        options.audience = process.env.VERCEL_PROJECT_ID;

        await jwtVerify(oidcToken, jwks, options);
        return true;
     } catch (jwtError) {
        // Fallthrough if it's not a JWT (e.g. static secret fallback)
     }
  }

  // 2. Static secret fallback (CRON_SECRET)
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;

  if (oidcToken) {
    try {
      const crypto = await import('crypto');
      // Buffer length must match for timingSafeEqual, we check length first
      const tokenBuffer = Buffer.from(oidcToken);
      const secretBuffer = Buffer.from(cronSecret);
      
      if (tokenBuffer.length === secretBuffer.length) {
         if (crypto.timingSafeEqual(tokenBuffer, secretBuffer)) {
            return true;
         }
      }
    } catch (e) {
      if (oidcToken === cronSecret) return true;
    }
  }

  return false;
}