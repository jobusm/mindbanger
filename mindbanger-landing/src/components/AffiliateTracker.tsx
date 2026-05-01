'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Ak URL obsahuje parametre refMode a refCode uložíme ich
    const refMode = searchParams?.get('refMode');
    const refCode = searchParams?.get('refCode');
    
    // Fallback na starý systém
    const oldRef = searchParams?.get('ref');

    if (refMode && refCode) {
      // Ukladáme referrer do localStorage
      localStorage.setItem('mb_refMode', refMode);
      localStorage.setItem('mb_refCode', refCode);
      console.log('Affiliate referer saved:', { refMode, refCode });
    } else if (oldRef) {
      localStorage.setItem('mindbanger_ref', oldRef);
    }
  }, [searchParams]);

  return null; // Komponenta nič nevizualizuje
}
