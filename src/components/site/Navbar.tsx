import { Brain } from "lucide-react";

const links = [
  { href: "#about", label: "Research" },
  { href: "#methodology", label: "Methodology" },
  { href: "#performance", label: "Performance" },
  { href: "#predict", label: "Predict" },
  { href: "#findings", label: "Findings" },
  { href: "#team", label: "Team" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-between shadow-soft">
          <a href="#top" className="flex items-center gap-2 font-display font-semibold">
            <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Brain className="w-4 h-4" />
            </span>
            <span className="text-sm tracking-tight">NeuroPredict</span>
          </a>
          <ul className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="hover:text-foreground transition-colors">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#predict"
            className="text-sm font-medium px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95 transition"
          >
            Try model
          </a>
        </nav>
      </div>
    </header>
  );
}
