import { Shield, Eye, Lock, Scale } from "lucide-react";
const items = [
    { icon: Shield, t: "Responsible AI", d: "Bias audits and fairness checks across demographic subgroups." },
    { icon: Lock, t: "Privacy first", d: "End-to-end anonymization, on-device pre-processing where possible." },
    { icon: Eye, t: "Explainable AI", d: "SHAP and LIME explanations accompany every prediction." },
    { icon: Scale, t: "Ethical ML", d: "IRB-aligned protocols and informed consent for all participants." },
];
export function Ethics() {
    return (<section id="ethics" className="py-24 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-primary mb-3">Ethics & privacy</p>
          <h2 className="text-3xl md:text-5xl font-semibold">
            Built on trust, transparency, and care.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((i) => (<div key={i.t} className="rounded-2xl p-6 bg-card border border-border shadow-soft hover:-translate-y-1 hover:shadow-elegant transition">
              <div className="w-11 h-11 rounded-xl bg-gradient-mint grid place-items-center text-mint-foreground shadow-glow">
                <i.icon className="w-5 h-5"/>
              </div>
              <div className="mt-4 font-display font-semibold">{i.t}</div>
              <p className="text-sm text-muted-foreground mt-1">{i.d}</p>
            </div>))}
        </div>
      </div>
    </section>);
}
