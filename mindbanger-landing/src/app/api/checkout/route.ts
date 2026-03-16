import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover', // using latest version fallback
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, userId, refMode, refCode } = body;

    // Optional: Check if Stripe customer already exists by email 
    // Here we just let Stripe create a new customer and link to userId via metadata

    if (!email || !userId) {
      return NextResponse.json({ error: 'Missing email or user ID' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL 
      || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // ID produktu v Stripe, napr. "price_1XYZ..."
          quantity: 1,
        },
      ],
      // Success will handle supabase db logic via webhooks, but UI redirects here
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      metadata: {
        userId: userId, // Viazanie platby s účtom používateľa
        ...(refMode && { refMode }),
        ...(refCode && { refCode }),
      },
      subscription_data: {
        metadata: {
          userId: userId,
          ...(refMode && { refMode }),
          ...(refCode && { refCode }),
        }
      }
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
