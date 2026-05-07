import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const savings = parseInt(searchParams.get('savings') ?? '0');
  const annual = parseInt(searchParams.get('annual') ?? '0');
  const tools = parseInt(searchParams.get('tools') ?? '1');


  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 50%, #0f0f1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo */}
        <div
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#6366f1',
            marginBottom: '24px',
            letterSpacing: '-0.5px',
          }}
        >
          SpendLens ✦
        </div>

        {/* Main savings number */}
        {savings > 0 ? (
          <div
            style={{
              fontSize: '88px',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)',
              backgroundClip: 'text',
              color: 'transparent',
              lineHeight: 1,
              marginBottom: '16px',
            }}
          >
            ${savings.toLocaleString()}
          </div>
        ) : (
          <div
            style={{
              fontSize: '56px',
              fontWeight: 900,
              color: '#10b981',
              lineHeight: 1,
              marginBottom: '16px',
            }}
          >
            Optimally Spent ✓
          </div>
        )}

        <div style={{ fontSize: '28px', color: '#94a3b8', marginBottom: '40px' }}>
          {savings > 0 ? `per month in AI overspend • $${annual.toLocaleString()}/year` : 'Your AI stack is well-configured'}
        </div>

        {savings > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                background: 'rgba(99,102,241,0.2)',
                border: '1px solid rgba(99,102,241,0.4)',
                borderRadius: '12px',
                padding: '12px 24px',
                color: '#c7d2fe',
                fontSize: '18px',
              }}
            >
              {tools} tools audited
            </div>
            <div
              style={{
                background: 'rgba(16,185,129,0.2)',
                border: '1px solid rgba(16,185,129,0.4)',
                borderRadius: '12px',
                padding: '12px 24px',
                color: '#6ee7b7',
                fontSize: '18px',
              }}
            >
              Free audit
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            fontSize: '20px',
            color: '#475569',
          }}
        >
          spendlens.credex.rocks — Free AI Spend Audit
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
