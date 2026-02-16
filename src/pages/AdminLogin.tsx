import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import logoImg from "@/assets/logo.jpeg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const { isAdmin, loading: authLoading, signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAdmin, authLoading, navigate]);

  const handleSetupAdmin = async () => {
    setSetupLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.functions.invoke("setup-admin");
      if (error) throw error;
      if (data?.credentials) {
        setEmail(data.credentials.email);
        setPassword(data.credentials.password);
      }
    } catch (err: any) {
      setError(err.message || "Setup failed");
    }
    setSetupLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-section-gradient p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl border shadow-xl p-8">
          <div className="text-center mb-8">
            <img src={logoImg} alt="Pal Classes" className="w-16 h-16 rounded-xl mx-auto mb-4 object-contain" />
            <h1 className="font-heading text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground text-sm mt-1">Pal Classes CMS</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive rounded-lg p-3 mb-6 flex items-center gap-2 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Login
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-muted-foreground text-xs mb-3">First time? Setup admin account:</p>
            <Button variant="outline" size="sm" onClick={handleSetupAdmin} disabled={setupLoading}>
              {setupLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Setup Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
