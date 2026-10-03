import React, { useEffect, useState } from 'react';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import { FixLensLogo } from './FixLensLogo';

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Reading screenshot', detail: 'Encoding image stream for Gemma 4 multimodal vision' },
    { label: 'Detecting visible error', detail: 'Scanning visual code lines, terminal traceback, and editor context' },
    { label: 'Understanding context', detail: 'Isolating root cause and language specifics' },
    { label: 'Preparing solution', detail: 'Generating actionable fix, step-by-step resolution, and prevention' }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 400);
    const timer2 = setTimeout(() => setCurrentStep(2), 900);
    const timer3 = setTimeout(() => setCurrentStep(3), 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <section className="loading-section" style={{ padding: '2rem 0 4rem 0' }}>
      <div className="container">
        <div className="glass-card glass-card-glow" style={{
          maxWidth: '740px',
          margin: '0 auto',
          padding: '3rem 2rem',
          textAlign: 'center',
          border: '1px solid rgba(249, 115, 22, 0.45)'
        }}>
          {/* Radar Scanning Vision Animation */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            margin: '0 auto 2rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Outer pulsating orange ring */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px solid rgba(249, 115, 22, 0.4)',
              animation: 'pulse-glow 2s infinite'
            }} />

            {/* Middle amber ring */}
            <div style={{
              position: 'absolute',
              inset: '10px',
              borderRadius: '50%',
              border: '2px dashed rgba(245, 158, 11, 0.6)',
              animation: 'spin-slow 6s linear infinite'
            }} />

            {/* Central Logo */}
            <div style={{
              zIndex: 2,
              animation: 'pulse-glow 2.5s infinite'
            }}>
              <FixLensLogo size={52} glow={true} />
            </div>
          </div>

          {/* Heading */}
          <h3 style={{
            fontSize: '1.65rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em',
            color: '#fff'
          }}>
            <span className="gemma-text">Gemma 4</span> is looking at your screenshot...
          </h3>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
            Multimodal visual understanding in progress via Gemini API
          </p>

          {/* Step-by-Step Progress Pipeline */}
          <div style={{
            maxWidth: '460px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            textAlign: 'left'
          }}>
            {steps.map((step, idx) => {
              const isDone = currentStep > idx;
              const isCurrent = currentStep === idx;

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: isCurrent
                      ? 'rgba(249, 115, 22, 0.12)'
                      : isDone
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: isCurrent
                      ? '1px solid rgba(249, 115, 22, 0.4)'
                      : isDone
                      ? '1px solid rgba(16, 185, 129, 0.25)'
                      : '1px solid transparent',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    background: isDone
                      ? '#10b981'
                      : isCurrent
                      ? '#f97316'
                      : 'rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                  }}>
                    {isDone ? (
                      <Check size={14} strokeWidth={3} />
                    ) : isCurrent ? (
                      <Loader2 size={14} className="animate-spin-slow" />
                    ) : (
                      <span style={{ fontSize: '0.7rem' }}>{idx + 1}</span>
                    )}
                  </div>

                  <div>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '0.92rem',
                      color: isDone ? '#34d399' : isCurrent ? '#fed7aa' : 'var(--text-muted)'
                    }}>
                      {step.label}
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      color: isCurrent ? 'var(--text-secondary)' : 'var(--text-muted)'
                    }}>
                      {step.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
