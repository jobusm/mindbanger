import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mindbanger Daily | Daily mental clarity & focus',
  description: 'Daily mind signals for clarity, calm & focus. Created by a Life Coach & Hypnotherapist. The way your mind is set begins to shape your reality.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth antialiased`}>
      <body className="bg-slate-950 text-slate-100 font-sans">
        {children}
      </body>
    </html>
  );
}
