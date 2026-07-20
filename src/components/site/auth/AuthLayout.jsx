import { Brain, ArrowLeft, Sparkles, Shield, Activity } from "lucide-react";
import { useAuthScreen } from "@/hooks/use-auth-screen";

export function AuthLayout({ children, title, subtitle }) {
  const { closeAuth } = useAuthScreen();
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary-glow text-primary-foreground">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <a
            href="#top"
            className="inline-flex items-center gap-2.5 font-display font-semibold text-primary-foreground/95"
          >
            <span className="grid place-items-center w-10 h-10 rounded-2xl bg-white/15 backdrop-blur border border-white/20 shadow-lg">
              <Brain className="w-5 h-5" />
            </span>
            NeuroPredict
          </a>
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/70 mb-3">
              Mental Health Analytics
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight">
              Clinical-grade risk insights, powered by data.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground/80">
              Secure access to depression, anxiety, and sleep disorder prediction
              tools built for research and personal wellness tracking.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              { icon: Sparkles, text: "AI-driven risk probability scoring" },
              { icon: Shield, text: "Role-based admin and user access" },
              { icon: Activity, text: "Prediction history stored in MongoDB" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 border border-white/10">
                  <Icon className="w-4 h-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} NeuroPredict Research Platform
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          <button
            type="button"
            onClick={closeAuth}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </button>

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Brain className="w-4 h-4" />
            </span>
            <span className="font-display font-semibold text-foreground">NeuroPredict</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
