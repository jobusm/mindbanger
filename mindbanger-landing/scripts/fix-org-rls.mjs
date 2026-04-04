import postgres from 'postgres';
const sql = postgres('postgresql://postgres.ldjibcxqjbrjsmfppyoi:uRWCBrw$NcR3C25@aws-0-eu-central-1.pooler.supabase.com:6543/postgres', { ssl: 'require' });

async function start() {
    try {
        console.log('Fixing RLS policies for organizations & organization_members...');

        const q = `
            -- 1. Helper function for organizations user belongs to (any role)
            CREATE OR REPLACE FUNCTION public.get_user_orgs()
            RETURNS SETOF uuid AS $$
                SELECT organization_id
                FROM public.organization_members
                WHERE user_id = auth.uid() AND status = 'active';
            $$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

            -- 2. Helper function for organizations where user is an admin
            CREATE OR REPLACE FUNCTION public.get_admin_orgs()
            RETURNS SETOF uuid AS $$
                SELECT organization_id
                FROM public.organization_members
                WHERE user_id = auth.uid() AND role IN ('owner', 'admin') AND status = 'active';
            $$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

            -- 3. Helper function for user industries
            CREATE OR REPLACE FUNCTION public.get_user_industries()
            RETURNS SETOF text AS $$
                SELECT o.industry
                FROM public.organizations o
                JOIN public.organization_members m ON m.organization_id = o.id
                WHERE m.user_id = auth.uid() AND m.status = 'active';
            $$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

            -- 4. Update organizations table policy
            DROP POLICY IF EXISTS "Members can view own organization" ON public.organizations;
            CREATE POLICY "Members can view own organization" ON public.organizations
            FOR SELECT TO authenticated
            USING ( id IN (SELECT public.get_user_orgs()) );

            -- 5. Update organization_members table policy
            DROP POLICY IF EXISTS "Org Admins can manage members" ON public.organization_members;
            CREATE POLICY "Org Admins can manage members" ON public.organization_members
            FOR ALL TO authenticated
            USING ( organization_id IN (SELECT public.get_admin_orgs()) );

            -- 6. Update corporate_signals policy
            DROP POLICY IF EXISTS "Members can view corporate signals" ON public.corporate_signals;
            CREATE POLICY "Members can view corporate signals" ON public.corporate_signals
            FOR SELECT TO authenticated
            USING (
                organization_id IN (SELECT public.get_user_orgs())
                OR
                (organization_id IS NULL AND industry IN (SELECT public.get_user_industries()))
            );
            
            -- ALSO refresh the general access ones specifically for SELECT because ALL is problematic and might clash in some edge cases
        `;
        await sql.unsafe(q);

        console.log('RLS Policies successfully updated without infinite loops.');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        process.exit(0);
    }
}
start();
