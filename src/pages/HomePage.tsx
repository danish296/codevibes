import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, ArrowRight, Shield, Zap, Coins, FileText, Play, ChevronLeft, ChevronRight, Lock, EyeOff, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { useAnalysisStore } from '@/store/analysisStore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const features = [
  {
    icon: Shield,
    title: 'Priority Scanning',
    description: 'Security files first, then core logic, then everything else. Stop anytime with full visibility into what gets scanned.',
  },
  {
    icon: Zap,
    title: 'Security First',
    description: 'Identifies secrets, auth vulnerabilities, and security anti-patterns before you ship to production.',
  },
  {
    icon: Coins,
    title: 'Token Efficient',
    description: 'See estimated costs upfront. Approve each scan tier to control your API usage and spending.',
  },
  {
    icon: FileText,
    title: 'Export Reports',
    description: 'Download your analysis as markdown. Share with your team or keep for documentation.',
  },
];

const steps = [
  {
    step: 1,
    title: 'Connect & Configure',
    description: 'Paste your repository URL. Optionally add your GitHub token for private repos. We validate access instantly.'
  },
  {
    step: 2,
    title: 'Smart Priority Scan',
    description: 'Our agents analyze Security files first (P1), then Core Logic (P2), and finally Quality checks (P3). You get results in streams.'
  },
  {
    step: 3,
    title: 'Interactive Report',
    description: 'Get a Vibe Score (0-100). Drill down into Critical issues with AI-suggested fixes. Export to Markdown when done.'
  },
];

const screenshots = [
  { src: '/screenshots/Dashboard.png', alt: 'Dashboard Overview', label: 'Clean, Dark-Mode Dashboard' },
  { src: '/screenshots/Pre-Analysis.png', alt: 'Pre-Analysis View', label: 'Pre-Analysis Configuration' },
  { src: '/screenshots/execution.png', alt: 'Live Analysis', label: 'Real-time Streaming Analysis' },
  { src: '/screenshots/repo.png', alt: 'Repo Selection', label: 'Repository Selection' },
  { src: '/screenshots/Post-analysis.png', alt: 'Post Analysis', label: 'Comprehensive Results View' },
  { src: '/screenshots/Detailed analysis cost and stats.png', alt: 'Stats & Cost', label: 'Detailed Analysis Stats & Cost' },
  { src: '/screenshots/Report-insight.png', alt: 'Report Insights', label: 'AI-Powered Report Insights' },
];

