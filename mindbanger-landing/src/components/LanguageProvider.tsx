'use client';
import React, { createContext, useContext } from 'react';

const LanguageContext = createContext<any>(null);

export function LanguageProvider({ children, dict }: { children: React.ReactNode, dict: any }) {
  return (
    <LanguageContext.Provider value={{ dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(LanguageContext);
  if (!context) {
    return { dict: null };
  }
  return context;
}
