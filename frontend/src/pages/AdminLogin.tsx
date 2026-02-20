import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Mail, AlertCircle, Loader2, ArrowRight, Eye, EyeOff, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import logoImg from "@/assets/logo.jpeg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isAdmin, loading: authLoading, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050811]">
        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full animate-pulse" />
          <Loader2 className="w-10 h-10 animate-spin text-primary relative z-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#050811] text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* LEFT SIDE: Brand & Info */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-12 lg:p-20 relative z-10 border-r border-white/5 bg-white/[0.01]">
        <div>
          <div className="flex items-center gap-3 mb-12 animate-fade-in-up">
            <img src={logoImg} alt="Pal Classes" className="w-12 h-12 rounded-xl object-contain bg-black/40 border border-white/10 p-1" />
            <span className="text-2xl font-bold tracking-tighter">PAL <span className="text-primary">CLASSES</span></span>
          </div>
          
          <div className="space-y-6 max-w-lg">
            <h2 className="text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight animate-fade-in-up delay-150">
              Modernizing Education <br />
              With <span className="text-gradient-primary">Precision.</span>
            </h2>
            <p className="text-zinc-400 text-lg lg:text-xl leading-relaxed animate-fade-in-up delay-300 font-medium">
              Access the command center for Pal Classes. Manage students, curriculum, and institutional progress from a single high-performance dashboard.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 animate-fade-in-up delay-[450ms]">
          <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <Zap className="text-primary w-6 h-6 mb-2" />
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500">Real-time</h4>
            <p className="text-white/90">Instant data synchronization across platforms.</p>
          </div>
          <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <ShieldCheck className="text-primary w-6 h-6 mb-2" />
            <h4 className="font-bold text-sm uppercase tracking-widest text-zinc-500">Secure</h4>
            <p className="text-white/90">Enterprise-grade encryption for all data.</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 relative z-10">
        <div className="w-full max-w-md">
          <div className="md:hidden text-center mb-10">
            <img src={logoImg} alt="Pal Classes" className="w-16 h-16 rounded-2xl mx-auto mb-4 bg-black/40 border border-white/10 p-2" />
            <h1 className="text-3xl font-bold">Admin Portal</h1>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.6)] p-8 lg:p-12 animate-fade-in-up">
            <div className="mb-10">
              <h3 className="text-3xl font-bold mb-2">Welcome Back</h3>
              <p className="text-zinc-500">Please enter your administrative keys.</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-4 mb-8 flex items-start gap-3 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Admin Identity</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 transition-colors group-focus-within:text-primary" />
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-14 pl-12 bg-white/[0.04] border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Access Pass</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 transition-colors group-focus-within:text-primary" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-14 pl-12 pr-12 bg-white/[0.04] border-white/10 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-[0_12px_40px_-12px_rgba(59,130,246,0.6)] transition-all hover:scale-[1.01] active:scale-[0.99]" 
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Enter Dashboard <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          </div>
          
          <div className="mt-12 text-center text-zinc-600 text-xs font-medium uppercase tracking-[0.2em] animate-fade-in-up delay-[600ms]">
            &copy; 2025 Pal Classes &bull; System Version 4.0.2
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;


