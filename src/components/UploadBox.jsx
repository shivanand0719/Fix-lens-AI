import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, X, RefreshCw, Clipboard, Check, Terminal, FileCode, AlertTriangle, EyeOff, CheckCircle2 } from 'lucide-react';
import { validateImageFile, fileToBase64, formatFileSize } from '../utils/validation';
import { DEMO_PRESETS, UNCLEAR_IMAGE_DEMO } from '../utils/demoData';
import { FixLensLogo } from './FixLensLogo';

export function UploadBox({
  imagePayload,
  onImageChanged,
  onClearImage,
  onAnalyze,
  isLoading,
  onSelectPreset,
  activePresetId,
  isNewImagePendingAnalysis
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [copiedPasteSuccess, setCopiedPasteSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Global clipboard paste listener
  useEffect(() => {
    const handlePaste = async (e) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFileSelected(file, 'clipboard-screenshot.png');
            setCopiedPasteSuccess(true);
            setTimeout(() => setCopiedPasteSuccess(false), 2500);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoading]);

  const handleFileSelected = async (file, customName) => {
    setValidationError('');
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setValidationError(validation.error);
      return;
    }

    try {
      const payload = await fileToBase64(file);
      if (customName) payload.filename = customName;
      // Triggers immediate clear of previous analysis + sets new image
      onImageChanged(payload);
    } catch (err) {
      setValidationError('Failed to read image file. Please try another image.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handlePasteFromClipboardClick = async () => {
    try {
      if (!navigator.clipboard?.read) {
        setValidationError('Direct clipboard reading is restricted in this browser. Please use Ctrl+V / Cmd+V to paste.');
        return;
      }
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'clipboard-paste.png', { type: imageType });
          handleFileSelected(file, 'clipboard-paste.png');
          setCopiedPasteSuccess(true);
          setTimeout(() => setCopiedPasteSuccess(false), 2500);
          return;
        }
      }
      setValidationError('No image found in clipboard. Copy a screenshot first (Win+Shift+S or Cmd+Shift+4) then paste.');
    } catch (err) {
      setValidationError('Clipboard permission needed or empty. You can press Ctrl+V / Cmd+V directly.');
    }
  };

  return (
    <section id="analyzer-card" className="analyzer-section" style={{ padding: '1rem 0 3rem 0' }}>
      <div className="container">
        <div className="glass-card" style={{
          padding: '2.5rem',
          maxWidth: '960px',
          margin: '0 auto',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(249, 115, 22, 0.12)'
        }}>
          {/* Card Title & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Drop an error screenshot
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto' }}>
              Let Gemma 4 see what you're seeing.
            </p>
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#fca5a5',
              fontSize: '0.9rem'
            }}>
              <AlertTriangle size={18} />
              <span>{validationError}</span>
            </div>
          )}

          {/* NEW IMAGE CHANGE BANNER */}
          {isNewImagePendingAnalysis && imagePayload && (
            <div style={{
              background: 'rgba(249, 115, 22, 0.12)',
              border: '1px solid rgba(249, 115, 22, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              color: '#fed7aa',
              fontSize: '0.9rem',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              <CheckCircle2 size={18} color="#f97316" />
              <div>
                <strong>New screenshot detected.</strong> Your previous analysis has been cleared. Click below to analyze this screenshot with Gemma 4.
              </div>
            </div>
          )}

          {/* UPLOAD & PREVIEW AREA */}
          {!imagePayload ? (
            /* Empty State / Drag & Drop Area */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              style={{
                border: isDragOver
                  ? '2px dashed #f97316'
                  : '2px dashed rgba(255, 255, 255, 0.16)',
                borderRadius: 'var(--radius-lg)',
                padding: '3.5rem 1.5rem',
                textAlign: 'center',
                background: isDragOver
                  ? 'rgba(249, 115, 22, 0.08)'
                  : 'rgba(15, 15, 18, 0.5)',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                transform: isDragOver ? 'scale(1.01)' : 'scale(1)'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelected(e.target.files[0]);
                  }
                }}
              />

              <div style={{
                margin: '0 auto 1.25rem auto',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <FixLensLogo size={58} glow={isDragOver} />
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.35rem', color: '#fff' }}>
                Drop your screenshot here
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                or <span style={{ color: '#fb923c', textDecoration: 'underline' }}>Browse files</span> from your computer
              </p>

              {/* Paste helper button */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={handlePasteFromClipboardClick}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  {copiedPasteSuccess ? <Check size={15} color="#34d399" /> : <Clipboard size={15} />}
                  {copiedPasteSuccess ? 'Screenshot Pasted!' : 'Paste Screenshot (Ctrl+V)'}
                </button>
              </div>

              <div style={{ marginTop: '1.5rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Supported: PNG, JPG, JPEG, WEBP • Max: 10 MB
              </div>
            </div>
          ) : (
            /* Uploaded Image Preview Card */
            <div style={{
              background: 'rgba(14, 14, 18, 0.9)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="#34d399" />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: '#f4f4f5' }}>
                    Screenshot ready: {imagePayload.filename || 'uploaded-screenshot.png'}
                  </span>
                  <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                    {formatFileSize(imagePayload.size)}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary btn-sm"
                    title="Choose a different image"
                  >
                    <RefreshCw size={14} /> Change
                  </button>
                  <button
                    onClick={onClearImage}
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#fb7185' }}
                    title="Remove image"
                  >
                    <X size={14} /> Remove
                  </button>
                </div>
              </div>

              {/* Image Frame */}
              <div style={{
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                background: '#070709',
                border: '1px solid var(--border-subtle)',
                maxHeight: '420px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem',
                position: 'relative'
              }}>
                <img
                  src={imagePayload.dataUrl}
                  alt="Error Screenshot Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '420px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>

              {/* Analyze CTA */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={onAnalyze}
                  disabled={isLoading}
                  className="btn btn-primary btn-lg"
                  style={{
                    minWidth: '280px',
                    padding: '0.95rem 2.25rem',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 30px rgba(249, 115, 22, 0.5)'
                  }}
                >
                  <Sparkles size={20} className="animate-spin-slow" />
                  Analyze with Gemma 4
                </button>
              </div>
            </div>
          )}

          {/* HIDDEN INPUT FOR REPLACING */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelected(e.target.files[0]);
              }
            }}
          />

          {/* DEMO INPUT PRESETS SECTION */}
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.25rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} color="#fb923c" />
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                    Or Try an Instant Demo Example
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Click to test FixLens with sample error screenshots
                </div>
              </div>

              <span className="badge badge-orange" style={{ fontSize: '0.72rem' }}>
                Demo Presets
              </span>
            </div>

            {/* Presets Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '0.85rem'
            }}>
              {DEMO_PRESETS.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    className="glass-card"
                    style={{
                      padding: '1rem',
                      textAlign: 'left',
                      background: isSelected
                        ? 'rgba(249, 115, 22, 0.15)'
                        : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected
                        ? '1px solid #f97316'
                        : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>
                        {preset.language}
                      </span>
                      {isSelected && <Check size={14} color="#f97316" />}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f8fafc' }}>
                      {preset.title}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {preset.subtitle}
                    </div>
                  </button>
                );
              })}

              {/* Unclear screenshot demo */}
              <button
                onClick={() => onSelectPreset(UNCLEAR_IMAGE_DEMO)}
                className="glass-card"
                style={{
                  padding: '1rem',
                  textAlign: 'left',
                  background: activePresetId === UNCLEAR_IMAGE_DEMO.id
                    ? 'rgba(244, 63, 94, 0.18)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: activePresetId === UNCLEAR_IMAGE_DEMO.id
                    ? '1px solid #fb7185'
                    : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-rose" style={{ fontSize: '0.68rem' }}>
                    Edge Case
                  </span>
                  <EyeOff size={14} color="#fb7185" />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f8fafc' }}>
                  Unclear Screenshot
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Tests AI uncertainty handling
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
