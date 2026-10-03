// Demo Presets and Mock Visual Data for Hackathon Evaluation

function createCodeSvg(title, lang, codeLines, errorLine, lineOffset = 1) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="520" viewBox="0 0 900 520">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0e0e12"/>
        <stop offset="100%" stop-color="#14141a"/>
      </linearGradient>
      <linearGradient id="errGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ef4444" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#ef4444" stop-opacity="0.05"/>
      </linearGradient>
    </defs>
    <!-- Window Frame -->
    <rect width="900" height="520" rx="14" fill="url(#bgGrad)" stroke="#27272a" stroke-width="2"/>
    
    <!-- Titlebar -->
    <rect width="900" height="42" rx="14" fill="#18181b"/>
    <rect y="32" width="900" height="10" fill="#18181b"/>
    <line x1="0" y1="42" x2="900" y2="42" stroke="#27272a" stroke-width="1"/>
    
    <!-- Mac dots -->
    <circle cx="24" cy="21" r="6" fill="#ff5f56"/>
    <circle cx="44" cy="21" r="6" fill="#ffbd2e"/>
    <circle cx="64" cy="21" r="6" fill="#27c93f"/>
    
    <!-- Tab Title -->
    <text x="450" y="26" fill="#a1a1aa" font-family="'JetBrains Mono', 'Fira Code', monospace" font-size="13" text-anchor="middle" font-weight="500">${title} • ${lang}</text>

    <!-- Code & Terminal Area -->
    <g transform="translate(30, 70)">
      ${codeLines.map((line, idx) => {
        const lineNum = idx + lineOffset;
        const y = idx * 25;
        const isErr = line.startsWith('!') || line.includes('Error:') || line.includes('Traceback') || line.includes('error:');
        const isErrHighlight = idx === errorLine;
        return `
          ${isErrHighlight ? `<rect x="-20" y="${y - 17}" width="870" height="26" fill="url(#errGrad)" rx="4"/>` : ''}
          <text x="0" y="${y}" fill="#52525b" font-family="'JetBrains Mono', monospace" font-size="12" text-anchor="end" width="20">${line.startsWith('!') || line.startsWith('>') || line.startsWith('#') || line.startsWith('//') || line === '' ? '' : lineNum}</text>
          <text x="30" y="${y}" fill="${isErr ? '#f87171' : (line.startsWith('#') || line.startsWith('//')) ? '#71717a' : line.startsWith('>') ? '#fb923c' : '#f4f4f5'}" font-family="'JetBrains Mono', 'Fira Code', monospace" font-size="13.5" font-weight="${isErr ? '600' : '400'}">
            ${escapeXml(line)}
          </text>
        `;
      }).join('')}
    </g>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export const DEMO_PRESETS = [
  {
    id: 'python-syntax-indent-error',
    title: '1. Python SyntaxError',
    subtitle: "expected an indented block after 'if' statement on line 22",
    language: 'Python',
    filename: 'quicksort.py',
    previewUrl: createCodeSvg(
      'quicksort.py',
      'Python 3.11',
      [
        '# Recursive QuickSort implementation in Python',
        'def quick_sort(arr, low, high):',
        '    if low < high:',
        '    pivot_index = partition(arr, low, high)',
        '    quick_sort(arr, low, pivot_index - 1)',
        '    quick_sort(arr, pivot_index + 1, high)',
        '',
        '  File "quicksort.py", line 22',
        '    pivot_index = partition(arr, low, high)',
        '! SyntaxError: expected an indented block after \'if\' statement on line 22'
      ],
      3,
      20
    ),
    sampleAnalysis: {
      language: "Python",
      error_detected: true,
      error_type: "SyntaxError",
      exact_error_message: "expected an indented block after 'if' statement on line 22",
      line_number: 22,
      problematic_code: "pivot_index = partition(arr, low, high)",
      what_exactly_is_wrong: "The `if low < high:` statement starts a Python block, but the next statement `pivot_index = partition(arr, low, high)` is not indented inside that block. Python requires the statements belonging to the `if` block to be indented.",
      exact_cause: "Python uses whitespace indentation to define code blocks. Line 22 is at the same indentation level as the preceding `if` statement.",
      corrected_code: "def quick_sort(arr, low, high):\n    if low < high:\n        pivot_index = partition(arr, low, high)\n        quick_sort(arr, low, pivot_index - 1)\n        quick_sort(arr, pivot_index + 1, high)",
      exact_fix: "Indent the statements belonging to the `if low < high:` block by 4 spaces so they reside inside the conditional block.",
      why_the_fix_works: "Python uses indentation to define code blocks. The `if low < high:` statement requires an indented block underneath it. Once the statements are indented correctly, Python recognizes them as part of the `if` block and the SyntaxError is resolved.",
      step_by_step: [
        "Go to line 22 in quicksort.py.",
        "Find the `if low < high:` statement.",
        "Indent `pivot_index = partition(arr, low, high)` by 4 spaces.",
        "Indent the subsequent `quick_sort()` recursive calls.",
        "Run the Python program again."
      ],
      prevention_tip: "Configure your code editor to display indentation guides and auto-indent on new lines after a colon ':'.",
      confidence: "High",
      needs_clearer_image: false
    }
  },
  {
    id: 'python-name-error',
    title: '2. Python NameError',
    subtitle: "NameError: name 'username' is not defined at line 4",
    language: 'Python',
    filename: 'auth.py',
    previewUrl: createCodeSvg(
      'auth.py',
      'Python 3.11',
      [
        '# User greeting script in Python',
        'def send_welcome_email():',
        '    # Missing variable assignment',
        '    print(f"Welcome back, {username}!")',
        '',
        'Traceback (most recent call last):',
        '  File "auth.py", line 4, in send_welcome_email',
        '    print(f"Welcome back, {username}!")',
        '! NameError: name \'username\' is not defined'
      ],
      3,
      1
    ),
    sampleAnalysis: {
      language: "Python",
      error_detected: true,
      error_type: "NameError",
      exact_error_message: "NameError: name 'username' is not defined",
      line_number: 4,
      problematic_code: "print(f\"Welcome back, {username}!\")",
      what_exactly_is_wrong: "Variable 'username' is referenced inside the f-string on line 4, but it has not been defined in the local or global scope.",
      exact_cause: "'username' is being used before it has been defined or passed as an argument to the function.",
      corrected_code: "def send_welcome_email(username):\n    print(f\"Welcome back, {username}!\")",
      exact_fix: "Add 'username' as a parameter to send_welcome_email(username) or define it prior to line 4.",
      why_the_fix_works: "The variable is now defined and accessible in the local scope, so Python can resolve the variable reference.",
      step_by_step: [
        "Go to line 2 in auth.py.",
        "Add username to the function parameter list: def send_welcome_email(username):.",
        "Pass the actual username string when invoking send_welcome_email('Alex').",
        "Re-run python auth.py."
      ],
      prevention_tip: "Enable Python type-checking and linter diagnostics in your IDE to catch unbound variables before runtime.",
      confidence: "High",
      needs_clearer_image: false
    }
  },
  {
    id: 'javascript-type-error',
    title: '3. JavaScript TypeError',
    subtitle: "TypeError: Cannot read properties of undefined (reading 'map')",
    language: 'JavaScript',
    filename: 'UserList.jsx',
    previewUrl: createCodeSvg(
      'UserList.jsx',
      'JavaScript (React)',
      [
        '// UserList component in React',
        'export function UserList({ data }) {',
        '  return (',
        '    <ul>',
        '      {data.users.map(u => <li key={u.id}>{u.name}</li>)}',
        '    </ul>',
        '  );',
        '}',
        '',
        '! Uncaught TypeError: Cannot read properties of undefined (reading \'map\')'
      ],
      4,
      1
    ),
    sampleAnalysis: {
      language: "JavaScript",
      error_detected: true,
      error_type: "TypeError",
      exact_error_message: "Cannot read properties of undefined (reading 'map')",
      line_number: 5,
      problematic_code: "{data.users.map(u => <li key={u.id}>{u.name}</li>)}",
      what_exactly_is_wrong: "The component attempts to call `.map()` on `data.users`, but `data.users` evaluates to `undefined` during initial rendering before the API response arrives.",
      exact_cause: "Calling an Array method `.map()` on an undefined property without optional chaining or fallback array handling.",
      corrected_code: "export function UserList({ data }) {\n  const users = data?.users || [];\n  return (\n    <ul>\n      {users.map(u => (\n        <li key={u.id}>{u.name}</li>\n      ))}\n    </ul>\n  );\n}",
      exact_fix: "Use optional chaining and provide a default fallback array: `const users = data?.users || [];` before mapping.",
      why_the_fix_works: "Optional chaining safely evaluates to `undefined` instead of throwing a TypeError, and the fallback `[]` ensures `.map()` is always called on a valid Array.",
      step_by_step: [
        "Open UserList.jsx at line 5.",
        "Add optional chaining: `data?.users?.map(...)` or extract `const users = data?.users || [];`.",
        "Save and verify hot module reloading in your browser."
      ],
      prevention_tip: "Always provide default values for async props and initialize array state with `[]`.",
      confidence: "High",
      needs_clearer_image: false
    }
  },
  {
    id: 'java-compilation-error',
    title: '4. Java Compilation Error',
    subtitle: "cannot find symbol: variable result at line 14",
    language: 'Java',
    filename: 'Calculator.java',
    previewUrl: createCodeSvg(
      'Calculator.java',
      'Java (OpenJDK 17)',
      [
        'public class Calculator {',
        '    public static void compute(int a, int b) {',
        '        if (a > 0) {',
        '            int result = a * b;',
        '        }',
        '        System.out.println("Output: " + result);',
        '    }',
        '}',
        '',
        '! Calculator.java:6: error: cannot find symbol variable result'
      ],
      5,
      1
    ),
    sampleAnalysis: {
      language: "Java",
      error_detected: true,
      error_type: "Compilation Error",
      exact_error_message: "cannot find symbol: variable result",
      line_number: 6,
      problematic_code: "System.out.println(\"Output: \" + result);",
      what_exactly_is_wrong: "`result` is declared inside the `if` block scope on line 4, but line 6 attempts to access it outside that block where it is out of scope.",
      exact_cause: "Variable `result` has block scope limited to the curly braces `{}` of the `if` statement.",
      corrected_code: "public class Calculator {\n    public static void compute(int a, int b) {\n        int result = 0;\n        if (a > 0) {\n            result = a * b;\n        }\n        System.out.println(\"Output: \" + result);\n    }\n}",
      exact_fix: "Declare `int result = 0;` before the `if` block so it is accessible throughout the method.",
      why_the_fix_works: "Hoisting the variable declaration to method scope makes `result` visible to the `println` statement after the `if` block.",
      step_by_step: [
        "Open Calculator.java.",
        "Declare `int result = 0;` at the beginning of the `compute` method.",
        "Assign `result = a * b;` inside the `if` condition without re-declaring `int`.",
        "Recompile with `javac Calculator.java`."
      ],
      prevention_tip: "Ensure variables needed outside conditional blocks are declared in the enclosing method scope.",
      confidence: "High",
      needs_clearer_image: false
    }
  }
];

