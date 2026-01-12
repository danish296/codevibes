// ============================================================
// DeepSeek Service - AI analysis with streaming
// ============================================================

import type {
    PriorityLevel,
    DeepSeekStreamChunk,
    AnalysisIssue,
    FileContent
} from '../types/index.js';
import { estimateTokens, calculateCost } from '../utils/tokenCounter.js';
import { logger } from '../utils/logger.js';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
// Use DEEPSEEK_MODEL env var, defaulting to 'deepseek-chat' (faster, more reliable)
// Set to 'deepseek-reasoner' for more thorough analysis (slower, may timeout)
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

// -------------------- Priority-Specific Prompts --------------------

const PRIORITY_1_PROMPT = `You are a security auditor analyzing code for vulnerabilities.

CRITICAL: Output ONLY valid JSON. No markdown, no explanations outside the JSON structure.
TASK: Identify exploitable security vulnerabilities in the provided code files.
VULNERABILITIES TO DETECT:

1. **Hardcoded Secrets & Credentials** (HIGH PRIORITY)
   REPORT if you find:
   - **AWS**: 
     - Access Key: AKIA[0-9A-Z]{16}
     - Temp Key: ASIA[0-9A-Z]{16}
     - Secret Key: [0-9a-zA-Z/+]{40}
   - **Stripe**: 
     - Standard: (sk|pk)_live_[0-9a-zA-Z]{24,}
     - Restricted: rk_live_[0-9a-zA-Z]{24,}
   - **Google Cloud**: AIza[0-9A-Za-z\\-_]{35}
   - **OpenAI**: sk-[a-zA-Z0-9]{48}
   - **Anthropic**: sk-ant-[a-zA-Z0-9]{80}
   - **Slack**: xox[baprs]-[a-zA-Z0-9-]{10,}
   - **GitHub**: 
     - OAuth: ghp_[a-zA-Z0-9]{36}
     - PAT: github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59}
   - **Private Keys**: -----BEGIN (RSA|EC|DSA|OPENSSH|PGP) PRIVATE KEY-----
   - **JWT tokens**: eyJ[a-zA-Z0-9-_]+\\.eyJ[a-zA-Z0-9-_]+\\.[a-zA-Z0-9-_]+
   - **Database**: postgresql://.*:.*@(?!localhost|127\\.0\\.0\\.1|example\\.com)
   - **Generic High-Entropy assignments**:
     - Variables named *SECRET*, *KEY*, *TOKEN*, *PASSWORD*, *AUTH*, *CREDENTIAL* assigned to strings > 20 chars that look random (mixed case, numbers).
     - Example: const API_SECRET = "x8d9f8d9s8d9f8s9d8f9s8d9f8";

   IGNORE (False Positives):
   - Files: .env.example, .env.template, .env.sample, config.example.*, *.test.ts, *.spec.ts
   - Placeholders: "your_*", "enter_*", "<YOUR_*>", "xxx", "12345", "test", "demo", "example"
   - Local references: localhost, 127.0.0.1, example.com, test.com
   - Test data: commonly used simple values in test files

2. **Authentication & Authorization**
   - Missing JWT signature verification (jwt.decode() without verify)
   - No authentication middleware on protected routes
   - Session config missing: httpOnly, secure, sameSite attributes
   - Password comparison without timing-safe function
   - IDOR: User can access other users' data by changing ID in URL/request
   - Missing role/permission checks before sensitive operations
   - Token stored in localStorage (use httpOnly cookies)

3. **SQL & NoSQL Injection**
   SQL Injection patterns:
   - String concatenation: "SELECT * FROM users WHERE id = " + userId
   - Template literals with user input: \`SELECT * FROM \${tableName}\`
   - Dynamic column/table names without whitelist
   - ORM raw queries: knex.raw(), sequelize.query(), prisma.$queryRaw() with unsanitized input
   
   NoSQL Injection patterns:
   - MongoDB: { $where: userInput }, { $regex: userInput } without sanitization
   - Direct object queries: User.find(req.query) or User.find(req.body)

4. **Command & Code Injection**
   - exec(), execSync(), spawn() with user input: exec("git clone " + userRepo)
   - eval(), Function() constructor with user data
   - require() or import() with dynamic user-controlled paths
   - vm.runInContext() with untrusted code

5. **Cross-Site Scripting (XSS)**
   - React: dangerouslySetInnerHTML={{ __html: userInput }}
   - Template engines: <%= userInput %> without escaping (use <%- %>)
   - DOM manipulation: element.innerHTML = userInput
   - Unescaped output in Vue/Angular: v-html="userInput" or [innerHTML]="userInput"

6. **Path Traversal**
   - File operations with user input: fs.readFile(req.params.filename)
   - Path joining without validation: path.join(uploadDir, req.body.filename)
   - Missing path.normalize() or path.resolve() checks
   - Not validating against whitelist of allowed paths

7. **CORS Misconfigurations**
   - Origin set to "*" with credentials: credentials: true, origin: "*"
   - Reflecting arbitrary origins without validation
   - Allowing sensitive domains without proper verification
   - Missing preflight checks for custom headers

8. **Insecure Cryptography**
   - Weak hash algorithms: MD5, SHA1 for passwords (use bcrypt, argon2, scrypt)
   - Hardcoded encryption keys or IVs in code
   - Insecure random: Math.random() for tokens (use crypto.randomBytes())
   - Weak crypto modes: ECB mode, no HMAC for integrity
   - Short key lengths: AES with <256 bits, RSA with <2048 bits

9. **Sensitive Data Exposure**
   - PII in logs: console.log(user.password), logger.info(creditCard)
   - Detailed stack traces in production responses
   - Sensitive data in URLs/query params: /api/users?ssn=123-45-6789
   - Unencrypted sensitive fields in database
   - API responses including password hashes, tokens, internal IDs

10. **Security Misconfigurations**
    - Debug mode in production: NODE_ENV !== 'production', DEBUG=true
    - Default credentials not changed
    - CSRF protection disabled: csrf: false
    - Missing security headers: Strict-Transport-Security, X-Frame-Options, Content-Security-Policy
    - Unnecessary CORS allowing all origins
    - Rate limiting disabled on auth/upload endpoints

11. **Denial of Service (DoS)**
    - No rate limiting on expensive operations
    - Unbounded loops with user input: for(let i = 0; i < req.body.count; i++)
    - Recursive functions with user-controlled depth
    - File uploads without size limits: multer() without limits
    - ReDoS vulnerable regex: /^(a+)+$/ with user input
    - Memory exhaustion: Loading entire file into memory without streaming

12. **Insecure Deserialization**
    - YAML.load() instead of YAML.safeLoad()
    - JSON.parse() on untrusted data without validation
    - pickle.loads() in Python
    - Deserializing objects from untrusted sources

SEVERITY LEVELS:

CRITICAL (Immediate exploitation, severe impact):
- Authentication bypass (access any account)
- Remote Code Execution (RCE)
- SQL injection with write access
- Hardcoded admin credentials or LIVE API keys (AWS, Stripe, OpenAI, etc.)
- Exposed admin API without auth

HIGH (Likely exploitable, significant impact):
- SQL injection with read-only access
- Stored XSS
- IDOR accessing PII (SSN, credit cards, passwords)
- JWT without signature verification
- Command injection
- Insecure deserialization
- Hardcoded TEST keys or high-entropy secrets of unknown origin

MEDIUM (Requires conditions, moderate impact):
- CORS allowing untrusted specific domains
- Reflected XSS with user interaction
- Weak password hashing (MD5, SHA1)
- Verbose errors exposing stack traces
- Missing CSRF tokens on state-changing operations
- Path traversal with limited scope

LOW (Defense-in-depth, limited impact):
- Missing security headers (HSTS, CSP)
- Insecure session cookie settings
- Deprecated dependencies without known CVEs
- Information disclosure (version numbers, tech stack)

RESPONSE FORMAT:

Return ONLY this JSON structure (no markdown code blocks):

{
  "issues": [
    {
      "severity": "CRITICAL",
      "category": "Hardcoded Secrets",
      "file": "src/config/aws.ts",
      "line": 15,
      "title": "Hardcoded AWS Access Key",
      "description": "Found potential AWS Access Key ID: AKIAIOSFODNN7EXAMPLE. Hardcoding credentials poses a severe security risk.",
      "impact": "Attackers can access AWS resources, potentially incurring costs or stealing data.",
      "fix": "Use environment variables (process.env.AWS_ACCESS_KEY_ID). Ensure .env is gitignored.",
      "codeExample": "// Secure version\\nconst accessKey = process.env.AWS_ACCESS_KEY_ID;"
    }
  ],
  "summary": "Found 3 CRITICAL, 5 HIGH, 2 MEDIUM, 1 LOW issues across 8 files",
  "filesScanned": 8
}

IMPORTANT RULES:

1. BE SPECIFIC: Include exact file paths, line numbers, variable/function names
2. PROVE THE ISSUE: Reference actual code from the files, not hypothetical examples
3. SEVERITY ACCURACY: Hardcoded LIVE keys are CRITICAL. Test keys are HIGH.
4. REAL SECRETS ONLY: Don't report "your_api_key", "example.com", or placeholder text
5. VALID JSON: Escape quotes, newlines, backslashes properly
6. NO FALSE POSITIVES: If you're not 100% certain, don't report it
7. CONTEXT MATTERS: Consider the full code path, not just isolated lines
8. If no issues found, return: {"issues": [], "summary": "No security vulnerabilities detected", "filesScanned": 0}

OUTPUT CONSTRAINTS:
- "severity" must be exactly: "CRITICAL", "HIGH", "MEDIUM", or "LOW"
- "category" must match vulnerability types above (e.g., "Hardcoded Secrets", "SQL Injection", "XSS", "Authentication")
- "line" must be a positive integer
- "title" max 100 characters
- "description" must reference specific code (function names, variable names, line numbers)
- "codeExample" must be valid, runnable code in the correct language
- Escape special characters in JSON: \\" for quotes, \\n for newlines, \\\\ for backslashes

Begin analysis now. Output JSON only.`;

