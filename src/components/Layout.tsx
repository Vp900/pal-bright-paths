import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, MapPin, GraduationCap, Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/courses", label: "Courses" },
  { to: "/faculty", label: "Faculty" },
  { to: "/results", label: "Results" },
  { to: "/gallery", label: "Gallery" },
  { to: "/admission", label: "Admission" },
  { to: "/contact", label: "Contact" },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-sm py-2 hidden md:block">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> +91 98765 43210</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> info@palclasses.com</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Main Road, City Center</span>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b shadow-sm">
        <div className="container flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-hero-gradient flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <span className="font-heading font-bold text-xl text-primary">Pal Classes</span>
              <span className="block text-[10px] text-muted-foreground leading-none -mt-0.5">Quality Education</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link to="/admission">
              <Button variant="hero" size="sm">Enroll Now</Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-card animate-fade-in-up">
            <nav className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/admission" onClick={() => setMobileMenuOpen(false)} className="mt-2">
                <Button variant="hero" className="w-full">Enroll Now</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-foreground text-background">
        <div className="container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-accent-foreground" />
                </div>
                <span className="font-heading font-bold text-xl">Pal Classes</span>
              </div>
              <p className="text-background/70 text-sm leading-relaxed">
                Shaping bright futures with quality education since 2014. We provide personalized coaching for classes 1-12 across all major boards.
              </p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Facebook className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Instagram className="w-4 h-4" /></a>
                <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"><Youtube className="w-4 h-4" /></a>
              </div>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-background/70">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="hover:text-accent transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Our Courses</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>Primary (Class 1-5)</li>
                <li>Middle School (Class 6-8)</li>
                <li>Secondary (Class 9-10)</li>
                <li>Senior Secondary (Class 11-12)</li>
                <li>Olympiad Preparation</li>
                <li>Board Exam Special</li>
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-semibold text-lg mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm text-background/70">
                <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> 123 Main Road, City Center, Patna, Bihar - 800001</li>
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 shrink-0" /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 shrink-0" /> info@palclasses.com</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10">
          <div className="container py-4 text-center text-sm text-background/50">
            © {new Date().getFullYear()} Pal Classes. All rights reserved.
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919876543210?text=Hello%20Pal%20Classes!%20I%20want%20to%20know%20more%20about%20your%20courses."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[hsl(142,70%,45%)] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-float"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-primary-foreground" />
      </a>
    </div>
  );
};

export default Layout;
