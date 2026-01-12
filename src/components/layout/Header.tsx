import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SettingsModal } from '@/components/SettingsModal';

const navItems = [
  { path: '/analyze', label: 'ANALYZE' },
  { path: '/documentation', label: 'DOCS' },
  { path: '/changelog', label: 'CHANGELOG' },
  { path: '/api-reference', label: 'API' },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const shouldBeDark = stored !== 'light';
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', newIsDark);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#f5ebe6]/90 dark:bg-[#2a1f1a]/90 backdrop-blur-xl border border-[#d4c4bb]/50 dark:border-[#3d2f28]/50 rounded-2xl px-6">
            <div className="flex h-14 items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3">
                <img src="/logo.png" alt="CodeVibes Logo" className="w-9 h-9 rounded-lg" />
                <div className="flex flex-col">
                  <span className="font-bold text-base tracking-tight leading-none">CodeVibes</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">v1.0.2-beta</span>
                </div>
              </Link>

              {/* Centered Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'text-xs font-medium tracking-wider transition-colors',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Right Actions */}
              <div className="flex items-center gap-3">
                {/* Theme Toggle Switch */}
                <button
                  onClick={toggleTheme}
                  className="hidden md:flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50"
                  aria-label="Toggle theme"
                >
                  <span className={cn(
                    "p-1.5 rounded-full transition-colors",
                    !isDark ? "bg-foreground text-background" : "text-muted-foreground"
                  )}>
                    <Sun className="w-3.5 h-3.5" />
                  </span>
                  <span className={cn(
                    "p-1.5 rounded-full transition-colors",
                    isDark ? "bg-foreground text-background" : "text-muted-foreground"
                  )}>
                    <Moon className="w-3.5 h-3.5" />
                  </span>
                </button>

                <button
                  onClick={() => setSettingsOpen(true)}
                  className="hidden md:block text-xs font-medium text-muted-foreground hover:text-foreground transition-colors tracking-wider"
                >
                  SETTINGS
                </button>

                <Link to="/setup" className="hidden md:inline-flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full px-5 border-foreground/20 hover:bg-foreground hover:text-background font-medium text-xs tracking-wide"
                  >
                    Get Started
                  </Button>
                </Link>

                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <nav className="md:hidden py-4 border-t border-border animate-fade-in">
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between',
                          isActive
                            ? 'bg-accent text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                        )}
                      >
                        {item.label}
                        {isActive && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </Link>
                    );
                  })}

                  {/* Mobile Theme Toggle */}
                  <button
                    onClick={toggleTheme}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent text-left flex items-center justify-between"
                  >
                    <span>Theme</span>
                    <span className="flex items-center gap-1 p-1 rounded-full bg-muted/50 border border-border/50">
                      <span className={cn(
                        "p-1 rounded-full",
                        !isDark ? "bg-foreground text-background" : "text-muted-foreground"
                      )}>
                        <Sun className="w-3 h-3" />
                      </span>
                      <span className={cn(
                        "p-1 rounded-full",
                        isDark ? "bg-foreground text-background" : "text-muted-foreground"
                      )}>
                        <Moon className="w-3 h-3" />
                      </span>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setSettingsOpen(true);
                    }}
                    className="px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent text-left"
                  >
                    Settings
                  </button>
                  <Link
                    to="/setup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2"
                  >
                    <Button className="w-full rounded-full bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </nav>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-24" />

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
