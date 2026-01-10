import { Link } from 'react-router-dom';
import { Github, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="CodeVibes Logo" className="w-8 h-8 rounded-lg" />
              <span className="font-bold text-lg tracking-tight">CodeVibes</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs mb-4">
              AI-powered code analysis for developers. CodeRabbit-level insights without the enterprise pricing.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted">
                Built with DeepSeek v3
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted">
                v1.0.1-beta
              </span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/setup" className="text-sm text-muted-foreground hover:text-foreground transition-base">
                  Setup
                </Link>
              </li>
              <li>
                <Link to="/analyze" className="text-sm text-muted-foreground hover:text-foreground transition-base">
                  Analyze
                </Link>
              </li>
              <li>
                <a
                  href="https://platform.deepseek.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-base inline-flex items-center gap-1"
                >
                  Get API Key
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/danish296/codevibes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-base inline-flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              </li>
              <li>
                <Link to="/documentation" className="text-sm text-muted-foreground hover:text-foreground transition-base">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="text-sm text-muted-foreground hover:text-foreground transition-base flex items-center gap-2">
                  Changelog
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                    Jan 10
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/api-reference" className="text-sm text-muted-foreground hover:text-foreground transition-base">
                  API Reference
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CodeVibes by Danish Akhtar. Open source under MIT License.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Status: Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
