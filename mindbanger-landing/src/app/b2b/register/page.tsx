"use client";

import React, { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, User, Mail, Lock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function B2BContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  
  // Affiliate Tracking
  const [affiliateId, setAffiliateId] = useState<string | null>(null);

  React.useEffect(() => {
    // Check URL params first
    const refParam = searchParams?.get('ref');
    if (refParam) {
        setAffiliateId(refParam);
        localStorage.setItem('mindbanger_ref', refParam);
        return;
    }
    // Check localStorage for referral code set by AffiliateTracker
    const ref = localStorage.getItem('mindbanger_ref');
    if (ref) setAffiliateId(ref);
  }, [searchParams]);
  
  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    industry: 'tech',
    seats: 0, // No free seats by default
    firstName: '',
    lastName: '',
    email: '',
    phone: '', // Added Phone
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Vytváram firemný účet...');

    try {
        // 1. Create User via Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: `${formData.firstName} ${formData.lastName}`,
                    role: 'user' // Default to user, logic will elevate
                }
            }
        });

        if (authError) throw authError;

        if (!authData.user) throw new Error('Registrácia zlyhala. Skúste znova.');

        const accessToken = authData.session?.access_token;

        // 2. Call API to Create Organization & Link Owner
        // We do this server-side to ensure atomicity and correct permissions
        const response = await fetch('/api/b2b/register-org', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...(accessToken ? { 'Authorization': `Bearer ${accessToken}` } : {}) 
            },
            body: JSON.stringify({
                // userId is now inferred from token/session
                companyName: formData.companyName,
                industry: formData.industry,
                initialSeats: 0, // No free seats
                phone: formData.phone, // Pass phone
                affiliateId: affiliateId // Pass affiliate ID from localStorage
            })
        });

        if (!response.ok) {
             const errData = await response.json();
             throw new Error(errData.message || 'Chyba pri vytváraní organizácie');
        }

        toast.success('B2B Účet vytvorený! Presmerovávam...', { id: toastId });
        
        // 3. Redirect to Dashboard
        setTimeout(() => {
            router.push('/app/organization'); 
        }, 1500);

    } catch (error: any) {
        console.error(error);
        toast.error(error.message, { id: toastId });
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 font-sans">
      
      <div className="flex items-center gap-3 mb-10 text-white">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              <Building2 size={20} />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">
              Mindbanger <span className="text-white">B2B</span>
          </span>
      </div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Left Panel: Value Prop */}
          <div className="p-8 md:p-12 bg-slate-950/50 border-r border-white/5 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              
              <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white mb-8 leading-tight">
                      Transformujte <br/><span className="text-blue-500">produktivitu</span> vášho tímu.
                  </h2>
                  <ul className="space-y-6">
                      <li className="flex items-start gap-3 text-slate-300">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-400">
                             <CheckCircle2 size={16} />
                          </div>
                          <div>
                             <strong className="text-white block mb-1">Denné mentálne cvičenia</strong>
                             <span className="text-sm text-slate-400">Krátke audio formáty pre lepší fokus a zníženie stresu.</span>
                          </div>
                      </li>
                      <li className="flex items-start gap-3 text-slate-300">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-400">
                             <CheckCircle2 size={16} />
                          </div>
                          <div>
                             <strong className="text-white block mb-1">Cielený obsah</strong>
                             <span className="text-sm text-slate-400">Signály prispôsobené vášmu odvetviu (Tech, Finance, atď.).</span>
                          </div>
                      </li>
                      <li className="flex items-start gap-3 text-slate-300">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-400">
                             <CheckCircle2 size={16} />
                          </div>
                          <div>
                             <strong className="text-white block mb-1">Jednoduchá správa</strong>
                             <span className="text-sm text-slate-400">Prehľadný dashboard, pozvánky a fakturácia na jednom mieste.</span>
                          </div>
                      </li>
                  </ul>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
                  <p className="text-sm text-slate-500 italic">
                      "Starostlivosť o duševné zdravie zamestnancov nie je benefit, ale investícia s vysokou návratnosťou."
                  </p>
              </div>
          </div>

          {/* Right Panel: Form */}
          <div className="p-8 md:p-12 bg-slate-900 relative">
               <form onSubmit={handleRegister} className="space-y-6">
                   
                   <div className="space-y-4">
                       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <Building2 size={14} /> Informácie o firme
                       </h3>
                       
                       <div className="space-y-4">
                           <div className="space-y-1">
                               <label className="text-sm font-medium text-slate-300">Názov spoločnosti</label>
                               <input 
                                   required
                                   type="text" 
                                   name="companyName"
                                   placeholder="Acme Corp, s.r.o."
                                   value={formData.companyName}
                                   onChange={handleChange}
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                               />
                           </div>
                           
                           <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-300">Odvetvie</label>
                                <select 
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                                >
                                    <option value="tech">Technológie & IT</option>
                                    <option value="finance">Financie & Bankovníctvo</option>
                                    <option value="retail">Maloobchod & Služby</option>
                                    <option value="education">Vzdelávanie</option>
                                    <option value="health">Zdravotníctvo</option>
                                    <option value="generic">Iné / Všeobecné</option>
                                </select>
                           </div>
                       </div>
                   </div>

                   <div className="pt-6 space-y-4 border-t border-white/5">
                       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <User size={14} /> Admin účet
                       </h3>
                       
                       <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                               <label className="text-sm font-medium text-slate-300">Meno</label>
                               <input 
                                   required
                                   type="text" 
                                   name="firstName"
                                   placeholder="Ján"
                                   value={formData.firstName}
                                   onChange={handleChange}
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                               />
                           </div>
                           <div className="space-y-1">
                               <label className="text-sm font-medium text-slate-300">Priezvisko</label>
                               <input 
                                   required
                                   type="text" 
                                   name="lastName"
                                   placeholder="Novák"
                                   value={formData.lastName}
                                   onChange={handleChange}
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                               />
                           </div>
                       </div>

                       <div className="space-y-1">
                           <label className="text-sm font-medium text-slate-300">Firemný Email</label>
                           <div className="relative">
                               <Mail className="absolute left-3 top-3 text-slate-500" size={16} />
                               <input 
                                   required
                                   type="email" 
                                   name="email"
                                   placeholder="jan.novak@firma.sk"
                                   value={formData.email}
                                   onChange={handleChange}
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                               />
                           </div>
                       </div>

                       <div className="space-y-1">
                           <label className="text-sm font-medium text-slate-300">Telefónne číslo</label>
                           <input 
                               required
                               type="tel" 
                               name="phone"
                               placeholder="+421 900 000 000"
                               value={formData.phone}
                               onChange={handleChange}
                               className="w-full bg-slate-950 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                           />
                       </div>

                       <div className="space-y-1">
                           <label className="text-sm font-medium text-slate-300">Heslo</label>
                           <div className="relative">
                               <Lock className="absolute left-3 top-3 text-slate-500" size={16} />
                               <input 
                                   required
                                   type="password" 
                                   name="password"
                                   placeholder="••••••••"
                                   value={formData.password}
                                   onChange={handleChange}
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                               />
                           </div>
                       </div>
                   </div>

                   <div className="pt-6">
                       <button 
                           type="submit"
                           disabled={loading}
                           className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-[0.98]"
                       >
                           {loading ? <Loader2 className="animate-spin" /> : <>Vytvoriť Dashboard <ArrowRight size={18} /></>}
                       </button>
                       <p className="text-center text-xs text-slate-500 mt-4">
                           Kliknutím súhlasíte s podmienkami používania Mindbanger B2B. <br/> Žiadna viazanosť.
                       </p>
                   </div>

               </form>
          </div>

      </div>
    </div>
  );
}

export default function B2BRegistration() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center"><Loader2 size={32} className="text-blue-500 animate-spin"/></div>}>
        <B2BContent />
    </Suspense>
  );
}