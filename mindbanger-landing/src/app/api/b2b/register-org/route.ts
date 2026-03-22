import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-service';
import { createClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
    try {
        const { companyName, industry, initialSeats, phone, affiliateId } = await req.json();
        
        // 1. Validated Authenticated User
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
            return new NextResponse('Unauthorized: Please sign in first', { status: 401 });
        }

        const userId = session.user.id;

        // Use SERVICE ROLE key because a new user has no rights to create organizations
        const supabaseAdmin = getServiceSupabase();
        
        // 2. Create Organization
        // Status: 'registered' - means account created but not yet active/paid.
        // Seats: 0 - cannot invite anyone yet (or can invite but they won't get access).
        const { data: org, error: orgError } = await supabaseAdmin
            .from('organizations')
            .insert({
                name: companyName,
                industry: industry,
                seats_limit: initialSeats || 0, 
                subscription_status: 'registered',
                contact_phone: phone,
                affiliate_id: affiliateId || null // Save affiliate reference
            })
            .select()
            .single();

        if (orgError) throw orgError;

        // 2. Link User as Owner
        const { error: memberError } = await supabaseAdmin
            .from('organization_members')
            .insert({
                organization_id: org.id,
                user_id: userId,
                role: 'owner',
                status: 'active'
            });

        if (memberError) throw memberError;

        return NextResponse.json({ success: true, orgId: org.id });

    } catch (e: any) {
        console.error('Registration Error:', e);
        return new NextResponse(JSON.stringify({ message: e.message || 'Error occurred' }), { status: 500 });
    }
}