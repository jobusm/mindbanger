import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-service';
import { createClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
    try {
        const { companyName, industry, initialSeats, phone, affiliateId, newUserId } = await req.json();
        
        // 1. Validated Authenticated User
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        let userId = session?.user?.id;

        const supabaseAdmin = getServiceSupabase();

        // Fallback: check Authorization header if session is not yet in cookies
        if (!userId) {
            const authHeader = req.headers.get('Authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
                if (user && !userError) {
                    userId = user.id;
                }
            }
        }

        // Second Fallback: if user just registered but email is unconfirmed, we might get user ID from body
        // Only allow this if we pass a special one-time registration token? 
        // For now, if we don't have a userId, we reject.
        if (!userId) {
            // Check if client passed the new user ID explicitly (less secure but required if email confirmation is strictly on without session)

            if (newUserId) {
                // Verify the user was created very recently (within 5 minutes)
                const { data: recentUser } = await supabaseAdmin.auth.admin.getUserById(newUserId);
                if (recentUser?.user) {
                    const createdTime = new Date(recentUser.user.created_at).getTime();
                    if (Date.now() - createdTime < 5 * 60 * 1000) {
                        userId = recentUser.user.id;
                    }
                }
            }
        }

        if (!userId) {
            return new NextResponse('Unauthorized: Please sign in first', { status: 401 });
        }

        // Use SERVICE ROLE key because a new user has no rights to create organizations
        
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