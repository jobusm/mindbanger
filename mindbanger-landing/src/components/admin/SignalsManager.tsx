"use client";
import toast from 'react-hot-toast';
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit2, Trash2, Calendar, Radio, CheckCircle2, Circle } from "lucide-react";

type DailySignal = {
  id: string;
  date: string;
  title: string;
  theme: string;
  signal_text: string;
  focus_text: string | null;
  affirmation: string | null;
  audio_url: string | null;
  spoken_audio_url?: string | null;
  push_text?: string | null;
  language: string;
  is_published: boolean;
};

export default function SignalsManager() {
  const [signals, setSignals] = useState<DailySignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSignal, setEditingSignal] = useState<DailySignal | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSignals();
  }, []);

  async function fetchSignals() {
    setLoading(true);
    const { data, error } = await supabase
      .from('daily_signals')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error && data) {
      setSignals(data);
    }
    setLoading(false);
  }

  function handleEdit(signal: DailySignal) {
    setEditingSignal(signal);
    setIsFormOpen(true);
  }

  function handleNew() {
    const today = new Date().toISOString().split('T')[0];
    setEditingSignal({
      id: '',
      date: today,
      title: '',
      theme: '',
      signal_text: '',
      focus_text: '',
      affirmation: '',
      audio_url: '',
      language: 'sk',
      is_published: false
    });
    setIsFormOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Naozaj vymazať?')) return;
    const { error } = await supabase.from('daily_signals').delete().eq('id', id);
    if (!error) fetchSignals();
  }

  async function saveSignal(e: React.FormEvent) {
    e.preventDefault();
    if (!editingSignal) return;

    // Prevent submitting empty IDs for new records
    const payload = { ...editingSignal };
    if (!payload.id) {
      delete (payload as any).id;
    }

    if (editingSignal.id) {
      // Update
      const { error } = await supabase.from('daily_signals').update(payload).eq('id', editingSignal.id);
      if (!error) {
        setIsFormOpen(false);
        fetchSignals();
      } else {
        toast.error(error.message);
      }
    } else {
      // Insert
      const { error } = await supabase.from('daily_signals').insert([payload]);
      if (!error) {
        setIsFormOpen(false);
        fetchSignals();
      } else {
        toast.error(error.message);
      }
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, field: 'audio_url' | 'spoken_audio_url' = 'audio_url') {
    const file = e.target.files?.[0];
    if (!file || !editingSignal) return;

    if (!file.name.toLowerCase().endsWith('.mp3')) {
      toast.error('Prosím, nahrajte iba .mp3 súbory.');
      return;
    }

    setIsUploading(true);

    try {
      // 1. Get presigned URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!res.ok) {
        throw new Error('Nepodarilo sa získať link pre nahratie súboru');
      }

      const { uploadUrl, publicUrl } = await res.json();

      // 2. Upload file to R2
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Nepodarilo sa nahrať súbor na server');
      }

      // 3. Update state with public URL using functional update to preserve latest state
      setEditingSignal(prev => {
        if (!prev) return null;
        return {
          ...prev,
          [field]: publicUrl
        };
      });
      toast.success('Súbor bol úspešne nahratý!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Nastala chyba pri nahrávaní súboru.');
    } finally {
      setIsUploading(false);
    }
  }

  if (loading && signals.length === 0) return <div className="p-10 text-slate-400">Načítavam admin panel...</div>;

  return (
    <div className="py-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-white mb-2">Editor obsahu</h2>
          <p className="text-slate-400">Správa denných signálov a obsahu</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" /> Pridať Signal
        </button>
      </div>

      {isFormOpen && editingSignal && (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 mb-10 relative">
          <h2 className="text-xl text-white font-bold mb-6">
            {editingSignal.id ? 'Upraviť signál' : 'Nový signál'}
          </h2>
          <form onSubmit={saveSignal} className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Jazyk</label>
                <select value={editingSignal.language} onChange={e => setEditingSignal({...editingSignal, language: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" required>
                  <option value="sk">Slovenčina (sk)</option>
                  <option value="en">English (en)</option>
                  <option value="cs">Čeština (cs)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Dátum</label>
                <input type="date" value={editingSignal.date} onChange={e => setEditingSignal({...editingSignal, date: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" required />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Hlavný nadpis (Title)</label>
                <input type="text" value={editingSignal.title} onChange={e => setEditingSignal({...editingSignal, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" required placeholder="Napr. The Unseen Hand" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Téma (Theme/Badge)</label>
                <input type="text" value={editingSignal.theme} onChange={e => setEditingSignal({...editingSignal, theme: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" required placeholder="Napr. OCHRANA / STRATÉGIA" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Hlavný text signálu</label>
              <p className="text-xs text-slate-500 mb-2">Formátovanie riadkov sa zachová po uložení presne tak ako ukazuješ aj s medzerami dňa.</p>
              <textarea 
                value={editingSignal.signal_text} 
                onChange={e => setEditingSignal({...editingSignal, signal_text: e.target.value})} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-white focus:outline-none focus:border-amber-500 min-h-[200px]" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Text Push Notifikácie (Voliteľné)</label>
              <p className="text-xs text-slate-500 mb-2">Tento text sa odošle registrovaným používateľom na mobil/počítač, ak sú notifikácie zapnuté.</p>
              <textarea
                value={editingSignal.push_text || ''}
                onChange={e => setEditingSignal({...editingSignal, push_text: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500"
                rows={2}
                placeholder="Napr: Dnešný signál je pripravený! Téma: ..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Fokus dňa (Voliteľné)</label>
                <textarea value={editingSignal.focus_text || ''} onChange={e => setEditingSignal({...editingSignal, focus_text: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" rows={3} />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Afirmácia (Voliteľné)</label>
                <textarea value={editingSignal.affirmation || ''} onChange={e => setEditingSignal({...editingSignal, affirmation: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" rows={3} />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2 font-bold">Meditácia / Hudba (Daily Reset)</label>
                <div className="flex flex-col space-y-2">
                  <input 
                    type="file" 
                    accept=".mp3" 
                    onChange={handleFileUpload} 
                    disabled={isUploading}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20"
                  />
                  {isUploading && <span className="text-amber-500 text-sm">Nahrávam...</span>}
                  
                  {/* Visual indicator of existing file */}
                  {editingSignal.audio_url && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-2 rounded text-xs flex items-center">
                      <CheckCircle2 size={12} className="mr-2" /> Súbor uložený: ...{editingSignal.audio_url.slice(-20)}
                    </div>
                  )}

                  <label className="text-xs text-slate-600 uppercase mt-2">Alebo vložte URL manuálne:</label>
                  <input type="text" value={editingSignal.audio_url || ''} onChange={e => setEditingSignal({...editingSignal, audio_url: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 text-sm" placeholder="URL kľúč / adresa z poľa vyššie" />
                </div>
              </div>

              <div className="flex flex-col space-y-2 pb-3 justify-end mt-2">
                <label className="block text-sm text-slate-400 mb-2 font-bold">Prečítaný text signálu (Hovorené slovo)</label>
                <input 
                  type="file" 
                  accept=".mp3"
                  onChange={e => handleFileUpload(e, 'spoken_audio_url')}
                  disabled={isUploading}
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20"
                />
                 {/* Visual indicator of existing file */}
                 {editingSignal.spoken_audio_url && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-2 rounded text-xs flex items-center">
                      <CheckCircle2 size={12} className="mr-2" /> Súbor uložený: ...{editingSignal.spoken_audio_url.slice(-20)}
                    </div>
                  )}

                  <label className="text-xs text-slate-600 uppercase mt-2">Alebo vložte URL manuálne:</label>
                <input type="text" value={editingSignal.spoken_audio_url || ''} onChange={e => setEditingSignal({...editingSignal, spoken_audio_url: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500 text-sm" placeholder="URL kľúč / adresa pre hovorené slovo" />
              </div>

              <div className="flex items-end pb-3 mt-4 md:col-span-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={editingSignal.is_published} onChange={e => setEditingSignal({...editingSignal, is_published: e.target.checked})} className="w-5 h-5 accent-amber-500 rounded bg-slate-900 border-slate-700" />
                  <span className="text-white font-medium">Publikovať viditeľné pre používateľov</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isUploading} className={`px-8 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-400'}`}>
                {isUploading ? 'Nahrávam...' : 'Save Signál'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="p-4 font-medium">Stav</th>
                <th className="p-4 font-medium">Jazyk</th>
                <th className="p-4 font-medium">Dátum</th>
                <th className="p-4 font-medium">Téma / Nadpis</th>
                <th className="p-4 font-medium">Audio</th>
                <th className="p-4 font-medium text-right">Akcie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {signals.map(sig => (
                <tr key={sig.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    {sig.is_published 
                      ? <CheckCircle2 size={18} className="text-emerald-500" /> 
                      : <Circle size={18} className="text-slate-600" />}
                  </td>
                  <td className="p-4 font-bold text-xs uppercase text-slate-500">
                    {sig.language}
                  </td>
                  <td className="p-4 text-white font-medium whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar size={14} className="text-slate-500" />
                      <span>{sig.date}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white mb-0.5">{sig.title}</div>
                    <div className="text-xs text-amber-500/80 uppercase tracking-wider">{sig.theme}</div>
                  </td>
                  <td className="p-4">
                    {sig.audio_url ? <Radio size={16} className="text-amber-500" /> : <span className="text-slate-600">-</span>}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleEdit(sig)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(sig.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-2">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {signals.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Zatiaľ žiadne signály. Vytvorte prvý záznam.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
