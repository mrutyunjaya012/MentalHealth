import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, } from "recharts";
const importance = [
    { f: "Sleep quality", v: 0.28 },
    { f: "Stress index", v: 0.22 },
    { f: "Activity", v: 0.16 },
    { f: "Social media", v: 0.14 },
    { f: "Heart rate", v: 0.12 },
    { f: "Screen time", v: 0.08 },
];
export function Findings() {
    return (<section id="findings" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-medium text-primary mb-3">Key findings</p>
          <h2 className="text-3xl md:text-5xl font-semibold">
            What the data revealed
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="font-display font-semibold">Sleep quality impact</div>
            <p className="text-sm text-muted-foreground mt-2">
              Youth sleeping under 6h/night showed 2.3× higher likelihood of
              moderate-to-severe depression markers.
            </p>
            <div className="h-44 mt-4">
              <ResponsiveContainer>
                <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ name: "Risk", value: 72, fill: "var(--chart-1)" }]} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false}/>
                  <RadialBar background dataKey="value" cornerRadius={20}/>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="font-display font-semibold">Gender differences</div>
            <p className="text-sm text-muted-foreground mt-2">
              Anxiety prevalence skewed +18% higher in female respondents,
              while sleep disorders were more uniform across genders.
            </p>
            <div className="space-y-4 mt-6">
              {[
            { l: "Female", v: 64 },
            { l: "Male", v: 46 },
            { l: "Non-binary", v: 58 },
        ].map((r) => (<div key={r.l}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground">{r.l}</span>
                    <span className="font-medium">{r.v}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-primary" style={{ width: `${r.v}%` }}/>
                  </div>
                </div>))}
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="font-display font-semibold">Depression severity</div>
            <p className="text-sm text-muted-foreground mt-2">
              Distribution of severity classes in the predicted cohort.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
            { l: "Mild", v: 48, c: "var(--chart-3)" },
            { l: "Moderate", v: 34, c: "var(--chart-2)" },
            { l: "Severe", v: 18, c: "var(--chart-1)" },
        ].map((s) => (<div key={s.l} className="rounded-xl p-4 bg-secondary/60 text-center">
                  <div className="text-2xl font-display font-semibold" style={{ color: s.c }}>
                    {s.v}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
                </div>))}
            </div>
          </div>

          <div className="lg:col-span-3 rounded-2xl bg-card border border-border p-6 shadow-soft">
            <div className="font-display font-semibold mb-4">
              Feature importance (SHAP)
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={importance} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3"/>
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={11}/>
                  <YAxis type="category" dataKey="f" stroke="var(--muted-foreground)" fontSize={12} width={110}/>
                  <Tooltip contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
        }}/>
                  <Bar dataKey="v" fill="var(--chart-1)" radius={[0, 6, 6, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
