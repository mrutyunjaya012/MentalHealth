import { Github, Linkedin } from "lucide-react";
const people = [
    { n: "Mrutyunjaya Beura", r: "Principal Investigator", a: "Dept. of Computer Science" },
    { n: "Aman Deep", r: "ML Researcher", a: "Health Informatics Lab" },
    { n: "Subhalaxmi Chaudhury", r: "Data Scientist", a: "Behavioral Analytics Group" },
];
export function Team() {
    return (<section id="team" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-primary mb-3">Authors</p>
          <h2 className="text-3xl md:text-5xl font-semibold">Research team</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {people.map((p) => (<div key={p.n} className="rounded-2xl p-6 bg-card border border-border shadow-soft hover:shadow-elegant transition">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground font-display font-semibold shadow-glow">
                {p.n.split(" ").map((s) => s[0]).join("")}
              </div>
              <div className="mt-4 font-display font-semibold">{p.n}</div>
              <div className="text-sm text-primary">{p.r}</div>
              <div className="text-sm text-muted-foreground mt-1">{p.a}</div>
              <div className="mt-4 flex gap-2">
                <a className="w-9 h-9 rounded-lg grid place-items-center bg-secondary hover:bg-accent transition" href="#" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4"/>
                </a>
                <a className="w-9 h-9 rounded-lg grid place-items-center bg-secondary hover:bg-accent transition" href="#" aria-label="GitHub">
                  <Github className="w-4 h-4"/>
                </a>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
