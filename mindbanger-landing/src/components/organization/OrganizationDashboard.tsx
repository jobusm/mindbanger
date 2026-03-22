'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { User, UserPlus, X, Shield, ShieldCheck, Mail, CheckCircle, Clock, Trash2, Edit2, Save, XCircle, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import OrgMessages from '@/components/b2b/OrgMessages';

type Member = {
  id: string; // membership id
  user_id: string; // user profile id
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'invited' | 'active' | 'disabled';
  created_at: string;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
};

type Organization = {
  id: string;
  name: string;
  tax_id: string | null;
  billing_email: string;
  seats_limit: number;
  subscription_status: string;
  industry: string | null;
};

export default function OrganizationDashboard({ 
  organization, 
  initialMembers,
  userRole,
  lang,
  dict,
  stats
}: { 
  organization: Organization; 
  initialMembers: any[]; 
  userRole: string;
  lang: string;
  dict: any;
  stats?: { corporate: number; daily: number };
}) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isOwner = userRole === 'owner';
  const t = {
      seats: lang === 'sk' ? 'Počet miest' : 'Seats used',
      taxId: lang === 'sk' ? 'IČO' : 'Tax ID',
      billing: lang === 'sk' ? 'Fakturačný email' : 'Billing Email',
      addMember: lang === 'sk' ? 'Pridať člena' : 'Add Member',
      emailPlaceholder: lang === 'sk' ? 'Email zamestnanca' : 'Employee email',
      invite: lang === 'sk' ? 'Pozvať' : 'Invite',
      remove: lang === 'sk' ? 'Odstrániť' : 'Remove',
      role: lang === 'sk' ? 'Rola' : 'Role',
      status: lang === 'sk' ? 'Stav' : 'Status',
      active: lang === 'sk' ? 'Aktívny' : 'Active',
      invited: lang === 'sk' ? 'Pozvaný' : 'Invited',
      disabled: lang === 'sk' ? 'Zablokovaný' : 'Disabled',
      owner: lang === 'sk' ? 'Vlastník' : 'Owner',
      admin: lang === 'sk' ? 'Admin' : 'Admin',
      member: lang === 'sk' ? 'Člen' : 'Member',
      limitReached: lang === 'sk' ? 'Limit miest dosiahnutý' : 'Seat limit reached',
      alreadyMember: lang === 'sk' ? 'Tento email je už členom' : 'This email is already a member',
      successInvite: lang === 'sk' ? 'Pozvánka odoslaná' : 'Invitation sent',
      successRemove: lang === 'sk' ? 'Člen odstránený' : 'Member removed',
      error: lang === 'sk' ? 'Nastala chyba' : 'An error occurred',
      confirmRemove: lang === 'sk' ? 'Naozaj chcete odstrániť tohto člena?' : 'Are you sure you want to remove this member?',
      cannotRemoveSelf: lang === 'sk' ? 'Nemôžete odstrániť sami seba' : 'You cannot remove yourself',
      upgrade: lang === 'sk' ? 'Navýšiť počet miest' : 'Upgrade seats',
  };

  const activeMembersCount = members.filter(m => m.status === 'active' || m.status === 'invited').length;
  const seatsLeft = organization.seats_limit - activeMembersCount;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;

    if (activeMembersCount >= organization.seats_limit) {
      toast.error(t.limitReached);
      return;
    }
    
    // Check if duplicate in list
    if (members.some(m => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
        toast.error(t.alreadyMember);
        return;
    }

    setLoading(true);

    try {
      // 1. Create Invite Record
      const { data, error } = await supabase
        .from('organization_members')
        .insert({
          organization_id: organization.id,
          email: inviteEmail.toLowerCase(),
          role: 'member',
          status: 'invited'
        })
        .select(`
          id,
          email,
          role,
          status,
          created_at,
          user_id,
          profiles (full_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      // 2. Add to local list
      // @ts-expect-error - Types might mismatch lightly but safe here
      setMembers([data, ...members]);
      setInviteEmail('');
      toast.success(t.successInvite);
      
      // 3. Send Email Invite
      try {
        const { data: { user } } = await supabase.auth.getUser();
        // Fire and forget, or await? Await to ensure delivery.
        await fetch('/api/b2b/invite', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: inviteEmail, 
                orgId: organization.id,
                inviterName: user?.user_metadata?.full_name || 'Admin',
                lang: lang
            }) 
        });
      } catch (e) {
         console.error('Failed to send invite email', e);
         toast.error(lang === 'sk' ? 'Pozvánka vytvorená, ale email zlyhal.' : 'Invite created, but email failed.');
      }

    } catch (err: any) {
      console.error(err);
      toast.error(t.error + ": " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm(t.confirmRemove)) return;

    try {
        const { error } = await supabase
            .from('organization_members')
            .delete()
            .eq('id', memberId);

        if (error) throw error;
        
        setMembers(members.filter(m => m.id !== memberId));
        toast.success(t.successRemove);
    } catch (err: any) {
        toast.error(t.error);
    }
  };

  const updateRole = async (memberId: string, newRole: string) => {
      try {
          const { error } = await supabase
            .from('organization_members')
            .update({ role: newRole })
            .eq('id', memberId);
           
          if (error) throw error;
          
          setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole as any } : m));
          toast.success(t.successInvite); // Re-using success message for update
      } catch (err) {
          toast.error(t.error);
      }
  };

  return (
    <div className="space-y-8">
       {/* Stats Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
              <h3 className="text-slate-400 text-sm font-medium mb-1">{t.seats}</h3>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-bold text-white">{activeMembersCount}</span>
                 <span className="text-slate-500">/ {organization.seats_limit}</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 mt-4 rounded-full overflow-hidden">
                 <div 
                   className={`h-full ${seatsLeft === 0 ? 'bg-red-500' : 'bg-blue-500'}`} 
                   style={{ width: `${Math.min((activeMembersCount / organization.seats_limit) * 100, 100)}%` }} 
                 />
              </div>
          </div>
          
          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
              <h3 className="text-slate-400 text-sm font-medium mb-1">{t.status}</h3>
              <div className="flex items-center gap-2 mt-1">
                 {organization.subscription_status === 'active' ? (
                     <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold border border-green-500/20">
                         {t.active}
                     </span>
                 ) : (
                     <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-semibold border border-yellow-500/20 capitalize">
                         {organization.subscription_status === 'registered' ? (lang === 'sk' ? 'Čaká na aktiváciu' : 'Pending Activation') : organization.subscription_status}
                     </span>
                 )}
              </div>
              <p className="text-slate-500 text-sm mt-3">{t.billing}: {organization.billing_email}</p>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
               <h3 className="text-slate-400 text-sm font-medium mb-3">{lang === 'sk' ? 'Aktivita tímu' : 'Team Activity'}</h3>
               <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                        <div className="text-xl font-bold text-white">{stats?.corporate || 0}</div>
                        <div className="text-[10px] text-blue-400 uppercase font-bold mt-1 tracking-wide">{lang === 'sk' ? 'Firemné' : 'Corp'}</div>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                        <div className="text-xl font-bold text-white">{stats?.daily || 0}</div>
                        <div className="text-[10px] text-amber-500 uppercase font-bold mt-1 tracking-wide">{lang === 'sk' ? 'Denné' : 'Daily'}</div>
                    </div>
               </div>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center">
              {organization.subscription_status === 'registered' ? (
                  <div className="text-center">
                      <p className="text-amber-500 font-bold text-sm mb-2">{lang === 'sk' ? 'Účet vyžaduje aktiváciu' : 'Account needs activation'}</p>
                      <p className="text-xs text-slate-400">{lang === 'sk' ? 'Kontaktujte nás pre aktiváciu zamestnaneckých účtov.' : 'Contact us to activate employee seats.'}</p>
                  </div>
              ) : (
                  <button disabled className="w-full py-2 px-4 bg-slate-800 text-slate-400 rounded-lg cursor-not-allowed text-sm font-medium">
                      {t.upgrade} (Coming Soon)
                  </button>
              )}
          </div>
       </div>

       {/* Invite Form */}
       <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
             <UserPlus size={18} className="text-blue-500" />
             {t.addMember}
          </h3>
          <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4">
              <input 
                type="email" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="flex-1 bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <button 
                type="submit" 
                disabled={loading || seatsLeft <= 0}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                  {loading ? <Clock size={18} className="animate-spin" /> : <Mail size={18} />}
                  {t.invite}
              </button>
          </form> 
       </div>

       {/* Members List */}
       <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
                <thead>
                   <tr className="border-b border-white/5 bg-slate-950/50 text-slate-400">
                      <th className="px-6 py-4 font-medium">{t.member}</th>
                      <th className="px-6 py-4 font-medium">{t.role}</th>
                      <th className="px-6 py-4 font-medium">{t.status}</th>
                      <th className="px-6 py-4 font-medium text-right"></th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {members.map((member) => (
                      <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-medium border border-white/5">
                                 {member.profiles?.full_name ? member.profiles.full_name.charAt(0) : member.email.charAt(0).toUpperCase()}
                               </div>
                               <div>
                                  <div className="font-medium text-white">
                                     {member.profiles?.full_name || (member.user_id ? 'Registered User' : 'Pending Invite')}
                                  </div>
                                  <div className="text-slate-500 text-xs">{member.email}</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-4">
                             {userRole === 'owner' && member.role !== 'owner' ? (
                                <div className="relative group w-fit">
                                    <select 
                                        value={member.role}
                                        onChange={(e) => updateRole(member.id, e.target.value)}
                                        className="appearance-none bg-transparent pl-7 pr-8 py-1.5 rounded text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                                    >
                                        <option value="admin" className="bg-slate-900 text-slate-300">{t.admin}</option>
                                        <option value="member" className="bg-slate-900 text-slate-300">{t.member}</option>
                                    </select>
                                    <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                        {member.role === 'admin' ? <Shield size={14} className="text-blue-400" /> : <User size={14} className="text-slate-400" />}
                                    </div>
                                    <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                             ) : (
                                <div className="flex items-center gap-2 px-2 py-1.5">
                                   {member.role === 'owner' && <ShieldCheck size={14} className="text-amber-500" />}
                                   {member.role === 'admin' && <Shield size={14} className="text-blue-400" />}
                                   {member.role === 'member' && <User size={14} className="text-slate-400" />}
                                   <span className="capitalize text-slate-300 font-medium text-sm">
                                       {member.role === 'owner' ? t.owner : (member.role === 'admin' ? t.admin : t.member)}
                                   </span>
                                </div>
                             )}
                         </td>
                         <td className="px-6 py-4">
                            {member.status === 'active' ? (
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                                   <CheckCircle size={10} /> {t.active}
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-500/10 text-slate-400 text-xs font-medium border border-slate-500/20">
                                   <Clock size={10} /> {t.invited}
                                </span>
                            )}
                         </td>
                         <td className="px-6 py-4 text-right">
                            {userRole === 'owner' && member.role !== 'owner' && (
                                <button 
                                  onClick={() => handleRemove(member.id)}
                                  className={`transition-colors p-2 rounded-lg ${member.status === 'invited' ? 'text-amber-500 hover:text-amber-400 hover:bg-amber-500/10' : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'}`}
                                  title={member.status === 'invited' ? (lang === 'sk' ? "Odvolať pozvánku" : "Revoke Invitation") : t.remove}
                                >
                                   {member.status === 'invited' ? <XCircle size={18} /> : <Trash2 size={18} />}
                                </button>
                            )}
                            {userRole === 'admin' && member.role === 'member' && (
                                <button 
                                  onClick={() => handleRemove(member.id)}
                                  className={`transition-colors p-2 rounded-lg ${member.status === 'invited' ? 'text-amber-500 hover:text-amber-400 hover:bg-amber-500/10' : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'}`}
                                  title={member.status === 'invited' ? (lang === 'sk' ? "Odvolať pozvánku" : "Revoke Invitation") : t.remove}
                                >
                                   {member.status === 'invited' ? <XCircle size={18} /> : <Trash2 size={18} />}
                                </button>
                            )}
                         </td>
                      </tr>
                   ))}
                   {members.length === 0 && (
                      <tr>
                         <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                             No members found.
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>

       {/* Support Messages */}
       <OrgMessages organizationId={organization.id} />
    </div>
  );
}