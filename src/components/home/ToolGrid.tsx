import { TOOLS, CATEGORY_META, ToolCategory } from '@/lib/tools';
import { ToolCard } from './ToolCard';

const categories = Object.keys(CATEGORY_META) as ToolCategory[];

export function ToolGrid() {
  return (
    <section id="tools-grid" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div style={{ marginBottom: '56px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#22C55E',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            31+ Free Tools
          </p>
          <h2 className="text-headline" style={{ color: '#F8FAFC', marginBottom: '12px' }}>
            Everything you need for PDFs
          </h2>
          <p style={{ fontSize: '1rem', color: '#64748B', maxWidth: '520px', margin: '0 auto' }}>
            Professional-grade tools that run entirely in your browser. No uploads, no accounts, no limits.
          </p>
        </div>

        {/* Categories */}
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const tools = TOOLS.filter((t) => t.category === cat);

          return (
            <div key={cat} id={cat} style={{ marginBottom: '64px' }}>
              {/* Category header */}
              <div
                className="flex items-center gap-4 mb-6"
                style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: `${meta.color}18`,
                    border: `1px solid ${meta.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '0.875rem', fontWeight: 800, color: meta.color }}>
                    {meta.label.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                    {meta.label}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#64748B' }}>{meta.description}</p>
                </div>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    color: '#475569',
                    background: 'rgba(255,255,255,0.04)',
                    padding: '3px 10px',
                    borderRadius: '99px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {tools.length} tools
                </span>
              </div>

              {/* Tool cards grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '14px',
                }}
              >
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
