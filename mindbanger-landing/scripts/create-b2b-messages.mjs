import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL || 'postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres', { ssl: 'require' });

async function createTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS public.b2b_messages (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        organization_id uuid REFERENCES public.organizations(id) ON DELETE CASCADE,
        sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
        content text NOT NULL,
        is_admin_reply boolean DEFAULT false,
        is_read boolean DEFAULT false,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `;
    
    // Enable RLS
    await sql`ALTER TABLE public.b2b_messages ENABLE ROW LEVEL SECURITY;`;
    
    // Select policy
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'b2b_messages' AND policyname = 'b2b_messages_select_policy') THEN
            CREATE POLICY b2b_messages_select_policy ON public.b2b_messages FOR SELECT
            USING (auth.uid() IN (SELECT user_id FROM organization_members WHERE organization_id = b2b_messages.organization_id) OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
        END IF;
      END
      $$;
    `;

    // Insert policy
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'b2b_messages' AND policyname = 'b2b_messages_insert_policy') THEN
            CREATE POLICY b2b_messages_insert_policy ON public.b2b_messages FOR INSERT
            WITH CHECK (auth.uid() IN (SELECT user_id FROM organization_members WHERE organization_id = b2b_messages.organization_id) OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
        END IF;
      END
      $$;
    `;

    // Update policy (for admin to mark as read)
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'b2b_messages' AND policyname = 'b2b_messages_update_policy') THEN
            CREATE POLICY b2b_messages_update_policy ON public.b2b_messages FOR UPDATE
            USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
        END IF;
      END
      $$;
    `;

    // Realtime enabling
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'b2b_messages'
        ) THEN
            ALTER PUBLICATION supabase_realtime ADD TABLE public.b2b_messages;
        END IF;
      END
      $$;
    `;

    console.log("Table b2b_messages successfully created & RLS configured!");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
createTable();