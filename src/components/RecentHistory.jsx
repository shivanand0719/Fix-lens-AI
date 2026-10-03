import React from 'react';
import { History, ArrowRight, Trash2, Clock, CheckCircle2 } from 'lucide-react';

export function RecentHistory({ history, onSelectHistoryItem, onClearHistory }) {
  if (!history || history.length === 0) return null;

  return (
    <section className="history-section" style={{ padding: '1rem 0 3rem 0' }}>
      <div className="container">
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          background: 'rgba(18, 18, 22, 0.65)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem 1.75rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} color="#fb923c" />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Diagnoses</span>
              <span className="badge badge-orange" style={{ fontSize: '0.68rem' }}>
                Local Browser Storage
              </span>
            </div>

            <button
              onClick={onClearHistory}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}
              title="Clear recent history"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem'
          }}>
            {history.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                onClick={() => onSelectHistoryItem(item)}
                className="glass-card"
                style={{
                  padding: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.02)'
                }}
              >
                {/* Thumbnail Preview */}
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '8px',
                  background: '#09090b',
                  border: '1px solid rgba(249, 115, 22, 0.25)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.imagePayload?.dataUrl ? (
                    <img
                      src={item.imagePayload.dataUrl}
                      alt="Thumbnail"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Clock size={20} color="#71717a" />
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.analysis.error_detected || 'Error Analysis'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                    <span className="badge badge-amber" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      {item.analysis.language_or_tool || 'Code'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <ArrowRight size={16} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
