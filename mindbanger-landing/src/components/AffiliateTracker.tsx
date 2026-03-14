'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Ak URL obsahuje parameter ?ref=... uložime ho
    const ref = searchParams?.get('ref');
    
    if (ref) {
      // Ukladáme referrer do localStorage (platnosť si definuje systém neskôr, tu to necháme perzistentné)
      localStorage.setItem('mindbanger_ref', ref);
      console.log('Affiliate referer saved:', ref);
    }
  }, [searchParams]);

  return null; // Komponenta nič nevizualizuje
}
