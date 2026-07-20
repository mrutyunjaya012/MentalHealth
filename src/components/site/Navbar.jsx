import { Brain, LogIn, LogOut, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthScreen } from "@/hooks/use-auth-screen";

const links = [
  { href: "#about", label: "Research" },
  { href: "#methodology", label: "Methodology" },
  { href: "#performance", label: "Performance" },
  { href: "#predict", label: "Predict" },
  { href: "#findings", label: "Findings" },
  { href: "#team", label: "Team" },
];

export function Navbar({ showAdminDashboard, setShowAdminDashboard }) {
  const { currentUser, logout, isAdmin } = useAuth();
  const { openLogin, openSignup } = useAuthScreen();

  const handleLinkClick = (e, href) => {
    if (showAdminDashboard) {
      e.preventDefault();
      setShowAdminDashboard(false);
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 80);
    }
  };

  const handleLogout = () => {
    logout();
    setShowAdminDashboard(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-between shadow-soft border border-border/40">
          <a
            href="#top"
            onClick={(e) => handleLinkClick(e, "#top")}
            className="flex items-center gap-2 font-display font-semibold hover:opacity-90 transition"
          >
            <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Brain className="w-4 h-4" />
            </span>
            <span className="text-sm tracking-tight text-foreground">NeuroPredict</span>
          </a>

          {!showAdminDashboard && (
            <ul className="hidden lg:flex items-center gap-7 text-sm text-muted-foreground">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => handleLinkClick(e, l.href)}
                    className="hover:text-foreground transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <button
                    onClick={() => setShowAdminDashboard(!showAdminDashboard)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition cursor-pointer ${
                      showAdminDashboard
                        ? "bg-primary text-primary-foreground border-primary shadow-elegant"
                        : "bg-background text-foreground border-border hover:bg-muted/80 shadow-soft"
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {showAdminDashboard ? "View Site" : "Admin Panel"}
                  </button>
                )}

                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-muted/50 border border-border/40">
                  <span className="grid place-items-center w-6 h-6 rounded-lg bg-gradient-mint text-primary-foreground text-[10px] font-bold shadow-soft">
                    {getInitials(currentUser.name)}
                  </span>
                  <span className="text-xs font-medium text-foreground max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      isAdmin
                        ? "bg-red-500/10 text-red-500 border border-red-500/10"
                        : "bg-primary/10 text-primary border border-primary/10"
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-card border border-border hover:text-destructive hover:bg-destructive/5 transition shadow-soft cursor-pointer text-muted-foreground"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={openLogin}
                  className="text-xs font-medium px-3.5 py-2 rounded-xl text-muted-foreground hover:text-foreground transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={openSignup}
                  className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95 transition flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
