import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, GraduationCap, ExternalLink, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const navigationItems = [
    { name: 'Home', href: '/', internal: true },
    { name: 'Dashboard', href: '/dashboard', internal: true, authed: true },
    { name: 'Voice Translator', href: 'https://voice-translator-avly.onrender.com', internal: false, sameTab: true },
    { name: 'Sign Language', href: 'https://adaptive-elearning-sign-language.vercel.app/', internal: false },
    { name: 'Image Analyzer', href: 'https://image-description-generator-two.vercel.app/', internal: false, sameTab: true },
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAuthed(!!session);
    });
    supabase.auth.getSession().then(({ data: { session } }) => setIsAuthed(!!session));
    return () => subscription.unsubscribe();
  }, []);

  const isActivePage = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  const NavLink = ({ item, onClick }: { item: typeof navigationItems[0], onClick?: () => void }) => {
    const baseClasses = "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors";
    const activeClasses = isActivePage(item.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted";

    if (item.internal) {
      return (
        <Link
          to={item.href}
          className={`${baseClasses} ${activeClasses}`}
          onClick={onClick}
        >
          {item.name}
        </Link>
      );
    }

    return (
      <a
        href={item.href}
        target={(item as any).sameTab ? '_self' : '_blank'}
        rel="noopener noreferrer"
        className={`${baseClasses} ${activeClasses}`}
        onClick={onClick}
      >
        {item.name}
        {!(item as any).sameTab && <ExternalLink className="w-3 h-3 ml-1" />}
      </a>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-hero-gradient rounded-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-hero-gradient bg-clip-text text-transparent">
              AdaptiveLearn -Self Paced Learning Platform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthed && navigationItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 p-0"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            {isAuthed ? (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
                <Button size="sm" className="bg-hero-gradient hover:shadow-glow transition-shadow" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {isAuthed && navigationItems.map((item) => (
                    <NavLink
                      key={item.name}
                      item={item}
                      onClick={() => setIsOpen(false)}
                    />
                  ))}
                  <div className="pt-4 border-t border-border space-y-3">
                    {/* Mobile Theme Toggle */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setTheme(theme === 'dark' ? 'light' : 'dark');
                        setIsOpen(false);
                      }}
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="h-4 w-4 mr-2" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4 mr-2" />
                          Dark Mode
                        </>
                      )}
                    </Button>
                    {isAuthed ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={async () => {
                          await supabase.auth.signOut();
                          setIsOpen(false);
                          navigate("/");
                        }}
                      >
                        Logout
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" className="w-full" onClick={() => { setIsOpen(false); navigate("/auth"); }}>Sign In</Button>
                        <Button className="w-full bg-hero-gradient hover:shadow-glow transition-shadow" onClick={() => { setIsOpen(false); navigate("/auth"); }}>
                          Get Started
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;