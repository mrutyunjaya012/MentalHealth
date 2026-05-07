import { Brain, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-8 items-start">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold">
            <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-primary text-primary-foreground">
              <Brain className="w-4 h-4" />
            </span>
            NeuroPredict
          </div>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs">
            A research initiative exploring AI for early mental health
            detection in youth.
          </p>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-3">Research</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><a href="#about" className="hover:text-foreground">Overview</a></li>
            <li><a href="#methodology" className="hover:text-foreground">Methodology</a></li>
            <li><a href="#findings" className="hover:text-foreground">Findings</a></li>
            <li><a href="#" className="hover:text-foreground">Download paper (PDF)</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-3">Connect</div>
          <div className="flex gap-2">
            {[Github, Twitter, Mail].map((I, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg grid place-items-center bg-secondary hover:bg-accent transition">
                <I className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 mt-10 pt-6 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
        <span>© {new Date().getFullYear()} NeuroPredict Research. All rights reserved.</span>
        <span>For research and demonstration only — not a medical device.</span>
      </div>
    </footer>
  );
}
