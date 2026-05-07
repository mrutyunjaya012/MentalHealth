import { Database, Filter, Cpu, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Database,
    title: "Data Collection",
    desc: "Survey responses, wearable streams (sleep, HR, steps), and anonymized social media activity.",
  },
  {
    icon: Filter,
    title: "Preprocessing",
    desc: "Cleaning, normalization, missing-value imputation and feature engineering.",
  },
  {
    icon: Cpu,
    title: "ML Models",
    desc: "Random Forest, Logistic Regression and Decision Trees trained with 5-fold CV.",
  },
  {
    icon: BarChart3,
    title: "Evaluation",
    desc: "Accuracy, Precision, Recall, F1 and ROC-AUC compared across models.",
  },
];

export function Methodology() {
  return (
    <section id="methodology" className="py-24 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="text-sm font-medium text-primary mb-3">Pipeline</p>
            <h2 className="text-3xl md:text-5xl font-semibold max-w-xl">
              Dataset & methodology
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            A reproducible four-stage pipeline from raw multi-modal signals to
            clinically meaningful risk scores.
          </p>
        </div>

        <div className="relative grid md:grid-cols-4 gap-4">
          <div className="hidden md:block absolute top-12 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl p-6 bg-card border border-border shadow-soft hover:shadow-elegant transition"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary text-primary-foreground grid place-items-center mb-4 shadow-glow">
                <s.icon className="w-5 h-5" />
              </div>
              <div className="text-xs text-muted-foreground">Step 0{i + 1}</div>
              <div className="font-display font-semibold mt-1">{s.title}</div>
              <p className="text-sm text-muted-foreground mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
