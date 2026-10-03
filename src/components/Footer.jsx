import React from 'react';
import { Sparkles } from 'lucide-react';
import { FixLensLogo } from './FixLensLogo';

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(7, 7, 9, 0.95)',
      padding: '2.5rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FixLensLogo size={30} glow={false} />
            <div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                FixLens <span className="orange-gradient">AI</span>
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block' }}>
                See the error. Understand the cause. Fix it.
              </span>
            </div>
          </div>

          {/* Hackathon Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="badge badge-orange">
              <Sparkles size={12} /> MLH × DEV × React Hyderabad Hack Day
            </span>
            <span className="badge badge-amber">
              Challenge: Best Use of Gemma 4
            </span>
          </div>
        </div>

        {/* Bottom Credits & Disclaimer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            Built with React, Vite, and Gemma 4 Multimodal Vision via Google Gemini API.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Privacy Notice: Screenshots are analyzed in memory and never persisted on external servers.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
