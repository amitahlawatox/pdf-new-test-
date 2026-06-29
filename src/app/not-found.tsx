import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '32px' }}>
      <div style={{ fontSize: '5rem', fontWeight: 800, color: 'rgba(255,255,255,0.06)' }}>404</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#F8FAFC', marginTop: '-20px' }}>Page not found</h1>
      <p style={{ color: '#64748B', maxWidth: '360px', lineHeight: 1.6 }}>The page you are looking for does not exist or has been moved.</p>
      <Link href="/" style={{ padding: '12px 28px', borderRadius: '14px', background: '#22C55E', color: '#0F172A', fontWeight: 700, textDecoration: 'none', fontSize: '0.9375rem' }}>
        Back to all PDF tools
      </Link>
    </div>
  );
}