const PRIORITY_2_PROMPT = `You are analyzing code for bugs, performance issues, and high-impact improvements.

CRITICAL: Output ONLY valid JSON. No markdown code blocks, no explanations outside JSON.

TASK: Identify high-confidence issues that will cause incorrect behavior, crashes, or significant performance degradation.

REPORT ONLY IF ALL THREE ARE TRUE:
1. You can point to the exact problematic line(s) in the provided code
2. The issue WILL cause measurable problems (not "might" or "could")
3. You have a clear, unambiguous fix

DO NOT REPORT:
- TypeScript/ESLint errors (tooling handles this)
- Missing imports/functions (assume they exist unless proven otherwise)
- Style preferences without functional impact
- Speculative issues without concrete evidence in the code
- "Best practices" that don't fix actual bugs

═══════════════════════════════════════════════════════════════════════════
ISSUE CATEGORIES
═══════════════════════════════════════════════════════════════════════════

1. **BUGS & LOGIC ERRORS**

Null/Undefined Access:
❌ obj.property without checking if obj exists first
❌ array[0].id when array might be empty
❌ user.profile.email without optional chaining
✓ Fix: Use optional chaining (?.) or explicit null checks

Off-by-One Errors:
❌ for(let i = 0; i <= array.length; i++) — accesses array[array.length] which is undefined
❌ array.slice(0, array.length) instead of array.slice(0, array.length + 1)
❌ Finding last element with array[array.length] instead of array[array.length - 1]

Type Coercion Bugs:
❌ if (array.length) when checking if array has elements (empty array is falsy)
❌ == instead of === causing unexpected type coercion
❌ if (value) when value could be 0 or empty string (valid values)
✓ Fix: Use === and explicit checks (array.length > 0, value !== undefined)

Incorrect Async Handling:
❌ async function without await, causing unhandled promise
❌ Missing .catch() on promises
❌ Not returning promise from async function
❌ Promise in loop without await or Promise.all()
❌ Race conditions from concurrent modifications

Wrong Operators/Methods:
❌ Assignment in condition: if (x = 5) instead of if (x === 5)
❌ Using find() to get index (returns element, not index — use findIndex())
❌ Using map() when you need forEach() (map creates new array, wasting memory)
❌ Modifying array while iterating (use filter/map for immutable operations)

Logical Errors:
❌ Wrong condition operators: && instead of ||, ! placed incorrectly
❌ Early returns causing unreachable code
❌ Switch fallthrough without break (when not intentional)
❌ Incorrect date/time calculations (timezone issues, leap years)

─────────────────────────────────────────────────────────────────────────

2. **PERFORMANCE PROBLEMS**

DATABASE PERFORMANCE:

N+1 Queries (CRITICAL):
❌ Loop calling database for each item
Example:
for (const order of orders) {
  const user = await User.findById(order.userId); // N queries
}
✓ Fix: Fetch all users in single query, use Map for O(1) lookup

Missing Indexes:
❌ Filtering/joining on columns without indexes
❌ Queries with WHERE, JOIN, ORDER BY on unindexed columns
✓ Impact: 10-100x slower queries as data grows

Inefficient Queries:
❌ SELECT * when only need 2-3 columns
❌ Loading entire table when only need count/aggregation
❌ Not using database aggregations (SUM, COUNT, AVG) — doing in-memory
❌ Fetching related data not needed for current operation

ALGORITHM PERFORMANCE:

O(n²) When Better Exists:
❌ Nested loops checking if item exists: for...for...if (use Set/Map)
❌ Repeatedly sorting same data in loop (sort once outside)
❌ Array.find() inside loop (build Map/Set first for O(1) lookup)
✓ Fix: Use appropriate data structures

Redundant Computations:
❌ Same calculation repeated in loop (move outside)
❌ Recomputing derived values instead of caching
❌ Regex compiled on every iteration (compile once)

Inefficient Data Structures:
❌ Using Array when Set/Map needed (O(n) vs O(1) lookup)
❌ Using object as map when Map provides better performance
❌ Linear search when binary search possible

MEMORY ISSUES:

Memory Leaks:
❌ addEventListener without removeEventListener
❌ setInterval/setTimeout without clear
❌ Closures retaining large objects unnecessarily
❌ Growing arrays/caches without size limits
❌ Event emitters with listeners never removed

Loading Large Data:
❌ fs.readFileSync() loading entire file into memory
❌ Not using streams for large files
❌ Loading all database records at once (use pagination/cursors)
❌ Keeping large responses in memory when can be streamed

ASYNC PERFORMANCE:

Sequential When Can Be Parallel:
❌ await in loop when operations are independent
Example:
for (const id of ids) {
  const result = await fetchData(id); // Sequential, slow
}
✓ Fix: const results = await Promise.all(ids.map(id => fetchData(id)));

Blocking Operations:
❌ fs.readFileSync() on main thread
❌ Synchronous crypto operations
❌ Large computations without yielding
❌ Not using worker threads for CPU-intensive tasks

No Connection Pooling:
❌ Creating new database connection per request
❌ Not reusing HTTP connections (use keep-alive)

─────────────────────────────────────────────────────────────────────────

3. **ERROR HANDLING**

Silent Failures:
❌ Empty catch blocks: try { ... } catch(e) { }
❌ Catching errors without logging
❌ Promise .catch() that doesn't propagate error
❌ Returning success when operation actually failed

Missing Error Handling:
❌ No try-catch around async operations
❌ Unhandled promise rejections
❌ No error handling on event emitters
❌ External API calls without error handling

Poor Error Messages:
❌ Throwing strings: throw "error" (use Error objects)
❌ Generic errors: throw new Error("Failed") without context
❌ Exposing internal errors to users: res.send(error.stack)
❌ Not including relevant IDs/context in error messages

Not Validating External Data:
❌ Using API response without checking structure
❌ Assuming database query returns results
❌ Not validating file uploads before processing
❌ Trusting user input without validation

─────────────────────────────────────────────────────────────────────────

4. **DATA INTEGRITY**

Missing Transactions:
❌ Multiple database writes without transaction
❌ Not rolling back on partial failure
❌ Updating multiple records without atomicity
Example:
await debitAccount(fromId, amount);  // If next line fails, money is lost
await creditAccount(toId, amount);
✓ Fix: Wrap in transaction with rollback

Inconsistent State:
❌ Updating cache but not database
❌ Updating database but not cache
❌ Multiple sources of truth that can desync
❌ Not invalidating related caches

Missing Validation:
❌ Saving to database without validation
❌ Accepting any input shape without schema validation
❌ No checks for required fields
❌ Not validating data types before operations

Concurrent Update Issues:
❌ Read-modify-write without locking
❌ No optimistic/pessimistic locking
❌ No version checking for updates
❌ Race conditions in counter increments

─────────────────────────────────────────────────────────────────────────

5. **RESOURCE LEAKS**

Unclosed Resources:
❌ Database connections not closed in finally block
❌ File handles left open after errors
❌ HTTP connections not properly closed
❌ WebSocket connections not cleaned up

Timers Not Cleared:
❌ setInterval() without clearInterval()
❌ setTimeout() not cleared on component unmount
❌ Recurring jobs not stopped on shutdown

Event Listeners:
❌ Adding listeners in loop without removing
❌ Not cleaning up DOM event listeners
❌ Event emitters with growing listener count
❌ SSE/Stream endpoints not handling client disconnect: req.on('close') missing
❌ Res.write() calls continuing after connection closed

Async Handler Bugs:
❌ Express/Route handlers without try-catch (unless using express-async-errors)
❌ Not calling properties like next(err) in async catch blocks
❌ "UnhandledPromiseRejection" prone patterns in middleware

─────────────────────────────────────────────────────────────────────────

6. **API DESIGN FLAWS**

Inconsistent Responses:
❌ Sometimes returning { data }, sometimes returning data directly
❌ Inconsistent error format across endpoints
❌ Different status codes for same error types

Missing Validation:
❌ No input validation on API endpoints
❌ Accepting any content-type without checking
❌ Not validating required parameters
❌ No rate limiting on expensive endpoints

Poor Typing:
❌ Using 'any' extensively
❌ Functions returning different types based on conditions
❌ Not defining clear interfaces for API contracts
❌ Implicit types that should be explicit

─────────────────────────────────────────────────────────────────────────

7. **HIGH-IMPACT IMPROVEMENTS**

Only suggest if it meets ONE of these criteria:
✓ Reduces cyclomatic complexity by 50%+ (measurable with tool)
✓ Eliminates 5+ instances of duplicated code
✓ Prevents entire class of bugs (e.g., making invalid states impossible)
✓ Improves performance by 5x+ (with evidence)
✓ Makes currently untestable code testable

Examples of GOOD suggestions:
- Replacing 100-line switch with strategy pattern + dependency injection
- Extracting duplicated validation logic into reusable schema validator
- Using TypeScript discriminated unions to eliminate runtime type checks
- Replacing nested callbacks with async/await (readability + error handling)

Examples of BAD suggestions (don't report):
- "Split this function into smaller functions" without complexity metrics
- "Use more descriptive variable names" (style)
- "Add comments" (not code quality)
- "Move this to a separate file" (organization preference)

═══════════════════════════════════════════════════════════════════════════
SEVERITY LEVELS
═══════════════════════════════════════════════════════════════════════════

HIGH (Causes production crashes, data loss, or >10x performance degradation):
- Null pointer exceptions in common code paths
- Data corruption from race conditions or missing transactions
- Memory leaks causing crashes in production
- N+1 queries causing 10x+ slower response times
- Unhandled promise rejections crashing Node.js process
- SQL injection or security vulnerabilities
- Infinite loops or unbounded recursion

MEDIUM (Incorrect results in some cases, or 2-5x performance hit):
- Logic errors affecting edge cases (empty arrays, boundary values)
- Inefficient algorithms (O(n²)) used on large datasets
- Missing validation causing bad data in database
- Error handling that hides important issues
- Resource leaks that accumulate over time
- API inconsistencies causing client errors

LOW (Maintainability issues, minor performance, or rarely-hit bugs):
- Code duplication making maintenance difficult
- Minor performance improvements (1.5x faster)
- Unclear error messages hampering debugging
- Edge case bugs in rarely-used features
- Missing types making refactoring risky

═══════════════════════════════════════════════════════════════════════════
RESPONSE FORMAT
═══════════════════════════════════════════════════════════════════════════

Return ONLY this JSON structure. No markdown code blocks (no \`\`\`json).

{
  "issues": [
    {
      "severity": "HIGH",
      "category": "performance",
      "file": "src/services/orderService.ts",
      "line": 87,
      "title": "N+1 query fetching user for each order",
      "description": "The getOrders function loops through orders (line 87-92) and calls User.findById() for each order. With 100 orders, this executes 101 database queries (1 for orders + 100 for users). Each query takes ~8ms, totaling 808ms.",
      "impact": "API endpoint GET /api/orders takes 850ms with 100 orders (measured). Should take <50ms. Under load, database connection pool gets exhausted causing timeouts and 504 errors.",
      "fix": "Fetch all users in a single query using WHERE IN clause before the loop. Build a Map for O(1) lookups. This reduces database calls from 101 to 2 queries.",
      "codeExample": "// After fetching orders\nconst orders = await Order.findAll();\n\n// Get unique user IDs\nconst userIds = [...new Set(orders.map(o => o.userId))];\n\n// Single query for all users\nconst users = await User.findAll({\n  where: { id: userIds }\n});\n\n// Build lookup map\nconst userMap = new Map(users.map(u => [u.id, u]));\n\n// O(1) lookup instead of N queries\norders.forEach(order => {\n  order.user = userMap.get(order.userId);\n});"
    }
  ],
  "summary": "Found 2 HIGH, 4 MEDIUM, 1 LOW issues across 6 files",
  "filesScanned": 6
}

If no issues found, return:
{
  "issues": [],
  "summary": "No significant issues detected",
  "filesScanned": 0
}

═══════════════════════════════════════════════════════════════════════════
CRITICAL RULES
═══════════════════════════════════════════════════════════════════════════

1. **MEASURABLE IMPACT**: Include actual numbers
   ✓ "Response time increases from 50ms to 850ms"
   ✓ "Memory usage grows 10MB per hour, crashes after 8 hours"
   ✗ "Performance will be slow"

2. **EXACT REFERENCES**: Must reference actual code from the provided files
   ✓ "Line 87: for (const order of orders) { await User.findById(order.userId) }"
   ✗ "There might be N+1 queries somewhere"

3. **WORKING CODE EXAMPLES**: Provide complete, runnable code
   ✓ Include all necessary imports, variables, and context
   ✗ Pseudo-code or incomplete snippets

4. **100% CONFIDENCE**: Only report if certain
   ✓ "This loop will crash when array is empty"
   ✗ "This might cause issues if the array is empty"

5. **VALID JSON**: Properly escape special characters
   - Quotes: \\"
   - Newlines: \\n
   - Backslashes: \\\\
   - No trailing commas
   - All strings properly quoted

6. **NO STYLE ISSUES**: Focus on functional problems
   ✗ "Variable should be named 'userData' instead of 'data'"
   ✗ "This file is too long"
   ✗ "Add more comments"

7. **CONTEXT AWARENESS**: 
   - Assume imports exist unless proven missing in provided code
   - Don't report framework-specific patterns as bugs
   - Consider the full code path, not isolated lines

8. **SEVERITY ACCURACY**: Use the definitions above
   - Don't inflate LOW to HIGH for visibility
   - Don't downgrade HIGH to MEDIUM to seem balanced

═══════════════════════════════════════════════════════════════════════════
OUTPUT CONSTRAINTS
═══════════════════════════════════════════════════════════════════════════

- "severity": Must be exactly "HIGH", "MEDIUM", or "LOW" (no other values)
- "category": Must be "bug", "performance", "error-handling", "data-integrity", "resource-leak", or "improvement"
- "line": Must be a positive integer (use first line if spans multiple lines)
- "title": Maximum 100 characters, no special formatting
- "description": Must reference specific code elements (function names, variable names, line numbers from the provided code)
- "impact": Must include measurable consequences (numbers, specific errors, failure scenarios)
- "fix": Clear step-by-step instructions
- "codeExample": Must be valid, runnable code in the correct programming language with proper syntax
- "summary": Brief overview in format "Found X HIGH, Y MEDIUM, Z LOW issues across N files"

Begin code analysis now. Output ONLY valid JSON with no markdown formatting.`;

