'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { X, Save, Building2 } from 'lucide-react';

export default function CompanySettingsModal({
  isOpen,
  onClose,
  organization,
  lang,
  onUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  organization: any;
  lang: string;
  onUpdate: (updatedOrg: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    tax_id: '',
    dic: '',
    address_street: '',
    address_city: '',
    address_zip: '',
    address_country: '',
    billing_email: ''
  });
  const [loading, setLoading] = useState(false);

  const t = {
    title: (lang === 'sk' || lang === 'cs') ? 'Firemn� �daje' : 'Company Details',
    desc: (lang === 'sk' || lang === 'cs') ? 'Tieto �daje bud� pou�it� na faktur�ciu.' : 'These details will be used for billing.',
    name: (lang === 'sk' || lang === 'cs') ? 'N�zov spolo�nosti' : 'Company Name',
    tax_id: (lang === 'sk' || lang === 'cs') ? 'I�O' : 'Company ID (I�O)',
    dic: (lang === 'sk' || lang === 'cs') ? 'DI� / I� DPH' : 'Tax ID (DI� / VAT)',
    street: (lang === 'sk' || lang === 'cs') ? 'Ulica a ��slo' : 'Street & Number',
    city: (lang === 'sk' || lang === 'cs') ? 'Mesto' : 'City',
    zip: (lang === 'sk' || lang === 'cs') ? 'PS�' : 'ZIP Code',
    country: (lang === 'sk' || lang === 'cs') ? 'Krajina' : 'Country',
    billing_email: (lang === 'sk' || lang === 'cs') ? 'Faktura�n� email' : 'Billing Email',
    save: (lang === 'sk' || lang === 'cs') ? 'Ulo�i� zmeny' : 'Save Changes',
    cancel: (lang === 'sk' || lang === 'cs') ? 'Zru�i�' : 'Cancel',
    success: (lang === 'sk' || lang === 'cs') ? '�daje boli �spe�ne ulo�en�.' : 'Details saved successfully.',
    error: (lang === 'sk' || lang === 'cs') ? 'Nastala chyba pri ukladan� �dajov.' : 'An error occurred while saving details.',
    required: (lang === 'sk' || lang === 'cs') ? 'Pros�m vypl�te v�etky povinn� polia.' : 'Please fill all required fields.'
  };

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        tax_id: organization.tax_id || '',
        dic: organization.dic || '',
        address_street: organization.address_street || '',
        address_city: organization.address_city || '',
        address_zip: organization.address_zip || '',
        address_country: organization.address_country || '',
        billing_email: organization.billing_email || ''
      });
    }
  }, [organization, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address_street || !formData.address_city || !formData.address_zip || !formData.tax_id || !formData.dic) {
      toast.error(t.required);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update({
          name: formData.name,
          tax_id: formData.tax_id,
          dic: formData.dic,
          address_street: formData.address_street,
          address_city: formData.address_city,
          address_zip: formData.address_zip,
          address_country: formData.address_country,
          billing_email: formData.billing_email
        })
        .eq('id', organization.id)
        .select()
        .single();

      if (error) throw error;
      
      toast.success(t.success);
      onUpdate(data);
      onClose();
    } catch (err: any) {
      console.error('Update org error:', err);
      toast.error(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 mx-2 mt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
              <Building2 className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.title}</h2>
              <p className="text-sm text-slate-400">{t.desc}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          <form id="org-settings-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">{t.name} *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">{t.billing_email} *</label>
                <input
                  type="email"
                  required
                  value={formData.billing_email}
                  onChange={e => setFormData({...formData, billing_email: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">{t.tax_id} *</label>
                <input
                  type="text"
                  required
                  value={formData.tax_id}
                  onChange={e => setFormData({...formData, tax_id: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">{t.dic} *</label>
                <input
                  type="text"
                  required
                  value={formData.dic}
                  onChange={e => setFormData({...formData, dic: e.target.value})}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div className="border-t border-white/5 pt-6 mt-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Adresa s�dla</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">{t.street} *</label>
                  <input
                    type="text"
                    required
                    value={formData.address_street}
                    onChange={e => setFormData({...formData, address_street: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">{t.city} *</label>
                  <input
                    type="text"
                    required
                    value={formData.address_city}
                    onChange={e => setFormData({...formData, address_city: e.target.value})}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">{t.zip} *</label>
                    <input
                      type="text"
                      required
                      value={formData.address_zip}
                      onChange={e => setFormData({...formData, address_zip: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">{t.country}</label>
                    <input
                      type="text"
                      value={formData.address_country}
                      onChange={e => setFormData({...formData, address_country: e.target.value})}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20"
                      placeholder="Slovensko"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-slate-800/50 flex justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            form="org-settings-form"
            disabled={loading}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
