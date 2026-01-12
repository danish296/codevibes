import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Calendar, Plus, Wrench, Check, Rocket, ArrowLeft, GitBranch } from 'lucide-react';

// Changelog data - add new entries at the top
const changelogData = [
    {
        version: 'v1.0.2-beta',
        date: 'January 12, 2026',
        title: 'Security & Reliability Hardening',
        description: 'Critical security coverage expansion and stability improvements for async operations.',
        changes: [
            {
                type: 'improved',
                title: 'Enhanced Secret Detection',
                description: 'Expanded detection for AWS (AKIA/ASIA), Stripe (Restricted/Live), Slack, Google Cloud, and high-entropy generic secrets.',
            },
            {
                type: 'added',
                title: 'Live Key Classification',
                description: 'introduced CRITICAL severity classification for detected live API keys to prioritize immediate remediation.',
            },
            {
                type: 'fixed',
                title: 'Async Stability',
                description: 'Added automated detection for unhandled async errors in Express routes and missing SSE cleanup handlers.',
            },
            {
                type: 'improved',
                title: 'Documentation & API',
                description: 'Minor documentation and API route updates to align with v1.0.2 release.',
            },
        ],
    },
    {
        version: 'v1.0.1-beta',
        date: 'January 10, 2026',
        title: 'Community & Transparency Updates',
        description: 'Major improvements focused on community trust, transparency, and user feedback integration.',
        changes: [
            {
                type: 'added',
                title: 'Homepage FAQ',
                description: 'Added a comprehensive FAQ section addressing common questions about language support, privacy, and pricing.',
            },
            {
                type: 'added',
                title: 'Community Reviews',
                description: 'Highlighted genuine feedback from the developer community (Reddit) directly on the homepage.',
            },
            {
                type: 'added',
                title: 'Trust Indicators',
                description: 'Added visual trust signals (Encryption, Privacy Policy, Open Source) to the Hero section to reassure users.',
            },
            {
                type: 'improved',
                title: 'Navigation Layout',
                description: 'Updated main navigation to replace "API" with "CHANGELOG", making platform updates more accessible.',
            },
        ],
    },
    {
        version: 'v1.0.0-beta.2',
        date: 'January 7, 2026',
        title: 'Performance Optimizations',
        description: 'Aggressive speed optimizations for file fetching and categorization without affecting AI analysis accuracy.',
        changes: [
            {
                type: 'improved',
                title: 'Parallel File Fetching',
                description: 'Implemented concurrent file fetching (5 files at once) reducing fetch time from 4-6 seconds to 1-2 seconds for 20 files.',
            },
            {
                type: 'added',
                title: 'Categorization Caching',
                description: 'Added intelligent caching for file categorization results. P2 and P3 estimates now return in ~10ms (35x faster).',
            },
            {
                type: 'improved',
                title: 'Overall Analysis Speed',
                description: 'Full P1→P2→P3 analysis reduced from ~10s to ~3-4s (approximately 3x faster).',
            },
        ],
    },
    {
        version: 'v1.0.0-beta',
        date: 'January 6, 2026',
        title: 'Initial Beta Release',
        description: 'First public beta release of CodeVibes with core analysis features.',
        changes: [
            {
                type: 'added',
                title: 'Priority-Based Scanning',
                description: 'Three-tier analysis system (P1: Security, P2: Bugs & Performance, P3: Quality).',
            },
            {
                type: 'added',
                title: 'GitHub OAuth Integration',
                description: 'Secure authentication via GitHub OAuth for accessing private repositories.',
            },
            {
                type: 'added',
                title: 'Vibe Score System',
                description: 'Comprehensive code health scoring (0-100) based on issue severity and density.',
            },
        ],
    },
];

const getChangeIcon = (type: string) => {
    switch (type) {
        case 'added':
            return <Plus className="w-3.5 h-3.5" />;
        case 'fixed':
            return <Check className="w-3.5 h-3.5" />;
        case 'improved':
            return <Wrench className="w-3.5 h-3.5" />;
        default:
            return <Rocket className="w-3.5 h-3.5" />;
    }
};

const getChangeStyle = (type: string) => {
    switch (type) {
        case 'added':
            return { bg: 'bg-green-500', text: 'text-green-500', label: 'Added' };
        case 'fixed':
            return { bg: 'bg-blue-500', text: 'text-blue-500', label: 'Fixed' };
        case 'improved':
            return { bg: 'bg-amber-500', text: 'text-amber-500', label: 'Improved' };
        default:
            return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Changed' };
    }
};

export default function ChangelogPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 py-16 lg:py-24">
                <div className="container mx-auto px-4 max-w-3xl">
                    {/* Hero */}
                    <div className="mb-12">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Calendar className="w-4 h-4" />
                            <span>Product Updates</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
                            Changelog
                        </h1>
                        <p className="text-muted-foreground">
                            Track the evolution of CodeVibes. New features, improvements, and fixes.
                        </p>
                    </div>

                    {/* Changelog Entries */}
                    <div className="space-y-12">
                        {changelogData.map((release, releaseIndex) => (
                            <article key={release.version} className="relative">
                                {/* Version Header */}
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-sm font-mono font-semibold">
                                        {release.version}
                                    </span>
                                    <span className="text-sm text-muted-foreground">{release.date}</span>
                                </div>

                                {/* Release Card */}
                                <div className="p-6 rounded-xl border border-border bg-card">
                                    <h2 className="text-xl font-semibold mb-2">{release.title}</h2>
                                    <p className="text-muted-foreground text-sm mb-6">{release.description}</p>

                                    {/* Changes List */}
                                    <div className="space-y-4">
                                        {release.changes.map((change, changeIndex) => {
                                            const style = getChangeStyle(change.type);
                                            return (
                                                <div
                                                    key={changeIndex}
                                                    className="flex gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                                >
                                                    {/* Icon */}
                                                    <div className={`flex-shrink-0 w-6 h-6 rounded-md ${style.bg} flex items-center justify-center text-white`}>
                                                        {getChangeIcon(change.type)}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`text-xs font-medium ${style.text}`}>{style.label}</span>
                                                            <span className="text-xs text-muted-foreground">•</span>
                                                            <h3 className="font-medium text-sm">{change.title}</h3>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                            {change.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Separator */}
                                {releaseIndex < changelogData.length - 1 && (
                                    <div className="mt-12 border-t border-border/50" />
                                )}
                            </article>
                        ))}
                    </div>

                    {/* Subscribe CTA */}
                    <div className="mt-16 p-6 rounded-xl border border-border bg-muted/30 text-center">
                        <h3 className="font-semibold mb-2">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Star our GitHub repository to get notified about new releases.
                        </p>
                        <a
                            href="https://github.com/danish296/codevibes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground text-background hover:bg-foreground/90 text-sm font-medium transition-colors"
                        >
                            <GitBranch className="w-4 h-4" />
                            Star on GitHub
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
