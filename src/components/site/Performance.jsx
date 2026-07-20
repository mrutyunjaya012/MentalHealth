import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend, } from "recharts";
import { motion } from "framer-motion";
const roc = [
    { fpr: 0, rf: 0, lr: 0, dt: 0 },
    { fpr: 0.05, rf: 0.42, lr: 0.31, dt: 0.28 },
    { fpr: 0.1, rf: 0.62, lr: 0.5, dt: 0.45 },
    { fpr: 0.2, rf: 0.78, lr: 0.66, dt: 0.6 },
    { fpr: 0.4, rf: 0.9, lr: 0.82, dt: 0.74 },
    { fpr: 0.6, rf: 0.95, lr: 0.9, dt: 0.85 },
    { fpr: 0.8, rf: 0.98, lr: 0.95, dt: 0.92 },
    { fpr: 1, rf: 1, lr: 1, dt: 1 },
];
const metrics = [
    { name: "Random Forest", Accuracy: 92, Precision: 91, Recall: 89, F1: 90 },
    { name: "Logistic Reg.", Accuracy: 86, Precision: 84, Recall: 82, F1: 83 },
    { name: "Decision Tree", Accuracy: 81, Precision: 79, Recall: 78, F1: 78 },
];
const bars = [
    { l: "Accuracy", v: 92 },
    { l: "Precision", v: 91 },
    { l: "Recall", v: 89 },
    { l: "F1 Score", v: 90 },
];
export function Performance() {
    return (<section id="performance" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-primary mb-3">Evaluation</p>
          <h2 className="text-3xl md:text-5xl font-semibold">
            Model performance dashboard
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cross-validated metrics for each model on the held-out test set.
            Random Forest leads across all reporting axes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-muted-foreground">Best model</div>
                <div className="font-display font-semibold">Random Forest</div>
              </div>
              <div className="text-xs px-2.5 py-1 rounded-full bg-mint/20 text-foreground">
                ROC-AUC 0.93
              </div>
            </div>
            <div className="space-y-4 mt-2">
              {bars.map((b, i) => (<div key={b.l}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">{b.l}</span>
                    <span className="font-medium">{b.v}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${b.v}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-gradient-primary"/>
                  </div>
                </div>))}
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="font-display font-semibold mb-4">ROC curve</div>
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={roc} margin={{ left: -10 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3"/>
                  <XAxis dataKey="fpr" stroke="var(--muted-foreground)" fontSize={11}/>
                  <YAxis stroke="var(--muted-foreground)" fontSize={11}/>
                  <Tooltip contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
        }}/>
                  <Legend wrapperStyle={{ fontSize: 12 }}/>
                  <Line type="monotone" dataKey="rf" name="Random Forest" stroke="var(--chart-1)" strokeWidth={2.5} dot={false}/>
                  <Line type="monotone" dataKey="lr" name="Logistic Reg." stroke="var(--chart-2)" strokeWidth={2.5} dot={false}/>
                  <Line type="monotone" dataKey="dt" name="Decision Tree" stroke="var(--chart-3)" strokeWidth={2.5} dot={false}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="font-display font-semibold mb-4">Comparative metrics</div>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={metrics}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3"/>
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12}/>
                  <YAxis stroke="var(--muted-foreground)" fontSize={12}/>
                  <Tooltip contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
        }}/>
                  <Legend wrapperStyle={{ fontSize: 12 }}/>
                  <Bar dataKey="Accuracy" fill="var(--chart-1)" radius={[6, 6, 0, 0]}/>
                  <Bar dataKey="Precision" fill="var(--chart-2)" radius={[6, 6, 0, 0]}/>
                  <Bar dataKey="Recall" fill="var(--chart-3)" radius={[6, 6, 0, 0]}/>
                  <Bar dataKey="F1" fill="var(--chart-4)" radius={[6, 6, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
