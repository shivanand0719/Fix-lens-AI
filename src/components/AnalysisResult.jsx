import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Wrench,
  ListOrdered,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  Image as ImageIcon,
  EyeOff,
  MapPin,
  Play,
  ArrowRight,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

// Language Icon and Color Mapper
function getLanguageBadge(language = '') {
  const langLower = language.toLowerCase();
  if (langLower.includes('python')) {
    return { icon: '🐍', label: 'PYTHON', bg: 'rgba(59, 130, 246, 0.18)', border: '#3b82f6', color: '#93c5fd' };
  }
  if (langLower.includes('javascript') || langLower.includes('js')) {
    return { icon: '🟨', label: 'JAVASCRIPT', bg: 'rgba(234, 179, 8, 0.18)', border: '#eab308', color: '#fef08a' };
  }
  if (langLower.includes('typescript') || langLower.includes('ts')) {
    return { icon: '🟦', label: 'TYPESCRIPT', bg: 'rgba(59, 130, 246, 0.22)', border: '#2563eb', color: '#bfdbfe' };
  }
  if (langLower.includes('java')) {
    return { icon: '☕', label: 'JAVA', bg: 'rgba(239, 68, 68, 0.18)', border: '#ef4444', color: '#fca5a5' };
  }
  if (langLower.includes('c++') || langLower.includes('cpp') || langLower.includes('c#') || langLower.includes('c')) {
    return { icon: '🔷', label: 'C / C++', bg: 'rgba(99, 102, 241, 0.18)', border: '#6366f1', color: '#c7d2fe' };
  }
  if (langLower.includes('rust')) {
    return { icon: '🦀', label: 'RUST', bg: 'rgba(249, 115, 22, 0.2)', border: '#f97316', color: '#fed7aa' };
  }
  if (langLower.includes('go')) {
    return { icon: '🐹', label: 'GO', bg: 'rgba(6, 182, 212, 0.18)', border: '#06b6d4', color: '#a5f3fc' };
  }
  return { icon: '💻', label: language.toUpperCase() || 'CODE', bg: 'rgba(249, 115, 22, 0.15)', border: '#f97316', color: '#fed7aa' };
}

