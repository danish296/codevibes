import { ArrowLeft, Copy, Check, Terminal, Globe, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useState } from 'react';
import { toast } from 'sonner';

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative rounded-lg border border-border bg-background/50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
                <span className="text-xs text-muted-foreground font-mono">{language}</span>
                <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 px-2">
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
            </div>
            <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">{code}</code>
            </pre>
        </div>
    );
}

export default function ApiReferencePage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Back Button */}
                    <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    {/* Coming Soon Banner */}
                    <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <img src="/logo.png" alt="CodeVibes Logo" className="w-16 h-16 rounded-xl" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold tracking-wider uppercase text-primary">Coming Soon</span>
                                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">v2.0</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Public API access is coming in a future release. Currently for internal use only.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="mb-12 animate-slide-up">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">API Reference</h1>
                        <p className="text-lg text-muted-foreground">
                            Complete API documentation for integrating CodeVibes into your workflow.
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                            <Globe className="w-4 h-4" />
                            <span>Base URL:</span>
                            <code className="px-2 py-1 rounded bg-muted font-mono">http://localhost:3001</code>
                        </div>
                    </div>

                    {/* Health Check */}
                    <section className="mb-12 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-green-500" />
                            Health Check
                        </h2>
                        <div className="p-4 rounded-xl border border-border bg-card mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-mono font-bold">GET</span>
                                <code className="font-mono text-sm">/api/health</code>
                            </div>
                            <p className="text-sm text-muted-foreground">Check if the API server is running.</p>
                        </div>
                        <CodeBlock language="bash" code={`curl http://localhost:3001/api/health`} />
                        <p className="text-sm text-muted-foreground mt-4">Response:</p>
                        <CodeBlock language="json" code={`{
  "status": "ok",
  "timestamp": "2026-01-12T00:00:00.000Z",
  "version": "1.0.2"
}`} />
                    </section>

                    {/* Validate Repository */}
                    <section className="mb-12 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-500" />
                            Validate Repository
                        </h2>
                        <div className="p-4 rounded-xl border border-border bg-card mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-mono font-bold">POST</span>
                                <code className="font-mono text-sm">/api/validate-repo</code>
                            </div>
                            <p className="text-sm text-muted-foreground">Validate a GitHub repository URL and get metadata.</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Request Body:</p>
                        <CodeBlock language="json" code={`{
  "repoUrl": "https://github.com/facebook/react"
}`} />
                        <p className="text-sm text-muted-foreground mt-4 mb-2">Response:</p>
                        <CodeBlock language="json" code={`{
  "valid": true,
  "owner": "facebook",
  "name": "react",
  "fullName": "facebook/react",
  "description": "A declarative, efficient JavaScript library",
  "stars": 230000,
  "language": "JavaScript",
  "lastUpdate": "2026-01-05T00:00:00Z",
  "defaultBranch": "main",
  "isPrivate": false
}`} />
                    </section>

                    {/* Get Estimate */}
                    <section className="mb-12 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-yellow-500" />
                            Get Cost Estimate
                        </h2>
                        <div className="p-4 rounded-xl border border-border bg-card mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-mono font-bold">GET</span>
                                <code className="font-mono text-sm">/api/estimate?repoUrl=...</code>
                            </div>
                            <p className="text-sm text-muted-foreground">Get file counts and estimated cost per priority level.</p>
                        </div>
                        <CodeBlock language="bash" code={`curl "http://localhost:3001/api/estimate?repoUrl=https://github.com/expressjs/express"`} />
                        <p className="text-sm text-muted-foreground mt-4 mb-2">Response:</p>
                        <CodeBlock language="json" code={`{
  "repoInfo": {
    "owner": "expressjs",
    "name": "express",
    "stars": 65000
  },
  "priority1": {
    "files": 3,
    "estimatedTokens": 1500,
    "estimatedCost": 0.00021
  },
  "priority2": {
    "files": 15,
    "estimatedTokens": 7500,
    "estimatedCost": 0.00105
  },
  "priority3": {
    "files": 42,
    "estimatedTokens": 21000,
    "estimatedCost": 0.00294
  },
  "totalFiles": 60,
  "totalEstimatedTokens": 30000,
  "totalEstimatedCost": 0.0042
}`} />
                    </section>

                    {/* Analyze */}
                    <section className="mb-12 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-primary" />
                            Run Analysis (SSE)
                        </h2>
                        <div className="p-4 rounded-xl border border-border bg-card mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-mono font-bold">POST</span>
                                <code className="font-mono text-sm">/api/analyze</code>
                            </div>
                            <p className="text-sm text-muted-foreground">Run AI analysis with Server-Sent Events streaming.</p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Request Body:</p>
                        <CodeBlock language="json" code={`{
  "repoUrl": "https://github.com/owner/repo",
  "apiKey": "your-deepseek-api-key",
  "priority": 1
}`} />

                        <h3 className="text-lg font-semibold mt-8 mb-4">SSE Event Types</h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg border border-border bg-muted/30">
                                <code className="text-primary font-mono">status</code>
                                <p className="text-sm text-muted-foreground mt-1">Progress updates during analysis.</p>
                                <CodeBlock language="json" code={`{
  "type": "status",
  "data": {
    "message": "Analyzing files...",
    "filesScanned": 3,
    "totalFiles": 10
  }
}`} />
                            </div>

                            <div className="p-4 rounded-lg border border-border bg-muted/30">
                                <code className="text-red-400 font-mono">issue</code>
                                <p className="text-sm text-muted-foreground mt-1">Each issue found during analysis.</p>
                                <CodeBlock language="json" code={`{
  "type": "issue",
  "data": {
    "id": "issue-123",
    "severity": "CRITICAL",
    "category": "security",
    "file": "src/auth/login.js",
    "line": 42,
    "title": "Hardcoded API key",
    "description": "API key exposed in source",
    "fix": "Use environment variable"
  }
}`} />
                            </div>

                            <div className="p-4 rounded-lg border border-border bg-muted/30">
                                <code className="text-green-400 font-mono">complete</code>
                                <p className="text-sm text-muted-foreground mt-1">Analysis completed for priority level.</p>
                                <CodeBlock language="json" code={`{
  "type": "complete",
  "data": {
    "priority": 1,
    "filesScanned": 10,
    "issuesFound": 3,
    "tokensUsed": 5000,
    "cost": 0.0007
  }
}`} />
                            </div>

                            <div className="p-4 rounded-lg border border-border bg-muted/30">
                                <code className="text-yellow-400 font-mono">error</code>
                                <p className="text-sm text-muted-foreground mt-1">Error occurred during analysis.</p>
                                <CodeBlock language="json" code={`{
  "type": "error",
  "data": {
    "message": "Invalid API key",
    "code": "INVALID_API_KEY",
    "retryable": false
  }
}`} />
                            </div>
                        </div>
                    </section>

                    {/* Error Codes */}
                    <section className="mb-12 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4">Error Codes</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="text-left py-3 px-4 font-semibold">Code</th>
                                        <th className="text-left py-3 px-4 font-semibold">HTTP</th>
                                        <th className="text-left py-3 px-4 font-semibold">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4 font-mono text-xs">INVALID_URL</td>
                                        <td className="py-3 px-4">400</td>
                                        <td className="py-3 px-4 text-muted-foreground">GitHub URL format is invalid</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4 font-mono text-xs">REPO_NOT_FOUND</td>
                                        <td className="py-3 px-4">404</td>
                                        <td className="py-3 px-4 text-muted-foreground">Repository does not exist or is private</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4 font-mono text-xs">INVALID_API_KEY</td>
                                        <td className="py-3 px-4">401</td>
                                        <td className="py-3 px-4 text-muted-foreground">DeepSeek API key is invalid</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4 font-mono text-xs">RATE_LIMITED</td>
                                        <td className="py-3 px-4">429</td>
                                        <td className="py-3 px-4 text-muted-foreground">Too many requests, try again later</td>
                                    </tr>
                                    <tr className="border-b border-border/50">
                                        <td className="py-3 px-4 font-mono text-xs">PRIVATE_REPO</td>
                                        <td className="py-3 px-4">403</td>
                                        <td className="py-3 px-4 text-muted-foreground">Private repositories not supported</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="flex justify-center gap-4 pt-8">
                        <Button asChild className="bg-primary hover:bg-primary/90">
                            <Link to="/analyze">Try It Now</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link to="/documentation">Documentation</Link>
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
