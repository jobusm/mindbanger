import { NextResponse } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { checkAdminAuth } from "@/lib/auth-admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabaseAdmin = createSupabaseAdminClient(supabaseUrl, supabaseServiceKey);

  try {
    const { data: subs, error } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    // Fetchneme profilové mená k odberom
    const userIds = subs.map((s) => s.user_id).filter(Boolean);
    const profilesMap = new Map();
    if (userIds.length > 0) {
      const { data: profs } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
        
      if (profs) {
        profs.forEach(p => profilesMap.set(p.id, p));
      }
    }

    // Spojíme dokopy
    const joinedList = subs.map(s => {
      const profile = profilesMap.get(s.user_id) || null;
      return {
        ...s,
        profiles: profile,
        display_email: s.customer_email || "N/A"
      };
    });

    return NextResponse.json(joinedList);
  } catch (error: any) {
    console.error("GET subscriptions error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}