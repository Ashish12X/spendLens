import { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  let savings = 0;
  let annual = 0;
  let tools = 0;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendlens.credex.rocks';
    const res = await fetch(`${baseUrl}/api/audit?id=${id}`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      savings = Math.round(data.totalMonthlySavings ?? 0);
      annual = Math.round(data.totalAnnualSavings ?? 0);
      tools = data.results?.length ?? 0;
    }
  } catch {
    // Fallback metadata
  }

  const title =
    savings > 0
      ? `AI Spend Audit: $${savings.toLocaleString()}/mo savings found`
      : 'AI Spend Audit — SpendLens';

  const description =
    savings > 0
      ? `SpendLens found $${savings.toLocaleString()}/month ($${annual.toLocaleString()}/year) in AI tool overspend across ${tools} tools. Get your free audit.`
      : 'Free AI spend audit for startups. Find out if you\'re overpaying for Cursor, Claude, ChatGPT, and more.';

  const ogImageUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendlens.credex.rocks'}/api/og?savings=${savings}&annual=${annual}&tools=${tools}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function AuditResultLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
