"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Megaphone, Image as ImageIcon, Video, UploadCloud } from "lucide-react";

type PromoMaterial = {
  id: string;
  title: string;
  type: 'Banner' | 'Video';
  url: string;
  language: 'EN' | 'SK';
  resolution: string | null;
  created_at: string;
};

export default function AffiliateManager() {
  const [materials, setMaterials] = useState<PromoMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Partial<PromoMaterial> | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  async function fetchMaterials() {
    setLoading(true);
    const { data, error } = await supabase
      .from('affiliate_materials')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setMaterials(data as PromoMaterial[]);
    }
    setLoading(false);
  }

  function handleNew() {
    setEditingMaterial({
      title: '',
      type: 'Banner',
      url: '',
      language: 'SK',
      resolution: '',
    });
    setIsFormOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Naozaj vymazať tento materiál?')) return;
    const { error } = await supabase.from('affiliate_materials').delete().eq('id', id);
    if (!error) fetchMaterials();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editingMaterial) return;

    if (editingMaterial.type === 'Banner' && !file.type.startsWith('image/')) {
      alert('Pre typ Banner zvoľte obrázok.');
      return;
    }
    
    if (editingMaterial.type === 'Video' && !file.type.startsWith('video/')) {
      alert('Pre typ Video zvoľte video súbor.');
      return;
    }

    setIsUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!res.ok) throw new Error('Nepodarilo sa zistiť URL pre nahratie.');

      const { uploadUrl, publicUrl } = await res.json();

      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error('Nepodarilo sa nahrať súbor na server.');

      setEditingMaterial({ ...editingMaterial, url: publicUrl });
      alert('Súbor nahraný!');
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Nastala chyba pri nahrávaní.');
    } finally {
      setIsUploading(false);
    }
  }

  async function saveMaterial(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMaterial) return;
    
    if (!editingMaterial.url) {
      alert('Najprv musíte nahrať súbor (URL chýba!)');
      return;
    }

    const { error } = await supabase.from('affiliate_materials').insert([editingMaterial]);
    if (!error) {
      setIsFormOpen(false);
      fetchMaterials();
    } else {
      alert(error.message);
    }
  }

  if (loading && materials.length === 0) return <div className="p-10 text-slate-400">Načítavam affiliate materiály...</div>;

  return (
    <div className="py-6 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif text-white mb-2">Promo Materiály</h2>
          <p className="text-slate-400">Správa banerov a videí pre affiliate partnerov</p>
        </div>
        <button
          onClick={handleNew}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" /> Pridať Materiál
        </button>
      </div>

      {isFormOpen && editingMaterial && (
        <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 mb-10 relative">
          <h2 className="text-xl text-white font-bold mb-6">Pridať nový materiál</h2>
          <form onSubmit={saveMaterial} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Názov (Title)</label>
                <input type="text" value={editingMaterial.title} onChange={e => setEditingMaterial({...editingMaterial, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" required placeholder="Napr. Letná kampaň baner" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Jazyk</label>
                  <select value={editingMaterial.language} onChange={e => setEditingMaterial({...editingMaterial, language: e.target.value as 'EN'|'SK'})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" required>
                    <option value="SK">Slovak (SK)</option>
                    <option value="EN">English (EN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Typ záznamu</label>
                  <select value={editingMaterial.type} onChange={e => setEditingMaterial({...editingMaterial, type: e.target.value as 'Banner'|'Video'})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" required>
                    <option value="Banner">Banner</option>
                    <option value="Video">Video</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Rozlíšenie (voliteľné)</label>
                <input type="text" value={editingMaterial.resolution || ''} onChange={e => setEditingMaterial({...editingMaterial, resolution: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-amber-500" placeholder="Napr. 1080x1080 or 16:9" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Súbor na nahratie</label>
                <div className={`border-2 border-dashed rounded-lg p-4 text-center ${editingMaterial.url ? 'border-green-500/50 bg-green-500/10' : 'border-slate-700 bg-slate-950'}`}>
                  {editingMaterial.url ? (
                    <div className="text-green-400 flex items-center justify-center">
                      <ImageIcon className="mr-2" size={20} />
                      Súbor pridaný
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-white transition-colors">
                      <UploadCloud size={32} className="mb-2" />
                      {isUploading ? <span>Nahrávam...</span> : <span>Kliknite pre nahratie {editingMaterial.type}</span>}
                      <input type="file" className="hidden" accept={editingMaterial.type === 'Banner' ? 'image/*' : 'video/*'} onChange={handleFileUpload} disabled={isUploading} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">
                Zrušiť
              </button>
              <button type="submit" disabled={isUploading || !editingMaterial.url} className="bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold transition-colors">
                Uložiť materiál
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Materials List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map((m) => (
          <div key={m.id} className="bg-slate-900 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col">
            <div className="h-48 bg-slate-950 relative flex items-center justify-center border-b border-white/10">
              {m.type === 'Banner' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.url} alt={m.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-500 flex flex-col items-center">
                  <Video size={48} className="mb-2 text-amber-500/50" />
                  <span className="text-xs font-mono">{m.url.split('/').pop()}</span>
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="bg-slate-900/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md text-slate-300 uppercase border border-white/10">
                  {m.language}
                </span>
                <span className={`bg-slate-900/80 backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-md border border-white/10 ${m.type === 'Banner' ? 'text-blue-400' : 'text-purple-400'}`}>
                  {m.type}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-1 line-clamp-1" title={m.title}>{m.title}</h3>
              {m.resolution && <p className="text-sm text-slate-400 mb-4">{m.resolution}</p>}
              
              <div className="mt-auto pt-4 flex justify-between items-center border-t border-white/10">
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-amber-500 text-sm hover:underline font-medium">
                  Zobraziť súbor
                </a>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-slate-500 hover:text-red-500 transition-colors p-2"
                  title="Vymazať"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {materials.length === 0 && !isFormOpen && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900/50 border border-dashed border-slate-700 rounded-2xl">
            <Megaphone size={48} className="mx-auto mb-4 opacity-50" />
            <p>Zatiaľ nemáte žiadne promo materiály pre partnerov.</p>
          </div>
        )}
      </div>
    </div>
  );
}