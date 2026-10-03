import React from 'react';
import { Sparkles, Settings, Play, Zap } from 'lucide-react';
import { FixLensLogo } from './FixLensLogo';

export function Header({
  isDemoMode,
  setIsDemoMode,
  onOpenSettings,
  onOpenJudgeDemo,
  hasApiKey
}) {
  return (
    <header className="header" style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(9, 9, 11, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0.75rem 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FixLensLogo size={36} glow={true} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: '800',
                fontSize: '1.3rem',
                letterSpacing: '-0.02em',
                color: '#fff'
              }}>
                FixLens <span className="orange-gradient">AI</span>
              </span>
              <span className="badge badge-orange" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                <Sparkles size={11} /> Gemma 4
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1 }}>
              See error. Understand cause. Fix it.
            </div>
          </div>
        </div>

        {/* Navigation & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a
            href="#how-it-works"
            className="btn btn-secondary btn-sm"
            style={{ border: 'none', background: 'transparent' }}
          >
            How It Works
          </a>

          <a
            href="#why-gemma"
            className="btn btn-secondary btn-sm"
            style={{ border: 'none', background: 'transparent' }}
          >
            Why Gemma 4
          </a>

          {/* Judge Demo Quick Action */}
          <button
            onClick={onOpenJudgeDemo}
            className="btn btn-sm"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.18) 0%, rgba(245, 158, 11, 0.18) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.45)',
              color: '#fed7aa'
            }}
            title="Fast 2-minute Hackathon Judge Demonstration"
          >
            <Play size={13} fill="#fb923c" /> Judge Demo
          </button>

          {/* Demo Mode Toggle */}
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={`btn btn-sm ${isDemoMode ? 'btn-accent' : 'btn-secondary'}`}
            title="Toggle offline instant simulation vs live Gemini API"
            style={{ fontSize: '0.78rem' }}
          >
            <Zap size={13} />
            {isDemoMode ? 'Demo Mode: ON' : 'Live AI Mode'}
          </button>

          {/* API Settings */}
          <button
            onClick={onOpenSettings}
            className="btn btn-icon btn-sm"
            title="Configure Gemini API Key & Gemma Model"
            style={{ position: 'relative' }}
          >
            <Settings size={16} />
            {!hasApiKey && !isDemoMode && (
              <span style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#f97316',
                boxShadow: '0 0 8px #f97316'
              }} />
            )}
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-icon btn-sm"
            title="GitHub Repository"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
              <path d="M9 18c-4.51 2-5-2-7-2"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
