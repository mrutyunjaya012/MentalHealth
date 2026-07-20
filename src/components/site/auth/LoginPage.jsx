import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthScreen } from "@/hooks/use-auth-screen";
import { AuthLayout } from "@/components/site/auth/AuthLayout";

const inputContainerCls = "relative mt-1.5 flex items-center";
const iconCls = "absolute left-3.5 text-muted-foreground/60 w-4 h-4";
const inputCls =
  "w-full rounded-xl bg-background border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition placeholder:text-muted-foreground/50";
const labelCls =
  "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80";

export function LoginPage({ onSuccess }) {
  const { login } = useAuth();
  const { openSignup, closeAuth } = useAuthScreen();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      setEmail("");
      setPassword("");
      closeAuth();
      onSuccess?.();
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access predictions, save your results, and manage your account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelCls}>Email address</label>
          <div className={inputContainerCls}>
            <Mail className={iconCls} />
            <input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Password</label>
          <div className={inputContainerCls}>
            <Lock className={iconCls} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={inputCls}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-elegant hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={openSignup}
          className="font-semibold text-primary hover:underline cursor-pointer"
        >
          Create one
        </button>
      </p>
    </AuthLayout>
  );
}
