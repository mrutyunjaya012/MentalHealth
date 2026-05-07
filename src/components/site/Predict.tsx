import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Moon, HeartPulse } from "lucide-react";

type Result = {
  depression: number;
  anxiety: number;
  sleep: number;
};

function predict(form: {
  age: number;
  gender: string;
  sleep: number;
  stress: number;
  anxiety: number;
  activity: number;
}): Result {
  // Dummy heuristic — replace with real model.
  const dep =
    form.stress * 8 +
    (8 - form.sleep) * 6 +
    form.anxiety * 4 -
    form.activity * 3;
  const anx = form.anxiety * 9 + form.stress * 5 - form.activity * 2;
  const slp = (8 - form.sleep) * 10 + form.stress * 4;
  const clamp = (n: number) => Math.max(5, Math.min(96, Math.round(n)));
  return { depression: clamp(dep), anxiety: clamp(anx), sleep: clamp(slp) };
}

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="text-xs font-medium text-muted-foreground">{label}</span>
    <div className="mt-1.5">{children}</div>
  </label>
);

const inputCls =
  "w-full rounded-xl bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition";

export function Predict() {
  const [form, setForm] = useState({
    age: 21,
    gender: "Female",
    sleep: 6,
    stress: 6,
    anxiety: 5,
    activity: 4,
  });
  const [result, setResult] = useState<Result | null>(null);

  return (
    <section id="predict" className="py-24 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-primary mb-3">Live demo</p>
          <h2 className="text-3xl md:text-5xl font-semibold">
            Try the prediction model
          </h2>
          <p className="mt-4 text-muted-foreground">
            Provide a few self-reported and wearable inputs and view a
            simulated risk profile generated from the trained model surface.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setResult(predict(form));
            }}
            className="lg:col-span-3 rounded-2xl bg-card border border-border p-6 shadow-soft grid sm:grid-cols-2 gap-4"
          >
            <Field label="Age">
              <input
                type="number"
                className={inputCls}
                value={form.age}
                onChange={(e) =>
                  setForm({ ...form, age: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Gender">
              <select
                className={inputCls}
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option>Female</option>
                <option>Male</option>
                <option>Non-binary</option>
              </select>
            </Field>
            <Field label={`Sleep hours: ${form.sleep}h`}>
              <input
                type="range"
                min={2}
                max={12}
                value={form.sleep}
                onChange={(e) =>
                  setForm({ ...form, sleep: Number(e.target.value) })
                }
                className="w-full accent-primary"
              />
            </Field>
            <Field label={`Stress level: ${form.stress}/10`}>
              <input
                type="range"
                min={0}
                max={10}
                value={form.stress}
                onChange={(e) =>
                  setForm({ ...form, stress: Number(e.target.value) })
                }
                className="w-full accent-primary"
              />
            </Field>
            <Field label={`Anxiety score: ${form.anxiety}/10`}>
              <input
                type="range"
                min={0}
                max={10}
                value={form.anxiety}
                onChange={(e) =>
                  setForm({ ...form, anxiety: Number(e.target.value) })
                }
                className="w-full accent-primary"
              />
            </Field>
            <Field label={`Physical activity: ${form.activity}/10`}>
              <input
                type="range"
                min={0}
                max={10}
                value={form.activity}
                onChange={(e) =>
                  setForm({ ...form, activity: Number(e.target.value) })
                }
                className="w-full accent-primary"
              />
            </Field>
            <button
              type="submit"
              className="sm:col-span-2 inline-flex items-center justify-center gap-2 mt-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95 transition"
            >
              <Sparkles className="w-4 h-4" /> Run prediction
            </button>
          </form>

          <div className="lg:col-span-2 rounded-2xl glass p-6 shadow-soft">
            <div className="text-xs text-muted-foreground">Prediction result</div>
            <div className="font-display font-semibold mt-1">Risk profile</div>
            <div className="space-y-5 mt-6">
              {[
                { icon: Brain, label: "Depression", value: result?.depression },
                { icon: HeartPulse, label: "Anxiety", value: result?.anxiety },
                { icon: Moon, label: "Sleep disorder", value: result?.sleep },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="inline-flex items-center gap-2">
                      <r.icon className="w-4 h-4 text-primary" />
                      {r.label}
                    </span>
                    <span className="font-medium tabular-nums">
                      {r.value != null ? `${r.value}%` : "—"}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: r.value != null ? `${r.value}%` : 0 }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-mint"
                    />
                  </div>
                </div>
              ))}
            </div>
            {!result && (
              <p className="mt-6 text-xs text-muted-foreground">
                Run the model to populate your risk profile. Predictions are for
                research demonstration only and not medical advice.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
