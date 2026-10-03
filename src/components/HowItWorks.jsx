import React from 'react';
import { UploadCloud, Cpu, Play } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Show It',
      desc: 'Upload a screenshot of your code editor, terminal crash, compiler error, or visual situation.',
      icon: <UploadCloud size={24} color="#fb923c" />,
      tag: 'Multimodal Input'
    },
    {
      num: '02',
      title: 'Gemma Understands',
      desc: 'Gemma 4 analyzes the visual information, detects the programming language, and isolates the root cause.',
      icon: <Cpu size={24} color="#f97316" />,
      tag: 'Gemma 4 Multimodal Vision'
    },
    {
      num: '03',
      title: 'Act On It',
      desc: 'FixLens delivers an exact, language-preserving code fix, step-by-step resolution, and actionable next steps.',
      icon: <Play size={24} color="#34d399" fill="#34d399" />,
      tag: 'Actionable Next Step'
    }
  ];

  return (
    <section id="how-it-works" style={{ padding: '4rem 0', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-orange" style={{ marginBottom: '0.75rem' }}>
            Challenge Interaction
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            How FixLens Works
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto' }}>
            Understand ➔ Transform ➔ Act with Gemma 4 in 3 simple steps
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1020px',
          margin: '0 auto'
        }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '2rem 1.75rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {step.icon}
                </div>

                <span style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '2rem',
                  color: 'rgba(249, 115, 22, 0.15)'
                }}>
                  {step.num}
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                {step.tag}
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f8fafc' }}>
                {step.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, flex: 1 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
