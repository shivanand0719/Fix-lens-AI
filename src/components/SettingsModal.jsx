import React, { useState, useEffect } from 'react';
import { X, Key, Shield, Check, Info, Cpu } from 'lucide-react';

export function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  model,
  setModel
}) {
  const [tempApiKey, setTempApiKey] = useState(apiKey || '');
  const [tempModel, setTempModel] = useState(model || 'gemma-4');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setTempApiKey(apiKey || '');
    setTempModel(model || 'gemma-4');
  }, [apiKey, model, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(tempApiKey.trim());
    setModel(tempModel.trim());
    localStorage.setItem('fixlens_gemini_api_key', tempApiKey.trim());
    localStorage.setItem('fixlens_gemini_model', tempModel.trim());

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setTempApiKey('');
    setApiKey('');
    localStorage.removeItem('fixlens_gemini_api_key');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
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
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fb923c'
            }}>
              <Key size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>API & Model Settings</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Configure Gemini API & Gemma 4 Endpoint</p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-icon btn-sm">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* API Key Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', color: '#f8fafc' }}>
              Google Gemini API Key
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(9, 9, 11, 0.9)',
                border: '1px solid var(--border-medium)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifySelf: 'space-between', justifyContent: 'space-between', marginTop: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Stored locally in your browser session. Never committed.
              </span>
              {tempApiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{ background: 'none', border: 'none', color: '#fb7185', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  Clear key
                </button>
              )}
            </div>
          </div>

          {/* Model Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', color: '#f8fafc' }}>
              Model Identifier (VITE_GEMINI_MODEL)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {['gemma-4', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.5-flash'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setTempModel(m)}
                  className="btn btn-sm"
                  style={{
                    background: tempModel === m ? 'rgba(249, 115, 22, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: tempModel === m ? '1px solid #f97316' : '1px solid var(--border-subtle)',
                    color: tempModel === m ? '#fed7aa' : 'var(--text-secondary)',
                    fontSize: '0.78rem'
                  }}
                >
                  {m === 'gemma-4' ? '✨ gemma-4 (Default)' : m}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tempModel}
              onChange={(e) => setTempModel(e.target.value)}
              placeholder="e.g. gemma-4"
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(9, 9, 11, 0.9)',
                border: '1px solid var(--border-medium)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Notice Box */}
          <div style={{
            background: 'rgba(249, 115, 22, 0.08)',
            border: '1px solid rgba(249, 115, 22, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem 1rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
            fontSize: '0.82rem',
            color: '#fed7aa',
            lineHeight: 1.5
          }}>
            <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#f97316' }} />
            <div>
              You can also specify keys via environment variables in <code>.env</code> with <code>VITE_GEMINI_API_KEY</code> and <code>VITE_GEMINI_MODEL</code>.
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ minWidth: '110px' }}>
              {savedSuccess ? <Check size={14} /> : null}
              {savedSuccess ? 'Saved!' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