const PRIORITY_3_PROMPT = `You are a code quality expert focused on maintainability, readability, and developer experience. You help teams write code that's easy to understand, test, and extend.

TASK: Review this supporting code for quality improvements.

💡 QUALITY ASPECTS TO REVIEW:
1. **Readability** - Naming, formatting, complexity, comments
   - ⚠️ IGNORE nitpicky style issues (quotes, spacing, semicolons) - rely on the user's linter for that.
2. **DRY Violations** - Duplicated code that should be abstracted
3. **Code Organization** - File structure, module boundaries, separation of concerns
4. **Documentation** - Missing or outdated docs, unclear interfaces
5. **Modern Practices** - Outdated patterns, deprecated APIs, newer alternatives
6. **Testability** - Hard to test code, missing test coverage opportunities

RESPONSE FORMAT (JSON only):
{
  "issues": [
    {
      "severity": "MEDIUM|LOW",
      "category": "quality",
      "file": "exact/path/to/file.ext",
      "line": 42,
      "title": "Improvement suggestion",
      "description": "What could be better",
      "fix": "Recommended change",
      "codeExample": "// Cleaner version"
    }
  ]
}

RULES:
- Focus on TOP 5-10 most impactful improvements
- Be constructive, not nitpicky
- Prioritize changes that improve maintainability
- If code is well-written, acknowledge it with { "issues": [] }
- Respond with ONLY valid JSON, no markdown`;

