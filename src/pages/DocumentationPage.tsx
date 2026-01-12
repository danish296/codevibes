import { ArrowLeft, Github, ExternalLink, Shield, Zap, Target, Code2, Sparkles, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function DocumentationPage() {
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

                    {/* Header */}
                    <div className="mb-12 animate-slide-up">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
                        <p className="text-lg text-muted-foreground">
                            Everything you need to know about CodeVibes - the open-source AI code analysis tool.
                        </p>
                    </div>

                    {/* About Section */}
                    <section className="mb-12 animate-fade-in">
                        <div className="flex justify-center mb-6">
                            <img src="/logo.png" alt="CodeVibes Logo" className="w-24 h-24 rounded-2xl shadow-lg" />
                        </div>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            About CodeVibes
                        </h2>
                        <div className="prose prose-invert max-w-none">
                            <p className="text-muted-foreground leading-relaxed">
                                CodeVibes is an open-source alternative to CodeRabbit, designed for solo developers and indie hackers
                                who can't afford expensive code review subscriptions. It analyzes GitHub repositories using <strong>DeepSeek v3.2</strong> AI
                                with a priority-based scanning system to save tokens and costs.
                            </p>
                        </div>
                    </section>

                    {/* Creator Section */}
                    <section className="mb-12 p-6 rounded-xl border border-border bg-card animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Code2 className="w-6 h-6 text-primary" />
                            Created By
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary">DA</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold">Danish Akhtar</h3>
                                <a
                                    href="https://github.com/danish296"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Github className="w-4 h-4" />
                                    github.com/danish296
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Version Info */}
                    <section className="mb-12 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Target className="w-6 h-6 text-primary" />
                            Version Information
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 rounded-xl border border-border bg-card">
                                <div className="text-sm text-muted-foreground mb-1">Current Version</div>
                                <div className="text-2xl font-mono font-bold text-primary">1.0.2-beta</div>
                            </div>
                            <div className="p-4 rounded-xl border border-border bg-card">
                                <div className="text-sm text-muted-foreground mb-1">Release Date</div>
                                <div className="text-2xl font-mono font-bold">January 2026</div>
                            </div>
                        </div>
                    </section>

                    {/* Upcoming Features */}
                    <section className="mb-12 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-6 h-6 text-primary" />
                            Roadmap & Upcoming Features
                        </h2>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                                <Zap className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="font-semibold">Autonomous Coder Mode</h4>
                                    <p className="text-sm text-muted-foreground">AI-powered automatic code fixes. Review issues and approve fixes with one click.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                                <Zap className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="font-semibold">Multi-Model Support</h4>
                                    <p className="text-sm text-muted-foreground">Currently using DeepSeek v3.2. Upcoming support for GPT-4, Claude, Gemini, and local models via Ollama.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                                <Zap className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="font-semibold">GitHub Integration</h4>
                                    <p className="text-sm text-muted-foreground">Direct PR comments, automated review workflows, and webhook triggers.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                                <Zap className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="font-semibold">VS Code Extension</h4>
                                    <p className="text-sm text-muted-foreground">Analyze code directly from your editor with inline annotations.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                                <Zap className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <h4 className="font-semibold">Team Collaboration</h4>
                                    <p className="text-sm text-muted-foreground">Share analysis results, track issues, and collaborate with your team.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Start */}
                    <section className="mb-12 animate-fade-in">
                        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
                        <div className="p-6 rounded-xl border border-border bg-card">
                            <ol className="space-y-4">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">1</span>
                                    <div>
                                        <p className="font-medium">Get a DeepSeek API Key</p>
                                        <p className="text-sm text-muted-foreground">Visit <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">platform.deepseek.com</a> to create an account and get your API key.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">2</span>
                                    <div>
                                        <p className="font-medium">Add Your API Key</p>
                                        <p className="text-sm text-muted-foreground">Go to Settings (gear icon) and paste your DeepSeek API key.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">3</span>
                                    <div>
                                        <p className="font-medium">Analyze a Repository</p>
                                        <p className="text-sm text-muted-foreground">Enter any public GitHub repository URL and click "Start Analysis".</p>
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">4</span>
                                    <div>
                                        <p className="font-medium">Review & Approve</p>
                                        <p className="text-sm text-muted-foreground">Review Priority 1 results, then approve to continue to Priority 2 and 3.</p>
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="flex justify-center gap-4 pt-8">
                        <Button asChild className="bg-primary hover:bg-primary/90">
                            <Link to="/analyze">Start Analyzing</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link to="/api-reference">API Reference</Link>
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
