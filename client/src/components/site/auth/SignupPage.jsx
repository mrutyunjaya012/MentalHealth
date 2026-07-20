import { useState } from "react";
import { Mail, Lock, User, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthScreen } from "@/hooks/use-auth-screen";
import { AuthLayout } from "@/components/site/auth/AuthLayout";

const inputContainerCls = "relative mt-1.5 flex items-center";
const iconCls = "absolute left-3.5 text-muted-foreground/60 w-4 h-4";
const inputCls =
  "w-full rounded-xl bg-background border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition placeholder:text-muted-foreground/50";
const selectCls =
  "w-full rounded-xl bg-background border border-border pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition accent-primary cursor-pointer";
const labelCls =
  "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80";

export function SignupPage() {
  const { signup } = useAuth();
  const { openLogin, goToLoginAfterSignup } = useAuthScreen();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) return;

    setLoading(true);
    const res = await signup({ name, email, password, role });
    setLoading(false);

    if (res.success) {
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      goToLoginAfterSignup();
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Register to run mental health predictions and securely store your results."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Full name</label>
          <div className={inputContainerCls}>
            <User className={iconCls} />
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className={inputCls}
            />
          </div>
        </div>

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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Account type</label>
          <div className={inputContainerCls}>
            <ShieldCheck className={iconCls} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className={selectCls}
            >
              <option value="user">User — Standard access</option>
              <option value="admin">Admin — Dashboard access</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 h-11 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-elegant hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={openLogin}
          className="font-semibold text-primary hover:underline cursor-pointer"
        >
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}