export const UNCLEAR_IMAGE_DEMO = {
  id: 'unclear-demo',
  title: '5. Unclear Screenshot',
  subtitle: 'Unable To Determine Exact Error',
  language: 'Uncertain',
  filename: 'blurry_unclear_screenshot.png',
  previewUrl: createCodeSvg(
    'Unfocused Window',
    'Unknown',
    [
      '[Image too dark / cropped / blurry]',
      '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░',
      'No clear stacktrace or error code visible.',
      '░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░'
    ],
    -1
  ),
  sampleAnalysis: {
    language: "Unknown",
    error_detected: false,
    error_type: "Unable To Determine Exact Error",
    exact_error_message: "The screenshot does not contain legible terminal output, code line numbers, or compiler error text.",
    line_number: null,
    problematic_code: "",
    what_exactly_is_wrong: "The screenshot does not provide enough information to identify the exact cause. Please upload a clearer screenshot containing the complete error message and surrounding code.",
    exact_cause: "Image resolution or crop region cuts off the error traceback and code lines.",
    corrected_code: "",
    exact_fix: "Capture a full screenshot showing both the editor line numbers and the terminal crash log.",
    why_the_fix_works: "Having complete visual error text allows FixLens to isolate the exact line and failure condition.",
    step_by_step: [
      "Open your terminal, output console, or browser developer tools.",
      "Take a clear screenshot (Windows: Win+Shift+S, Mac: Cmd+Shift+4).",
      "Ensure the error text and stacktrace are centered and legible.",
      "Upload the new screenshot to FixLens AI."
    ],
    prevention_tip: "Include at least 2-3 lines of surrounding code and the full terminal output.",
    confidence: "Low",
    needs_clearer_image: true
  }
};
