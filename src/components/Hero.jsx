import React from 'react';
import { Sparkles, ArrowRight, Image as ImageIcon, Cpu, CheckCircle2, ArrowDown, Check } from 'lucide-react';
import { FixLensLogo } from './FixLensLogo';

export function Hero({ onAnalyzeClick, onTryDemoClick }) {
  return (
    <section className="hero-section" style={{
      padding: '4rem 0 3.5rem 0',
      textAlign: 'center',
      position: 'relative'
    }}>
      <div className="container">
        {/* Top Badge */}
        <div style={{ display: 'inline-flex', marginBottom: '1.25rem' }}>
          <div className="badge badge-orange" style={{
            padding: '0.45rem 1.15rem',
            fontSize: '0.8rem',
            boxShadow: '0 0 24px rgba(249, 115, 22, 0.25)',
            border: '1px solid rgba(249, 115, 22, 0.4)'
          }}>
            <Sparkles size={14} /> GEMMA 4 • MULTIMODAL DEBUGGING
          </div>
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5.5vw, 4.2rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          maxWidth: '920px',
          margin: '0 auto 1.25rem auto',
          letterSpacing: '-0.03em'
        }}>
          See the Problem.<br />
          Understand It.<br />
          <span className="orange-gradient">Fix It.</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem auto',
          lineHeight: 1.6
        }}>
          Upload a screenshot and let Gemma 4 turn visual information into an actionable solution.
        </p>

        {/* Call to Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem'
        }}>
          <button onClick={onAnalyzeClick} className="btn btn-primary btn-lg">
            Analyze a Screenshot <ArrowRight size={18} />
          </button>
          <button onClick={onTryDemoClick} className="btn btn-secondary btn-lg">
            Try Live Demo
          </button>
        </div>

        {/* Visual Representation: YOUR SCREENSHOT ➔ GEMMA 4 ➔ UNDERSTANDS ➔ ACTIONABLE FIX */}
        <div style={{
          maxWidth: '880px',
          margin: '0 auto',
          padding: '1.5rem',
          background: 'rgba(18, 18, 22, 0.75)',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          borderRadius: 'var(--radius-xl)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.7), var(--shadow-orange-glow)'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            alignItems: 'center',
            gap: '1rem'
          }}>
            {/* Step 1 */}
            <div style={{
              background: '#0e0e12',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <ImageIcon size={15} color="#fb923c" />
                <span style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 700, textTransform: 'uppercase' }}>01. SCREENSHOT</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f4f4f5' }}>
                Visual Error or Code
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                IDE, terminal, crash log
              </div>
            </div>

            {/* Step 2 */}
            <div style={{
              background: '#0e0e12',
              border: '1.5px solid rgba(249, 115, 22, 0.45)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'left',
              boxShadow: '0 0 20px rgba(249, 115, 22, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <FixLensLogo size={16} glow={false} />
                <span style={{ fontSize: '0.75rem', color: '#fed7aa', fontWeight: 700, textTransform: 'uppercase' }}>02. GEMMA 4</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fed7aa' }}>
                Multimodal Vision
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Understands pixel context
              </div>
            </div>

            {/* Step 3 */}
            <div style={{
              background: '#0e0e12',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <Cpu size={15} color="#60a5fa" />
                <span style={{ fontSize: '0.75rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase' }}>03. DIAGNOSIS</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f4f4f5' }}>
                Language & Root Cause
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Pinpoints exact failure line
              </div>
            </div>

            {/* Step 4 */}
            <div style={{
              background: '#0e0e12',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <CheckCircle2 size={15} color="#34d399" />
                <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>04. ACTION</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f4f4f5' }}>
                Exact Fix & Next Step
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Same-language code repair
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
