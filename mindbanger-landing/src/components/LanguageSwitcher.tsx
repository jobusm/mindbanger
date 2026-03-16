'use client';
import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const cookies = document.cookie.split('; ');
    const langCookie = cookies.find(c => c.startsWith('user-lang='));
    if (langCookie) {
      setLang(langCookie.split('=')[1]);
    } else {
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'sk' || browserLang === 'cs') {
        setLang(browserLang);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLang(newLang);
    document.cookie = `user-lang=${newLang}; path=/; max-age=31536000`;
    router.refresh();
    setTimeout(() => window.location.reload(), 100);
  };

  return (
    <div className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
      <Globe size={16} />
      <select 
        value={lang} 
        onChange={handleChange} 
        className="bg-transparent text-sm focus:outline-none cursor-pointer appearance-none uppercase font-medium"
      >
        <option value="sk" className="text-slate-900 font-sans">SK</option>
        <option value="cs" className="text-slate-900 font-sans">CZ</option>
        <option value="en" className="text-slate-900 font-sans">EN</option>
      </select>
    </div>
  );
}
