import React from 'react';
import { Sparkles, Eye, Zap, Layers } from 'lucide-react';

export function WhyGemma() {
  const highlights = [
    {
      icon: <Eye size={20} color="#fb923c" />,
      title: 'Multimodal Vision',
      desc: 'Directly ingests pixel representations of messy terminal logs, syntax highlights, and IDE panels without brittle OCR.'
    },
    {
      icon: <Zap size={20} color="#f59e0b" />,
      title: 'Fast Developer Diagnosis',
      desc: 'Pinpoints the exact error token and maps it to root cause explanation in seconds via the Gemini API.'
    },
    {
      icon: <Layers size={20} color="#34d399" />,
      title: 'Structured Output',
      desc: 'Synthesizes clean JSON schemas delivering separate cards for explanation, fix, step-by-step resolution, and prevention.'
    }
  ];

  return (
    <section id="why-gemma" style={{ padding: '4.5rem 0', background: 'rgba(15, 15, 18, 0.4)' }}>
      <div className="container">
        <div className="glass-card" style={{
          padding: '3rem 2.5rem',
          maxWidth: '960px',
          margin: '0 auto',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          background: 'radial-gradient(ellipse at top left, rgba(249, 115, 22, 0.12) 0%, rgba(15, 15, 18, 0.85) 70%)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
              <Sparkles size={13} /> Model Intelligence
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Why <span className="gemma-text">Gemma 4</span>?
            </h2>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '1.05rem',
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              FixLens uses Gemma 4's multimodal capabilities to understand information contained in screenshots and turn that visual information into an actionable debugging response.
            </p>
            <div style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '0.4rem 1.25rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              color: '#fed7aa',
              fontSize: '0.88rem',
              fontWeight: 600
            }}>
              ✨ Gemma 4 powers the understanding step.
            </div>
          </div>

          {/* 3 Pillars */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            {highlights.map((h, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  {h.icon}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: '#f8fafc' }}>
                  {h.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.55 }}>
                  {h.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
