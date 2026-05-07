import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SpendLens — Free AI Spend Audit for Startups',
  description:
    'Find out if your startup is overpaying for AI tools. Get an instant audit of your Cursor, Claude, ChatGPT, and GitHub Copilot spend — with specific recommendations and real savings numbers.',
  keywords: ['AI spend', 'AI tools audit', 'cursor pricing', 'claude pricing', 'chatgpt cost', 'startup tools'],
  openGraph: {
    title: 'SpendLens — Free AI Spend Audit',
    description: 'Is your startup overpaying for AI tools? Find out in 2 minutes. Free.',
    url: 'https://spendlens.credex.rocks',
    siteName: 'SpendLens',
    images: [
      {
        url: '/api/og?savings=0',
        width: 1200,
        height: 630,
        alt: 'SpendLens AI Spend Audit',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SpendLens — Free AI Spend Audit',
    description: 'Is your startup overpaying for AI tools? Find out in 2 minutes. Free.',
    images: ['/api/og?savings=0'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
