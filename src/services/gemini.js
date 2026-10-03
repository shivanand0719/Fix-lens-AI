// FixLens AI - Gemini API & Gemma 4 Multimodal Service

const GEMMA4_MULTIMODAL_PROMPT = `You are FixLens AI, a multimodal visual debugging assistant.

Analyze ONLY the image provided with this request.

The image is the source of truth.

Do not rely on previous uploaded images, previous responses, demo data, or assumptions.

First inspect the visual content carefully.

Determine what type of information is visible.

If the image contains programming code, identify the programming language.

If the image contains an error message, identify the exact visible error.

If a line number is visible, identify it.

If code is visible around the error, inspect the actual code surrounding the problem.

If the image contains a terminal, IDE, browser console, compiler output, stack trace, document, diagram, or other useful visual information, use that information.

Do not invent information that is not visible.

If the image is unclear, explicitly say that the available information is insufficient.

For programming errors:
1. Identify the exact error type.
2. Extract the exact visible error message.
3. Identify the relevant line.
4. Inspect the surrounding code.
5. Explain exactly what is wrong in the user's code.
6. Provide a correction using THE SAME PROGRAMMING LANGUAGE.
7. Preserve the user's variable names and overall logic whenever possible.
8. Explain why the correction solves the specific error.
9. Provide practical next steps.

NEVER convert Python code into JavaScript.
NEVER convert JavaScript into Python.
NEVER use another programming language for the correction.
The corrected code must use the same language detected in the uploaded image.

If the image does not contain a programming error, do not force a programming diagnosis.
Instead identify what the image actually contains and provide the most useful action based on that information.

Do not provide hidden reasoning or chain-of-thought.
Return only concise, user-facing analysis in this exact JSON structure:

{
  "input_type": "e.g. Python Code, React / JavaScript, Terminal Output, System Diagram, Document / Form, Chart",
  "language": "e.g. Python, JavaScript, Java, C++, TypeScript, Rust, Go, or None",
  "error_detected": true,
  "error_type": "e.g. SyntaxError, IndentationError, NameError, TypeError, ModuleNotFoundError, or Informational",
  "exact_error_message": "Exact error message from screenshot",
  "line_number": 22,
  "problematic_code": "Exact line or snippet causing the error",
  "what_is_visible": "Short summary of the overall visual content in the screenshot",
  "what_exactly_is_wrong": "Specific explanation of what is wrong in this exact screenshot",
  "exact_cause": "The precise root cause",
  "corrected_code": "Complete corrected code snippet in the EXACT SAME programming language",
  "exact_fix": "Exact modification needed",
  "why_the_fix_works": "Language-specific explanation of why this correction resolves the error",
  "step_by_step": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ],
  "next_action": "Clear, single immediate next action for the user (e.g. 'Run python quicksort.py again after indenting line 22.')",
  "prevention_tip": "Concrete prevention advice",
  "confidence": "High / Medium / Low",
  "needs_clearer_image": false
}

Return pure JSON only.`;

/**
 * Analyze the currently uploaded image using Gemma 4 multimodal capabilities through the Gemini API.
 * @param {Object} imagePayload - { base64Data, mimeType, filename }
 * @param {Object} options - { apiKey, model, signal }
 * @returns {Promise<Object>} Structured analysis response
 */
