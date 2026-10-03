import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { UploadBox } from './components/UploadBox';
import { LoadingState } from './components/LoadingState';
import { AnalysisResult } from './components/AnalysisResult';
import { RecentHistory } from './components/RecentHistory';
import { HowItWorks } from './components/HowItWorks';
import { WhyGemma } from './components/WhyGemma';
import { SettingsModal } from './components/SettingsModal';
import { JudgeDemoModal } from './components/JudgeDemoModal';
import { Footer } from './components/Footer';

import { analyzeScreenshot } from './services/gemini';
import { DEMO_PRESETS } from './utils/demoData';
import { urlToBase64 } from './utils/validation';
import { AlertTriangle, Sparkles, Key, Zap } from 'lucide-react';
import './App.css';

export function App() {
  // Separated State
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isNewImagePendingAnalysis, setIsNewImagePendingAnalysis] = useState(false);
  const [globalError, setGlobalError] = useState('');

  // Demo Mode & Presets
  const [demoPreset, setDemoPreset] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(() => {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    const localKey = localStorage.getItem('fixlens_gemini_api_key');
    return !(envKey || localKey);
  });

  // Settings
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('fixlens_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  });

  const [model, setModel] = useState(() => {
    return localStorage.getItem('fixlens_gemini_model') || import.meta.env.VITE_GEMINI_MODEL || 'gemma-4';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isJudgeDemoOpen, setIsJudgeDemoOpen] = useState(false);

  // Request & Abort Management to prevent race conditions
  const requestCounter = useRef(0);
  const abortControllerRef = useRef(null);

  // Recent History in Browser localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('fixlens_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = (newAnalysis, imageItem) => {
    try {
      const item = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        analysis: newAnalysis,
        imagePayload: {
          filename: imageItem.filename || 'screenshot.png',
          dataUrl: imageItem.dataUrl,
          size: imageItem.size
        }
      };
      const updated = [item, ...history.filter(h => h.analysis.error_detected !== newAnalysis.error_detected)].slice(0, 3);
      setHistory(updated);
      localStorage.setItem('fixlens_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage history', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('fixlens_history');
  };

  const handleSelectHistoryItem = (item) => {
    // Abort pending requests
    abortControllerRef.current?.abort();
    requestCounter.current++;

    setAnalysisResult(item.analysis);
    setUploadedImage(item.imagePayload);
    setDemoPreset(null);
    setIsNewImagePendingAnalysis(false);
    setGlobalError('');

    setTimeout(() => {
      document.getElementById('results-view')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 1. User Uploads / Pastes a New Image: IMMEDIATELY RESET OLD RESULTS
  const handleImageChanged = (newPayload) => {
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    requestCounter.current++;

    // Clear previous analysis, errors, and stale results
    setAnalysisResult(null);
    setGlobalError('');
    setDemoPreset(null);
    setUploadedImage(newPayload);
    setIsNewImagePendingAnalysis(true);
  };

  const handleClearImage = () => {
    abortControllerRef.current?.abort();
    requestCounter.current++;
    setUploadedImage(null);
    setAnalysisResult(null);
    setDemoPreset(null);
    setIsNewImagePendingAnalysis(false);
    setGlobalError('');
  };

  // 2. Select a Demo Preset
  const handleSelectPreset = async (preset) => {
    abortControllerRef.current?.abort();
    requestCounter.current++;

    setGlobalError('');
    setAnalysisResult(null);
    setDemoPreset(preset);

    try {
      const converted = await urlToBase64(preset.previewUrl, preset.filename);
      setUploadedImage(converted);
      setIsNewImagePendingAnalysis(true);

      document.getElementById('analyzer-card')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setGlobalError('Failed to load preset screenshot.');
    }
  };

  // 3. User clicks "Analyze with Gemma 4": Sends CURRENT image
  const handleAnalyze = async () => {
    if (!uploadedImage || !uploadedImage.base64Data) {
      setGlobalError('Please select or upload an error screenshot first.');
      return;
    }

    setGlobalError('');
    setAnalysisResult(null);
    setIsAnalyzing(true);
    setIsNewImagePendingAnalysis(false);

    // Scroll to analyzer
    window.scrollTo({ top: 380, behavior: 'smooth' });

    // Setup request tracking & abort controller
    const currentReqId = ++requestCounter.current;
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // IF IN DEMO MODE (Offline Simulation)
      if (isDemoMode) {
        await new Promise((res) => setTimeout(res, 1700));
        
        // Ensure request wasn't superseded
        if (requestCounter.current !== currentReqId) return;

        let result = null;
        if (demoPreset && demoPreset.sampleAnalysis) {
          result = demoPreset.sampleAnalysis;
        } else {
          // Dynamic mock tailored to current upload
          const filename = (uploadedImage.filename || '').toLowerCase();
          const isPython = filename.endsWith('.py') || filename.includes('python');
          const isJava = filename.endsWith('.java') || filename.includes('java');
          const isJs = filename.endsWith('.js') || filename.endsWith('.jsx') || filename.endsWith('.ts') || filename.endsWith('.tsx');

          let detectedLang = 'Python';
          let sampleFix = '# Corrected Python code:\ndef solve():\n    if is_valid:\n        execute_task()';
          if (isJava) {
            detectedLang = 'Java';
            sampleFix = '// Corrected Java:\npublic void solve() {\n    if (isValid) {\n        executeTask();\n    }\n}';
          } else if (isJs) {
            detectedLang = 'JavaScript';
            sampleFix = '// Corrected JavaScript:\nfunction solve() {\n  if (isValid) {\n    executeTask();\n  }\n}';
          }

          result = {
            language: detectedLang,
            error_detected: true,
            error_type: "Code Error",
            error_category: "Code Error",
            exact_error_message: `Identified issue in ${uploadedImage.filename || 'screenshot'}`,
            line_number: null,
            problematic_code: "",
            what_exactly_is_wrong: `Gemma 4 analyzed the visual error context in your uploaded ${detectedLang} screenshot. (Add your Gemini API Key in Settings to run live multimodal API inferences).`,
            exact_cause: `Syntax mismatch or missing block indentation identified in ${detectedLang}.`,
            corrected_code: sampleFix,
            exact_fix: `Apply proper ${detectedLang} syntax and indentation according to language rules.`,
            why_the_fix_works: `Applying these corrections satisfies ${detectedLang} compiler/interpreter validation rules.`,
            step_by_step: [
              `Locate the failing statement in your ${detectedLang} file.`,
              `Verify that all statement blocks match ${detectedLang} syntax.`,
              "Save and re-run your program."
            ],
            prevention_tip: `Use a dedicated ${detectedLang} linter and auto-formatter.`,
            confidence: "High",
            needs_clearer_image: false
          };
        }

        setAnalysisResult(result);
        saveToHistory(result, uploadedImage);

        setTimeout(() => {
          document.getElementById('results-view')?.scrollIntoView({ behavior: 'smooth' });
        }, 200);
        return;
      }

      // LIVE MODE: Send the EXACT current uploaded image to Gemma 4 via Gemini API
      const result = await analyzeScreenshot(uploadedImage, {
        apiKey,
        model,
        signal: controller.signal
      });

      // Verify request is still current (prevent stale responses)
      if (requestCounter.current !== currentReqId) return;

      setAnalysisResult(result);
      saveToHistory(result, uploadedImage);

      setTimeout(() => {
        document.getElementById('results-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    } catch (err) {
      if (err.name === 'AbortError') return;

      console.error('Analysis error:', err);
      const msg = err.message || 'An error occurred during analysis.';
      if (msg.includes('MISSING_API_KEY')) {
        setGlobalError(
          'Gemini API key is not configured. Add your API key in Settings, or toggle "Demo Mode" in the top bar to test without an API key.'
        );
      } else {
        setGlobalError(msg);
      }
    } finally {
      if (requestCounter.current === currentReqId) {
        setIsAnalyzing(false);
      }
    }
  };

  // Fast Judge 2-Minute Demo Speedrun
  const handleRunFastJudgeDemo = async () => {
    const pythonDemo = DEMO_PRESETS[0];
    await handleSelectPreset(pythonDemo);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setIsNewImagePendingAnalysis(false);

    setTimeout(() => {
      setAnalysisResult(pythonDemo.sampleAnalysis);
      saveToHistory(pythonDemo.sampleAnalysis, {
        filename: pythonDemo.filename,
        dataUrl: pythonDemo.previewUrl,
        size: 15420
      });
      setIsAnalyzing(false);

      setTimeout(() => {
        document.getElementById('results-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }, 1600);
  };

  const handleReset = () => {
    handleClearImage();
    document.getElementById('analyzer-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToAnalyzer = () => {
    document.getElementById('analyzer-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app-root">
      {/* HEADER */}
      <Header
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenJudgeDemo={() => setIsJudgeDemoOpen(true)}
        hasApiKey={Boolean(apiKey)}
      />

      <main>
        {/* HERO */}
        <Hero
          onAnalyzeClick={handleScrollToAnalyzer}
          onTryDemoClick={() => handleSelectPreset(DEMO_PRESETS[0])}
        />

        {/* GLOBAL ERROR STATE BANNER */}
        {globalError && (
          <div className="container" style={{ marginBottom: '1.5rem' }}>
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              color: '#fca5a5'
            }}>
              <AlertTriangle size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#fb7185' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem', color: '#fff' }}>
                  Analysis Notice
                </div>
                <div style={{ fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {globalError}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setIsDemoMode(true);
                      setGlobalError('');
                      handleAnalyze();
                    }}
                    className="btn btn-sm btn-accent"
                  >
                    <Sparkles size={13} /> Switch to Demo Mode & Analyze
                  </button>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="btn btn-sm btn-secondary"
                  >
                    <Key size={13} /> Open API Key Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYZER UPLOAD BOX */}
        <UploadBox
          imagePayload={uploadedImage}
          onImageChanged={handleImageChanged}
          onClearImage={handleClearImage}
          onAnalyze={handleAnalyze}
          isLoading={isAnalyzing}
          onSelectPreset={handleSelectPreset}
          activePresetId={demoPreset?.id}
          isNewImagePendingAnalysis={isNewImagePendingAnalysis}
        />

        {/* LOADING ANIMATION */}
        {isAnalyzing && <LoadingState />}

        {/* ANALYSIS RESULT DASHBOARD */}
        {analysisResult && !isAnalyzing && (
          <AnalysisResult
            analysis={analysisResult}
            imagePayload={uploadedImage}
            onReset={handleReset}
            onTryAnotherPreset={() => handleSelectPreset(DEMO_PRESETS[1])}
          />
        )}

        {/* RECENT LOCAL HISTORY */}
        <RecentHistory
          history={history}
          onSelectHistoryItem={handleSelectHistoryItem}
          onClearHistory={handleClearHistory}
        />

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* WHY GEMMA 4 */}
        <WhyGemma />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* MODALS */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        setApiKey={setApiKey}
        model={model}
        setModel={setModel}
      />

      <JudgeDemoModal
        isOpen={isJudgeDemoOpen}
        onClose={() => setIsJudgeDemoOpen(false)}
        onRunFastJudgeDemo={handleRunFastJudgeDemo}
      />
    </div>
  );
}

export default App;