function getPromptForPriority(priority: PriorityLevel): string {
    switch (priority) {
        case 1:
            return PRIORITY_1_PROMPT;
        case 2:
            return PRIORITY_2_PROMPT;
        case 3:
            return PRIORITY_3_PROMPT;
    }
}

/**
 * Format files for the AI prompt
 */
function formatFilesForPrompt(files: FileContent[]): string {
    return files
        .map(f => `=== FILE: ${f.path} ===\n${f.content}\n`)
        .join('\n');
}

/**
 * Parse issues from DeepSeek response
 */
function parseIssuesFromResponse(response: string): AnalysisIssue[] {
    try {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : response.trim();

        const parsed = JSON.parse(jsonStr);

        if (!parsed.issues || !Array.isArray(parsed.issues)) {
            return [];
        }

        // Validate and normalize each issue
        return parsed.issues.map((issue: any, index: number) => ({
            id: `issue-${Date.now()}-${index}`,
            severity: (['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(issue.severity)
                ? issue.severity
                : 'MEDIUM') as AnalysisIssue['severity'],
            category: (['security', 'bug', 'performance', 'quality'].includes(issue.category)
                ? issue.category
                : 'quality') as AnalysisIssue['category'],
            file: issue.file || 'unknown',
            line: typeof issue.line === 'number' ? issue.line : undefined,
            title: issue.title || 'Issue found',
            description: issue.description || '',
            impact: issue.impact,
            fix: issue.fix || issue.suggestedFix,
            codeExample: issue.codeExample || issue.code_example,
        }));
    } catch (error) {
        logger.error('Failed to parse DeepSeek response', { error, response: response.substring(0, 500) });
        return [];
    }
}

/**
 * Analyze files with DeepSeek AI (non-streaming)
 */
export async function analyzeFiles(
    files: FileContent[],
    apiKey: string,
    priority: PriorityLevel
): Promise<{
    issues: AnalysisIssue[];
    inputTokens: number;
    outputTokens: number;
    cost: number;
}> {
    const systemPrompt = getPromptForPriority(priority);
    const filesContent = formatFilesForPrompt(files);

    const userMessage = `Analyze the following ${files.length} files:\n\n${filesContent}`;

    // Estimate input tokens
    const inputTokens = estimateTokens(systemPrompt) + estimateTokens(userMessage);

    logger.info(`Sending ${files.length} files to DeepSeek (Priority ${priority})`, {
        estimatedInputTokens: inputTokens
    });

    const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
            temperature: 0.3,
            max_tokens: 8000,  // Increased from 4000 to prevent truncation
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        logger.error('DeepSeek API error', { status: response.status, error: errorText });

        if (response.status === 401) {
            throw new Error('Invalid DeepSeek API key');
        }
        if (response.status === 429) {
            throw new Error('DeepSeek rate limit exceeded. Please wait and try again.');
        }
        throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data: any = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const usage = data.usage || {};

    const actualInputTokens = usage.prompt_tokens || inputTokens;
    const actualOutputTokens = usage.completion_tokens || estimateTokens(content);
    const cost = calculateCost(actualInputTokens, actualOutputTokens);

    const issues = parseIssuesFromResponse(content);

    logger.info(`DeepSeek analysis complete`, {
        priority,
        issuesFound: issues.length,
        tokens: { input: actualInputTokens, output: actualOutputTokens },
        cost,
    });

    return {
        issues,
        inputTokens: actualInputTokens,
        outputTokens: actualOutputTokens,
        cost,
    };
}

/**
 * Stream analysis from DeepSeek with real-time updates
 * Yields partial content as it streams
 */
export async function* streamAnalysis(
    files: FileContent[],
    apiKey: string,
    priority: PriorityLevel
): AsyncGenerator<{ type: 'chunk' | 'complete'; content?: string; issues?: AnalysisIssue[]; inputTokens?: number; outputTokens?: number; cost?: number }> {
    const systemPrompt = getPromptForPriority(priority);
    const filesContent = formatFilesForPrompt(files);

    const userMessage = `Analyze the following ${files.length} files:\n\n${filesContent}`;

    const inputTokens = estimateTokens(systemPrompt) + estimateTokens(userMessage);

    logger.info(`Starting streaming analysis (Priority ${priority})`, {
        files: files.length,
        estimatedInputTokens: inputTokens
    });

    const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage },
            ],
            temperature: 0.3,
            max_tokens: 8000,  // Increased from 4000 to prevent truncation
            stream: true,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();

        if (response.status === 401) {
            throw new Error('Invalid DeepSeek API key');
        }
        if (response.status === 429) {
            throw new Error('DeepSeek rate limit exceeded. Please wait and try again.');
        }
        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error('Failed to get response stream');
    }

    const decoder = new TextDecoder();
    let fullContent = '';

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

            for (const line of lines) {
                const data = line.replace('data:', '').trim();

                if (data === '[DONE]') continue;

                try {
                    const parsed: DeepSeekStreamChunk = JSON.parse(data);
                    // Handle both regular content and reasoning_content (from Reasoner model)
                    const content = parsed.choices?.[0]?.delta?.content || '';
                    const reasoningContent = (parsed.choices?.[0]?.delta as any)?.reasoning_content || '';

                    // Log reasoning for debugging (optional)
                    if (reasoningContent) {
                        logger.debug('Reasoner thinking', { snippet: reasoningContent.substring(0, 100) });
                    }

                    if (content) {
                        fullContent += content;
                        yield { type: 'chunk', content };
                    }
                } catch (e) {
                    // Skip invalid JSON chunks
                }
            }
        }
    } finally {
        reader.releaseLock();
    }

    // Parse final response
    const issues = parseIssuesFromResponse(fullContent);
    const outputTokens = estimateTokens(fullContent);
    const cost = calculateCost(inputTokens, outputTokens);

    yield {
        type: 'complete',
        issues,
        inputTokens,
        outputTokens,
        cost,
    };
}

/**
 * Validate a DeepSeek API key
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: 'user', content: 'Hi' }],
                max_tokens: 1,
            }),
        });

        return response.ok || response.status === 429; // 429 means key is valid but rate limited
    } catch {
        return false;
    }
}
