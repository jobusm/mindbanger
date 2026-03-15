'use client';

import React, { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900/50 border border-red-500/20 p-8 rounded-3xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-serif text-white mb-2">Something went wrong!</h2>
        <p className="text-slate-400 mb-8 text-sm">
          We've encountered an unexpected error. Don't worry, it's not your fault.
        </p>
        <button
          onClick={() => reset()}
          className="w-full py-3 rounded-full bg-slate-800 text-white font-medium hover:bg-slate-700 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}