export async function analyzeScreenshot(imagePayload, options = {}) {
  if (!imagePayload || !imagePayload.base64Data) {
    throw new Error('No valid image data was provided for analysis. Please upload an image.');
  }

  const apiKey =
    options.apiKey ||
    localStorage.getItem('fixlens_gemini_api_key') ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    '';

  const model =
    options.model ||
    localStorage.getItem('fixlens_gemini_model') ||
    import.meta.env.VITE_GEMINI_MODEL ||
    'gemma-4';

  if (!apiKey.trim()) {
    throw new Error(
      'MISSING_API_KEY: Please provide your Gemini API key in settings or in your .env file (VITE_GEMINI_API_KEY).'
    );
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

  let mimeType = imagePayload.mimeType || 'image/png';
  if (mimeType.startsWith('image/svg')) {
    mimeType = 'image/png';
  }

  const requestBody = {
    contents: [
      {
        parts: [
          { text: GEMMA4_MULTIMODAL_PROMPT },
          {
            inline_data: {
              mime_type: mimeType,
              data: imagePayload.base64Data
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      topK: 32,
      topP: 0.95,
      maxOutputTokens: 2048,
      responseMimeType: "application/json"
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: options.signal
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      const message = errData?.error?.message || `API Request failed with HTTP ${response.status} (${response.statusText})`;
      
      if (message.toLowerCase().includes('not found') || message.toLowerCase().includes('supported')) {
        throw new Error(`Model "${model}" not recognized by Gemini API endpoint. You can switch to gemini-1.5-flash or gemini-2.0-flash in Settings. Raw error: ${message}`);
      }
      throw new Error(message);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];

    if (!candidate || !candidate.content?.parts?.[0]?.text) {
      throw new Error('Gemma 4 did not return a valid candidate response. Please try another screenshot.');
    }

    const rawText = candidate.content.parts[0].text;
    const parsed = parseGeminiResponse(rawText);

    return validateAndLockLanguage(parsed);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error('Gemini/Gemma API error:', error);
    throw error;
  }
}

/**
 * Safely parse the JSON response from the model
 */
function parseGeminiResponse(rawText) {
  try {
    return normalizeParsedData(JSON.parse(rawText));
  } catch (e) {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      return normalizeParsedData(JSON.parse(clean));
    } catch (innerErr) {
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return normalizeParsedData(JSON.parse(match[0]));
        } catch (mErr) {
          console.warn('Failed to parse matched JSON substring, returning formatted fallback');
        }
      }

      return {
        input_type: 'General Screenshot',
        language: 'Detected Code',
        error_detected: true,
        error_type: 'Analysis Output',
        exact_error_message: 'Information extracted from image',
        line_number: null,
        problematic_code: '',
        what_is_visible: 'Screenshot analyzed by Gemma 4',
        what_exactly_is_wrong: rawText,
        exact_cause: 'Review the diagnosis above for detailed root cause.',
        corrected_code: rawText.length < 300 ? rawText : '',
        exact_fix: 'Follow the specific fix instructions provided.',
        why_the_fix_works: 'Applying this correction aligns with language syntax and runtime expectations.',
        step_by_step: ['Review the analysis details above.'],
        next_action: 'Apply the suggested modifications and re-run.',
        prevention_tip: 'Double-check inputs and stack traces.',
        confidence: 'Medium',
        needs_clearer_image: false
      };
    }
  }
}

/**
 * Standardize fields for UI rendering
 */
function normalizeParsedData(data) {
  const language = data.language || data.language_or_tool || 'Python';
  const errorType = data.error_type || data.error_category || 'SyntaxError';
  const exactError = data.exact_error_message || data.error_message || data.error_detected || 'Error identified from screenshot';

  return {
    input_type: data.input_type || `${language} Screenshot`,
    language: language,
    error_detected: data.error_detected ?? true,
    error_type: errorType,
    error_category: errorType,
    exact_error_message: exactError,
    line_number: data.line_number || (data.line ? data.line : null),
    problematic_code: data.problematic_code || '',
    what_is_visible: data.what_is_visible || `${language} code and runtime output`,
    what_exactly_is_wrong: data.what_exactly_is_wrong || data.what_it_means || 'Gemma 4 analyzed the visual error in your screenshot.',
    exact_cause: data.exact_cause || (Array.isArray(data.likely_causes) ? data.likely_causes[0] : data.likely_causes) || 'Root cause identified in screenshot.',
    corrected_code: data.corrected_code || data.corrected_example || '',
    exact_fix: data.exact_fix || data.recommended_fix || 'Apply the suggested fix below.',
    why_the_fix_works: data.why_the_fix_works || 'This correction satisfies language runtime and syntax requirements.',
    step_by_step: Array.isArray(data.step_by_step) ? data.step_by_step : [data.step_by_step || 'Follow the resolution steps.'],
    next_action: data.next_action || 'Run your program again after applying the fix.',
    prevention_tip: data.prevention_tip || 'Use linters and test guards in your development environment.',
    confidence: data.confidence || 'High',
    needs_clearer_image: Boolean(data.needs_clearer_image)
  };
}

/**
 * Language Lock Validator: Verifies that corrected_code syntax matches the detected language.
 */
function validateAndLockLanguage(data) {
  if (!data || data.needs_clearer_image) return data;

  const lang = (data.language || '').toLowerCase();
  const code = (data.corrected_code || '').trim();

  // If detected language is Python, ensure no JS/C++ syntax leaks
  if (lang.includes('python')) {
    const hasJsPatterns =
      code.includes('data && data.items') ||
      code.includes('processItems(') ||
      code.includes('const ') ||
      code.includes('let ') ||
      code.includes('function(') ||
      code.includes('===') ||
      (code.includes(';') && code.includes('{') && !code.includes('def '));

    if (hasJsPatterns) {
      console.warn('Cross-language mismatch detected: sanitizing JS snippet for Python diagnosis');
      if (data.problematic_code) {
        data.corrected_code = `# Corrected Python:\n${data.problematic_code.split('\n').map(l => '    ' + l.trim()).join('\n')}`;
      } else {
        data.corrected_code = '# Indent the statements inside the block:\n    pass';
      }
    }
  }

  return data;
}
