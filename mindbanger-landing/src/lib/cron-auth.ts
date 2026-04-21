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
        console.error('CRON OIDC validation failed', jwtError);
        return false;
     }
  }

  return false;
}