const testimonials = [
  {
    quote: "Comment",
    author: "",
    role: "",
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const { setRepoUrl, apiKey } = useAnalysisStore();
  const { isAuthenticated, login, isLoading } = useAuth();
  const [inputUrl, setInputUrl] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const testimonialInterval = useRef<NodeJS.Timeout | null>(null);

  const validateGitHubUrl = (url: string): boolean => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w.-]+\/[\w.-]+\/?$/;
    return githubRegex.test(url);
  };

  const handleStartAnalysis = () => {
    if (!inputUrl.trim()) {
      toast.error('Please enter a GitHub repository URL');
      return;
    }

    if (!validateGitHubUrl(inputUrl)) {
      toast.error('Invalid GitHub URL', {
        description: 'Enter a valid URL like https://github.com/owner/repo',
      });
      return;
    }

    if (!apiKey) {
      toast.info('API key required', {
        description: 'Set up your DeepSeek API key first',
      });
      setRepoUrl(inputUrl);
      navigate('/setup');
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      // Store pending URL for after login
      localStorage.setItem('pending_analysis_url', inputUrl);
      setShowLoginDialog(true);
      return;
    }

    setRepoUrl(inputUrl);
    navigate('/analyze');
  };

  const handleLoginAndContinue = () => {
    setShowLoginDialog(false);
    login();
  };

  // Auto-advance testimonials
  useEffect(() => {
    testimonialInterval.current = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => {
      if (testimonialInterval.current) clearInterval(testimonialInterval.current);
    };
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Dot matrix background */}
          <div className="absolute inset-0 dot-matrix opacity-30" />

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto animate-slide-up">
              {/* Star on GitHub Banner */}
              <a
                href="https://github.com/danish296/codevibes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 -mt-10 mb-8 rounded-full bg-card/80 border border-yellow-500/50 hover:border-yellow-400 hover:bg-yellow-500/10 transition-all text-sm font-medium backdrop-blur-sm group"
              >
                <Github className="w-4 h-4" />
                <span>Star CodeVibes on GitHub</span>
                <span className="text-yellow-400 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] transition-all">⭐</span>
              </a>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
                AI Code Analysis
                <br />
                <span className="text-muted-foreground">for Developers</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                AI Code Review for Developers Who Can't Afford CodeRabbit.
                <br className="hidden sm:block" />
                Priority-based scanning, pay only for what you use.
              </p>

              {/* GitHub URL Input */}
              <div className="max-w-xl mx-auto mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="url"
                      placeholder="https://github.com/owner/repo"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStartAnalysis()}
                      className="pl-12 h-12 text-base bg-card border-border focus:border-primary"
                    />
                  </div>
                  <Button
                    onClick={handleStartAnalysis}
                    size="lg"
                    className="h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                  >
                    Start Analysis
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>

              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>AES-256 Token Encryption</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                  <EyeOff className="w-3.5 h-3.5 text-primary" />
                  <span>No Code Storage Policy</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10">
                  <Code className="w-3.5 h-3.5 text-primary" />
                  <span>100% Open Source</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 mt-16 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {[
                { value: '100%', label: 'Open Source' },
                { value: '$0.001', label: 'per 1K tokens' },
                { value: '3', label: 'Priority Tiers' },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center flex items-center gap-4">
                  {index > 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary hidden sm:block" />}
                  <div>
                    <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-3">Built for Indie Developers</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                All the features you need, none of the enterprise bloat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <FeatureCard {...feature} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 border-t border-border bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-3">How It Works</h2>
              <p className="text-muted-foreground">Three simple steps to better code</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                {/* Connecting line */}
                <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-0.5 bg-border">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-transparent" style={{ width: '60%' }} />
                </div>

                {steps.map((item) => (
                  <div key={item.step} className="relative flex-1 text-center">
                    <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-card border-2 border-primary mb-4">
                      <span className="text-lg font-bold text-primary">{item.step}</span>
                    </div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Quick Start Guide */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-3">Quick Start Guide</h2>
              <p className="text-muted-foreground">Follow these steps to get your first analysis running</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-2">
                {/* Step 1 */}
                <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Click "Get Started"</h3>
                    <p className="text-sm text-muted-foreground">
                      Navigate to the setup page where you'll configure your API keys for the analysis.
                    </p>
                  </div>
                </div>

                {/* Arrow 1 */}
                <div className="flex justify-center py-1">
                  <div className="text-primary/60 text-2xl">↓</div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Setup API Key & Test Connection</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your DeepSeek API key and click "Test Connection" to verify everything works.
                    </p>
                  </div>
                </div>

                {/* Arrow 2 */}
                <div className="flex justify-center py-1">
                  <div className="text-primary/60 text-2xl">↓</div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Go to Analyze & Login with GitHub</h3>
                    <p className="text-sm text-muted-foreground">
                      Head to the Analyze page, scroll down in the sidebar, and click "Login with GitHub" to authenticate.
                    </p>
                  </div>
                </div>

                {/* Arrow 3 */}
                <div className="flex justify-center py-1">
                  <div className="text-primary/60 text-2xl">↓</div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <span className="text-primary font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Paste Repository URL or Select Your Repo</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter a GitHub repository URL or use "Your Repos" to select from your own repositories.
                    </p>
                  </div>
                </div>

                {/* Arrow 4 */}
                <div className="flex justify-center py-1">
                  <div className="text-green-500/60 text-2xl">↓</div>
                </div>

                {/* Step 5 */}
                <div className="flex items-start gap-4 p-5 rounded-xl border border-green-500/30 bg-green-500/5 hover:border-green-500/50 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-green-400">Get Your Results!</h3>
                    <p className="text-sm text-muted-foreground">
                      Click "Start Analysis" and watch as AI scans your code in real-time. View your Vibe Score and detailed issue reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-3">What Developers Say</h2>
            </div>

            <div className="max-w-2xl mx-auto relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="text-center p-8 rounded-xl bg-card border border-border">
                        <p className="text-lg mb-6 text-foreground">"{testimonial.quote}"</p>
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">{testimonial.author[0]}</span>
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-sm">{testimonial.author}</p>
                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={prevTestimonial}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        currentTestimonial === index ? 'bg-primary w-4' : 'bg-muted-foreground/30'
                      )}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Leave a Review Button */}
              <div className="text-center mt-8">
                <a
                  href="https://mail.google.com/mail/?view=cm&to=danishakhtarx022@gmail.com&su=CodeVibes%20Review&body=Hi!%20I'd%20like%20to%20share%20my%20experience%20with%20CodeVibes:"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-primary/50 hover:border-primary hover:bg-primary/10 text-foreground font-medium transition-colors"
                >
                  Leave a Review
                </a>
                <p className="text-xs text-muted-foreground mt-2">
                  Love CodeVibes? Share your experience with us!
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* App Showcase Carousel */}
        <section className="py-20 border-t border-border bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-3">See It In Action</h2>
              <p className="text-muted-foreground">From URL to detailed report in seconds.</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                  {screenshots.map((shot, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <div className="overflow-hidden rounded-xl border border-border shadow-2xl bg-background aspect-video relative group">
                          <img
                            src={shot.src}
                            alt={shot.alt}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="font-medium text-lg">{shot.label}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Tip: Hover images to see details
              </div>
            </div>
          </div>
        </section>




        {/* FAQ Section */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-3">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Everything you need to know about CodeVibes.</p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">What languages does CodeVibes support?</AccordionTrigger>
                <AccordionContent>
                  We primarily support TypeScript, JavaScript, Python, Go, and Java. The analysis engine (DeepSeek V3) is capable of understanding most modern languages, but our priority-scanning heuristics are optimized for these stacks.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">Do you store my code?</AccordionTrigger>
                <AccordionContent>
                  <strong>No.</strong> We are privacy-first. Your code is streamed to our secure analysis engine and immediately discarded after processing. We only store the <em>analysis results</em> (the report) so you can view it later. We never train models on your code.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">How is this different from GitHub Copilot or Sonar?</AccordionTrigger>
                <AccordionContent>
                  Most tools optimize for <em>generation</em> (writing code) or valid syntax. CodeVibes optimizes for <strong>Threat Modeling</strong> and Logic Bugs. We use a unique 3-tier priority system (Security → Reliability → Quality) to mimic how a human auditor reviews code, saving you tokens and time.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">Is it free to use?</AccordionTrigger>
                <AccordionContent>
                  CodeVibes is Open Source! You can self-host it for free. For the hosted version, we offer a generous Free Tier (3 scans/month) so you can try it out. Paid plans are available for power users who need higher limits and team features.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">Why is the analysis so fast?</AccordionTrigger>
                <AccordionContent>
                  We use aggressive parallelization and "Smart Context" caching. Instead of reading your entire repo linearly, we fetch critical files in parallel and cache the dependency graph. This makes re-scanning up to 35x faster than traditional sequential analysis.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-3">Ready to Improve Your Code?</h2>
              <p className="text-muted-foreground mb-8">
                Start your first analysis in under 2 minutes. No signup required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/setup')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://github.com/danish296/codevibes" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 w-4 h-4" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Login Required Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Login Required
            </DialogTitle>
            <DialogDescription>
              Sign in with GitHub to save your analysis history and access advanced features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Your repository URL has been saved. After logging in, you'll be redirected to continue your analysis.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowLoginDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#24292e] hover:bg-[#24292e]/90"
                onClick={handleLoginAndContinue}
              >
                <Github className="mr-2 w-4 h-4" />
                Login with GitHub
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div >
  );
}