export function AnalysisResult({
  analysis,
  imagePayload,
  onReset,
  onTryAnotherPreset
}) {
  const [copiedFix, setCopiedFix] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});

  if (!analysis) return null;

  const langBadge = getLanguageBadge(analysis.language);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f97316', '#fb923c', '#f59e0b', '#34d399']
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleCopyFix = () => {
    const textToCopy = analysis.corrected_code || analysis.exact_fix || '';
    navigator.clipboard.writeText(textToCopy);
    setCopiedFix(true);
    triggerConfetti();
    setTimeout(() => setCopiedFix(false), 2500);
  };

  const handleCopyFullReport = () => {
    const report = `# FixLens AI — ${langBadge.label} Diagnosis Report (Gemma 4)
## 01. Exact Error Detected: ${analysis.error_type || analysis.error_category || 'Error'}
- **Input Type:** ${analysis.input_type || 'Screenshot'}
- **Language:** ${analysis.language}
- **Message:** ${analysis.exact_error_message}
- **Line Number:** ${analysis.line_number ? `Line ${analysis.line_number}` : 'N/A'}

### 02. What Exactly Is Wrong?
${analysis.what_exactly_is_wrong}

### 03. Where Is the Problem?
${analysis.line_number ? `Location: Line ${analysis.line_number}` : ''}
\`\`\`${(analysis.language || 'code').toLowerCase()}
${analysis.problematic_code || ''}
\`\`\`
Cause: ${analysis.exact_cause}

### 04. Exact Fix (Before ➔ After in ${analysis.language})
**Before:**
\`\`\`${(analysis.language || 'code').toLowerCase()}
${analysis.problematic_code || ''}
\`\`\`

**After:**
\`\`\`${(analysis.language || 'code').toLowerCase()}
${analysis.corrected_code || ''}
\`\`\`

Action: ${analysis.exact_fix}

### 05. Why This Fix Works
${analysis.why_the_fix_works}

### 06. Fix It Step by Step
${(analysis.step_by_step || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}

### 07. What Should You Do Next?
${analysis.next_action}

### 08. Prevent It Next Time
${analysis.prevention_tip}

Confidence: ${analysis.confidence} | Gemma 4 Multimodal Visual Analysis`;

    navigator.clipboard.writeText(report);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixlens-${(analysis.language || 'diagnosis').toLowerCase()}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleStep = (idx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // IF SCREENSHOT IS UNCLEAR OR INSUFFICIENT DATA DETECTED
  if (analysis.needs_clearer_image) {
    return (
      <section id="results-view" className="results-section" style={{ padding: '1rem 0 4rem 0' }}>
        <div className="container">
          <div className="glass-card" style={{
            maxWidth: '820px',
            margin: '0 auto',
            padding: '2.5rem',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(244, 63, 94, 0.15)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                color: '#fb7185'
              }}>
                <EyeOff size={32} />
              </div>
              <span className="badge badge-rose" style={{ marginBottom: '0.5rem' }}>
                Image Clarification Required
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.25rem', color: '#fff' }}>
                I need a clearer screenshot.
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0.75rem auto 0 auto', lineHeight: 1.6 }}>
                {analysis.what_exactly_is_wrong || 'The screenshot does not provide enough legible information to identify the exact cause. Please upload a clearer screenshot containing the complete error message and surrounding code.'}
              </p>
            </div>

            <div style={{
              background: 'rgba(15, 15, 18, 0.6)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              marginBottom: '2rem'
            }}>
              <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={18} color="#fb7185" /> Missing Visual Information
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {analysis.exact_cause || 'No legible stack trace, terminal output, or syntax error indicators were visible in the uploaded image.'}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={onReset} className="btn btn-primary btn-lg">
                <RotateCcw size={18} /> Upload a Clearer Screenshot
              </button>
              <button onClick={onTryAnotherPreset} className="btn btn-secondary btn-lg">
                Try a Preset Example
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // STANDARD EXACT DIAGNOSIS DASHBOARD (VISUAL FLOW + RESULT CARDS)
  return (
    <section id="results-view" className="results-section" style={{ padding: '1rem 0 4rem 0' }}>
      <div className="container">
        {/* TOP DETECTED INPUT BANNER & PROOF */}
        <div style={{
          maxWidth: '960px',
          margin: '0 auto 2rem auto',
          background: 'rgba(18, 18, 22, 0.9)',
          border: '1px solid rgba(249, 115, 22, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), var(--shadow-orange-glow)'
        }}>
          {/* Header Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            marginBottom: '1.25rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            {/* Left: Analyzed Screenshot Thumbnail Proof */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              background: '#09090b',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#111',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {imagePayload?.dataUrl ? (
                  <img
                    src={imagePayload.dataUrl}
                    alt="Analyzed Screenshot"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <ImageIcon size={24} color="#f97316" />
                )}
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#fb923c', fontWeight: 700, textTransform: 'uppercase' }}>
                  Analyzed Screenshot
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fafafa', wordBreak: 'break-all' }}>
                  {imagePayload?.filename || 'screenshot.png'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {analysis.input_type || `${analysis.language} Screenshot`}
                </div>
              </div>
            </div>

            {/* Right: Detected Input String & Language Lock */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#fff' }}>Gemma 4 Analysis</h2>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: langBadge.bg,
                  border: `1px solid ${langBadge.border}`,
                  color: langBadge.color,
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  letterSpacing: '0.05em'
                }}>
                  <span>{langBadge.icon}</span>
                  <span>{langBadge.label}</span>
                </div>
              </div>

              {/* Detected Input line: e.g. Python • SyntaxError • Line 22 */}
              <div style={{
                fontSize: '0.85rem',
                fontFamily: 'var(--font-mono)',
                color: '#fed7aa',
                background: 'rgba(249, 115, 22, 0.1)',
                padding: '0.35rem 0.65rem',
                borderRadius: '6px',
                display: 'inline-block'
              }}>
                {analysis.language} • {analysis.error_type || analysis.error_category || 'Identified'} {analysis.line_number ? `• Line ${analysis.line_number}` : ''}
              </div>
            </div>
          </div>

          {/* VISUAL FLOW: YOUR SCREENSHOT ➔ GEMMA 4 ➔ UNDERSTANDS ➔ ACTIONABLE FIX */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fafafa', fontWeight: 600 }}>
              <ImageIcon size={14} color="#fb923c" /> YOUR SCREENSHOT
            </div>
            <ArrowRight size={14} color="#f97316" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fed7aa', fontWeight: 700 }}>
              <Sparkles size={14} color="#f97316" /> GEMMA 4
            </div>
            <ArrowRight size={14} color="#f97316" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontWeight: 600 }}>
              <Cpu size={14} color="#60a5fa" /> UNDERSTANDS
            </div>
            <ArrowRight size={14} color="#f97316" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 700 }}>
              <CheckCircle2 size={14} color="#34d399" /> ACTIONABLE FIX
            </div>
          </div>
        </div>

        {/* 8 RESULT CARDS GRID */}
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          {/* CARD 01 — EXACT ERROR DETECTED */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f87171'
                }}>
                  <AlertCircle size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 700, textTransform: 'uppercase' }}>
                    01 • Exact Error Detected
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                    {analysis.error_type || analysis.error_category || 'Error Detected'}
                  </h3>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: langBadge.bg,
                  border: `1px solid ${langBadge.border}`,
                  color: langBadge.color,
                  fontWeight: 700,
                  fontSize: '0.78rem'
                }}>
                  <span>{langBadge.icon}</span>
                  <span>{langBadge.label}</span>
                </div>
                {analysis.line_number && (
                  <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                    Line {analysis.line_number}
                  </span>
                )}
              </div>
            </div>

            {/* Exact Error Message Box */}
            <div style={{
              background: '#09090b',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderLeft: '4px solid #ef4444',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.92rem',
              color: '#fca5a5',
              lineHeight: 1.5,
              wordBreak: 'break-word'
            }}>
              {analysis.exact_error_message || analysis.error_message || analysis.error_type}
            </div>
          </div>

          {/* CARD 02 — WHAT EXACTLY IS WRONG? */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fb923c'
              }}>
                <HelpCircle size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 700, textTransform: 'uppercase' }}>
                  02 • Code Context
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>What Exactly Is Wrong?</h3>
              </div>
            </div>

            <div style={{
              color: '#f4f4f5',
              fontSize: '0.95rem',
              lineHeight: 1.65,
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              {analysis.what_exactly_is_wrong}
            </div>
          </div>

          {/* CARD 03 — WHERE IS THE PROBLEM? */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fbbf24'
                }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 700, textTransform: 'uppercase' }}>
                    03 • Location & Problematic Code
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Where Is the Problem?</h3>
                </div>
              </div>

              {analysis.line_number && (
                <span className="badge badge-amber" style={{ fontSize: '0.75rem' }}>
                  Found at Line {analysis.line_number}
                </span>
              )}
            </div>

            {/* Problematic Code Snippet in the Detected Language */}
            {analysis.problematic_code && (
              <div style={{ marginBottom: '1rem' }}>
                <div className="code-wrapper" style={{ border: '1px solid rgba(239, 68, 68, 0.35)' }}>
                  <div className="code-header" style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#fca5a5' }}>
                    <span>BEFORE {analysis.line_number ? `(Line ${analysis.line_number})` : ''} • {analysis.language}</span>
                    <span style={{ fontSize: '0.72rem', color: '#fb7185' }}>Problematic Code</span>
                  </div>
                  <pre className="code-content" style={{ color: '#fca5a5', background: '#09090b' }}>
                    <code>{analysis.problematic_code}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Exact Cause Explanation */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              <strong>Root Cause:</strong> {analysis.exact_cause}
            </p>
          </div>

          {/* CARD 04 — EXACT FIX (BEFORE ➔ AFTER IN SAME LANGUAGE) */}
          <div className="glass-card glass-card-glow" style={{ padding: '1.75rem', border: '1px solid rgba(249, 115, 22, 0.45)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(249, 115, 22, 0.25)',
                  border: '1px solid rgba(249, 115, 22, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fed7aa'
                }}>
                  <Wrench size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 700, textTransform: 'uppercase' }}>
                    04 • Solution in {analysis.language}
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Exact Fix</h3>
                </div>
              </div>

              <button
                onClick={handleCopyFix}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.4rem' }}
              >
                {copiedFix ? <Check size={14} /> : <Copy size={14} />}
                {copiedFix ? 'Copied Fix!' : `Copy ${analysis.language} Fix`}
              </button>
            </div>

            {/* Explanation of exact change */}
            <p style={{ color: '#fafafa', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {analysis.exact_fix}
            </p>

            {/* BEFORE ➔ AFTER CODE COMPARISON (LANGUAGE LOCKED) */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {/* Before Box */}
              {analysis.problematic_code && (
                <div className="code-wrapper" style={{ border: '1px solid rgba(239, 68, 68, 0.35)' }}>
                  <div className="code-header" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
                    <span style={{ fontWeight: 700 }}>Before (Current Error)</span>
                    <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>{analysis.language}</span>
                  </div>
                  <pre className="code-content" style={{ color: '#fca5a5', background: '#09090b' }}>
                    <code>{analysis.problematic_code}</code>
                  </pre>
                </div>
              )}

              {/* After Box */}
              {analysis.corrected_code && (
                <div className="code-wrapper" style={{ border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                  <div className="code-header" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7' }}>
                    <span style={{ fontWeight: 700 }}>After (Corrected Solution)</span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{analysis.language}</span>
                  </div>
                  <pre className="code-content" style={{ color: '#6ee7b7', background: '#09090b' }}>
                    <code>{analysis.corrected_code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* CARD 05 — WHY THIS FIX WORKS */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}>
                <CheckCircle2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase' }}>
                  05 • Technical Rationale
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Why This Fix Works</h3>
              </div>
            </div>

            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
              lineHeight: 1.65,
              background: 'rgba(255, 255, 255, 0.02)',
              padding: '1.15rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              {analysis.why_the_fix_works}
            </p>
          </div>

          {/* CARD 06 — FIX IT STEP BY STEP */}
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24'
              }}>
                <ListOrdered size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 700, textTransform: 'uppercase' }}>
                  06 • Action Plan
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Fix It Step by Step</h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(Array.isArray(analysis.step_by_step) ? analysis.step_by_step : [analysis.step_by_step]).map((step, idx) => {
                const isChecked = completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isChecked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isChecked ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      border: isChecked ? '1px solid #10b981' : '1px solid var(--border-medium)',
                      background: isChecked ? '#10b981' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {isChecked ? <Check size={14} strokeWidth={3} /> : <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{idx + 1}</span>}
                    </div>

                    <div style={{
                      fontSize: '0.92rem',
                      color: isChecked ? '#a1a1aa' : '#f8fafc',
                      textDecoration: isChecked ? 'line-through' : 'none',
                      lineHeight: 1.5
                    }}>
                      {step}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CARD 07 — WHAT SHOULD YOU DO NEXT? (UNDERSTAND -> ACT) */}
          <div className="glass-card" style={{ padding: '1.75rem', background: 'rgba(249, 115, 22, 0.06)', border: '1.5px solid rgba(249, 115, 22, 0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(249, 115, 22, 0.25)',
                border: '1px solid rgba(249, 115, 22, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fed7aa'
              }}>
                <Play size={18} fill="#f97316" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#fb923c', fontWeight: 800, textTransform: 'uppercase' }}>
                  07 • Understand ➔ Act
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                  What Should You Do Next?
                </h3>
              </div>
            </div>

            <div style={{
              background: '#09090b',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              borderLeft: '4px solid #f97316',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              color: '#fed7aa',
              fontSize: '0.98rem',
              fontWeight: 600,
              lineHeight: 1.5
            }}>
              👉 {analysis.next_action || `Run your ${analysis.language} program again after applying the fix above.`}
            </div>
          </div>

          {/* CARD 08 — PREVENT IT NEXT TIME */}
          <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.04)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 700, textTransform: 'uppercase' }}>
                  08 • Proactive Coding Advice
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                  Prevent It Next Time
                </h3>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, paddingLeft: '2.75rem' }}>
              {analysis.prevention_tip || `Configure your ${analysis.language} linter and auto-formatter to format on save.`}
            </p>
          </div>

          {/* BOTTOM ACTION BAR */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1rem'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button onClick={onReset} className="btn btn-primary">
                <RotateCcw size={16} /> Analyze Another Screenshot
              </button>
              <button onClick={onTryAnotherPreset} className="btn btn-secondary">
                Try Another Preset
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleExportJson} className="btn btn-secondary btn-sm" title="Download diagnosis JSON">
                <Download size={14} /> Export JSON
              </button>
              <button onClick={handleCopyFullReport} className="btn btn-secondary btn-sm" title="Share diagnosis">
                <Share2 size={14} /> Share Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
