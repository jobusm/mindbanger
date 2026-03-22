import React from 'react';
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/lib/i18n';
import OrganizationDashboard from '@/components/organization/OrganizationDashboard';

export const revalidate = 0;

export default async function OrganizationPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  // 1. Get User's Organization(s) where they are Admin/Owner
  const { data: membership } = await supabase
    .from('organization_members')
    .select(`
      role,
      organizations (
        id,
        name,
        tax_id,
        billing_email,
        seats_limit,
        subscription_status,
        industry
      )
    `)
    .eq('user_id', session.user.id)
    .in('role', ['owner', 'admin'])
    .eq('status', 'active')
    .single();

  if (!membership || !membership.organizations) {
    // User is not an admin of any organization
    // Redirect to Today or show "No Access"
    redirect('/app/today');
  }

  // Supabase typing for joined tables needs explicit definition
  const orgData = membership.organizations;
  const organization = Array.isArray(orgData) ? orgData[0] : (orgData as any);
  const userRole = membership.role;

  // 2. Get All Members of this Organization
  const { data: members } = await supabase
    .from('organization_members')
    .select(`
      id,
      email,
      role,
      status,
      created_at,
      user_id,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false });

  // 3. Get Dictionary
  const { data: profile } = await supabase
    .from('profiles')
    .select('preferred_language')
    .eq('id', session.user.id)
    .single();
    
  const lang = profile?.preferred_language || 'en';
  const dict = getDictionary(lang);

  // 4. Analytics (Basic)
  const userIds = members?.filter(m => m.user_id).map(m => m.user_id) || [];
  const stats = {
      corporate: 0,
      daily: 0
  };

  if (userIds.length > 0) {
      const { count: corpCount } = await supabase
        .from('user_progress_corporate')
        .select('*', { count: 'exact', head: true })
        .in('user_id', userIds);
      
      const { count: dailyCount } = await supabase
        .from('user_progress') // Correct table for daily signals
        .select('*', { count: 'exact', head: true })
        .in('user_id', userIds);

      stats.corporate = corpCount || 0;
      stats.daily = dailyCount || 0;
  }

  return (
    <div className="py-6 space-y-8">
      <header>
        <h1 className="text-3xl font-serif text-white mb-2">{organization.name}</h1>
        <p className="text-slate-400">
           {lang === 'sk' ? 'Správa organizácie' : 'Organization Management'} • {userRole === 'owner' ? (lang === 'sk' ? 'Vlastník' : 'Owner') : 'Admin'}
        </p>
      </header>

      <OrganizationDashboard 
        organization={organization}
        initialMembers={members || []}
        userRole={userRole}
        lang={lang}
        dict={dict}
        stats={stats}
      />
    </div>
  );
}
