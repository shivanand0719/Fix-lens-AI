import React from 'react';
import { X, Play, Award, Check } from 'lucide-react';
import { FixLensLogo } from './FixLensLogo';

export function JudgeDemoModal({
  isOpen,
  onClose,
  onRunFastJudgeDemo
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '2.25rem', maxWidth: '640px' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <FixLensLogo size={36} glow={true} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Judge Demonstration Mode</h3>
                <span className="badge badge-orange" style={{ fontSize: '0.68rem' }}>
                  2-Minute Speedrun
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                MLH × DEV × React Hyderabad Hack Day • Best Use of Gemma 4
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-icon btn-sm">
            <X size={16} />
          </button>
        </div>

        {/* Story Summary for Hackathon Judges */}
        <div style={{
          background: 'rgba(249, 115, 22, 0.08)',
          border: '1px solid rgba(249, 115, 22, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
            User Story & Gemma 4 Multimodal Moment
          </div>
          <p style={{ fontSize: '0.92rem', color: '#f1f5f9', lineHeight: 1.6 }}>
            Instead of manually transcribing an error from VS Code or a crash log, developers capture a screenshot. <strong>Gemma 4</strong> reads the visual code context, pinpoints the root cause, and generates an exact, copyable fix with step-by-step guidance.
          </p>
        </div>

        {/* 4 Quick Walkthrough Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.2)', border: '1px solid #f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fed7aa', fontWeight: 600 }}>1</span>
            <span>Loads high-resolution sample Python <code>NameError</code> screenshot</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.2)', border: '1px solid #f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fed7aa', fontWeight: 600 }}>2</span>
            <span>Triggers Gemma 4 Multimodal Vision scan</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.2)', border: '1px solid #f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fed7aa', fontWeight: 600 }}>3</span>
            <span>Renders the 6 structured diagnosis cards with visual verification</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.2)', border: '1px solid #f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: '#fed7aa', fontWeight: 600 }}>4</span>
            <span>One-click copy of verified fix code</span>
          </div>
        </div>

        {/* 1-Click Action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onRunFastJudgeDemo();
            }}
            className="btn btn-primary btn-lg"
            style={{
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              boxShadow: '0 8px 24px rgba(249, 115, 22, 0.45)'
            }}
          >
            <Play size={18} fill="#fff" /> Start 2-Minute Judge Demo
          </button>
        </div>
      </div>
    </div>
  );
}
