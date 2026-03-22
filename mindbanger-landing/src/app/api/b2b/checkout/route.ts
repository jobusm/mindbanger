import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any, // or latest
});

const BASE_PRICE = 7.99;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      companyName, 
      taxId, 
      vatId, 
      address, 
      contactName, 
      contactEmail, 
      seats, 
      lang 
    } = body;

    if (!companyName || !taxId || !contactEmail || !seats) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const quantity = parseInt(seats);
    if (isNaN(quantity) || quantity < 1) {
        return NextResponse.json({ error: 'Invalid seats' }, { status: 400 });
    }

    // Server-side price calculation logic
    let unitPrice = BASE_PRICE;
    if (quantity >= 25) {
      unitPrice = BASE_PRICE * 0.75;
    } else if (quantity >= 5) {
      unitPrice = BASE_PRICE * 0.85;
    }

    // Convert to cents
    const unitAmountCents = Math.round(unitPrice * 100);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Mindbanger Daily - B2B License (${quantity} Seats)`,
              description: `Monthly subscription for ${companyName}. Includes ${quantity} user licenses.`,
            },
            unit_amount: unitAmountCents,
            recurring: {
              interval: 'month',
            },
          },
          quantity: quantity,
        },
      ],
      mode: 'subscription',
      customer_email: contactEmail, // Pre-fill email
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/b2b/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/b2b?canceled=true`,
      metadata: {
        type: 'b2b_subscription',
        company_name: companyName,
        tax_id: taxId,
        vat_id: vatId || '',
        address: address,
        contact_name: contactName,
        contact_email: contactEmail,
        seats: seats, // Keep as string or number
        lang: lang
      },
      // Tax Automatic calculation
      automatic_tax: { enabled: true },
      // Collect Tax ID if not provided in metadata? Stripe has its own collection field if enabled.
      // But we are collecting it in our form. We can pass it to Customer object later via webhook or update customer creation.
      // Actually, better to let Stripe collect Tax ID on checkout page for proper invoice compliance?
      // But user requirement says we collect it on our form.
      // Let's rely on our metadata for now, but enable tax_id_collection for Stripe invoice correctness.
      tax_id_collection: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}