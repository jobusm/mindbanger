import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-white/5">
        <span className="text-3xl">🌌</span>
      </div>
      <h1 className="text-4xl font-serif text-white mb-4">404 - Lost in Space</h1>
      <p className="text-slate-400 max-w-sm mb-8">
        We couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link 
        href="/" 
        className="px-8 py-3 rounded-full bg-slate-800 text-white font-medium hover:bg-slate-700 transition border border-slate-700"
      >
        Back to Earth
      </Link>
    </div>
  );
}