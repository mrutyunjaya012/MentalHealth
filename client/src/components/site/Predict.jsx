import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Brain, 
  Moon, 
  HeartPulse, 
  User, 
  Activity, 
  Stethoscope, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw,
  Lock,
  Calendar,
  Trash2,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAuthScreen } from "@/hooks/use-auth-screen";
import { predictionsApi } from "@/api/predictionsApi";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DEFAULTS = {
    age: 21,
    gender: "",
    heightCm: 170,
    weightKg: 65,
    sleepHours: 6,
    sleepQuality: 6,
    bedtimeRegularity: 5,
    awakenings: 1,
    stress: 6,
    anxietyScore: 5,
    moodScore: 6,
    activityMinutes: 30,
    screenTimeHours: 5,
    socialMediaHours: 3,
    caffeineCups: 2,
    alcohol: "Occasionally",
    smoking: "Never",
    diet: "Balanced",
    socialSupport: 6,
    restingHr: 72,
    hrv: 55,
    spo2: 98,
    steps: 6500,
};

function predict(f) {
    const sleepDeficit = Math.max(0, 8 - f.sleepHours);
    const lowQuality = 10 - f.sleepQuality;
    const lowSupport = 10 - f.socialSupport;
    const lowMood = 10 - f.moodScore;
    const inactivity = Math.max(0, 60 - f.activityMinutes) / 60;
    const dep = f.stress * 5 +
        lowMood * 6 +
        sleepDeficit * 5 +
        lowSupport * 4 +
        f.socialMediaHours * 2 +
        inactivity * 8 +
        (f.hrv < 40 ? 8 : 0);
    const anx = f.anxietyScore * 7 +
        f.stress * 4 +
        f.caffeineCups * 2 +
        f.screenTimeHours * 1.5 +
        (f.restingHr > 85 ? 8 : 0) +
        lowSupport * 2;
    const slp = sleepDeficit * 8 +
        lowQuality * 5 +
        f.awakenings * 4 +
        (10 - f.bedtimeRegularity) * 3 +
        f.caffeineCups * 2 +
        f.screenTimeHours * 1.2;
    const clamp = (n) => Math.max(4, Math.min(97, Math.round(n)));
    return { depression: clamp(dep), anxiety: clamp(anx), sleep: clamp(slp) };
}

const steps = [
    { id: "personal", label: "Personal", icon: User },
    { id: "sleep", label: "Sleep", icon: Moon },
    { id: "lifestyle", label: "Lifestyle", icon: Activity },
    { id: "vitals", label: "Vitals", icon: Stethoscope },
];

const inputCls = "w-full rounded-xl bg-background border border-border px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 transition";

function Field({ label, hint, children, }) {
    return (<label className="block">
      <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground font-sans">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
      {hint && (<span className="mt-1 block text-[10px] text-muted-foreground/80">
          {hint}
        </span>)}
    </label>);
}

function Range({ value, onChange, min = 0, max = 10, step = 1, }) {
    return (<input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-primary cursor-pointer"/>);
}

export function Predict() {
    const { currentUser } = useAuth();
    const { openLogin, openSignup } = useAuthScreen();
    const [form, setForm] = useState(DEFAULTS);
    const [stepIdx, setStepIdx] = useState(0);
    const [result, setResult] = useState(null);
    const [historyList, setHistoryList] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [savingPrediction, setSavingPrediction] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        async function loadHistory() {
            if (!currentUser) {
                setHistoryList([]);
                return;
            }

            setHistoryLoading(true);
            try {
                const predictions = await predictionsApi.getByUser(currentUser.email);
                setHistoryList(predictions);
            } catch (error) {
                toast.error(error.message || "Failed to load prediction history");
                setHistoryList([]);
            } finally {
                setHistoryLoading(false);
            }
        }

        loadHistory();
    }, [currentUser, result]);

    const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

    const bmi = useMemo(() => {
        const h = Number(form.heightCm);
        const w = Number(form.weightKg);
        if (!h || !w)
            return null;
        const m = h / 100;
        return +(w / (m * m)).toFixed(1);
    }, [form.heightCm, form.weightKg]);

    const progress = ((stepIdx + 1) / steps.length) * 100;
    const isLast = stepIdx === steps.length - 1;

    const next = async () => {
        if (isLast) {
            const computedResults = predict(form);
            setResult(computedResults);

            if (currentUser) {
                setSavingPrediction(true);
                try {
                    await predictionsApi.create({
                        userEmail: currentUser.email,
                        inputs: form,
                        results: computedResults,
                    });
                    toast.success("Prediction recorded in database.");
                } catch (error) {
                    toast.error(error.message || "Failed to save prediction");
                } finally {
                    setSavingPrediction(false);
                }
            }

            const el = document.getElementById("risk-result");
            el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
        else {
            setStepIdx((i) => i + 1);
        }
    };

    const reset = () => {
        setForm(DEFAULTS);
        setStepIdx(0);
        setResult(null);
    };

    const handleDeleteHistory = async (id) => {
        setDeletingId(id);
        try {
            await predictionsApi.delete(id);
            if (currentUser) {
                const predictions = await predictionsApi.getByUser(currentUser.email);
                setHistoryList(predictions);
            }
            toast.success("Entry deleted from your records.");
        } catch (error) {
            toast.error(error.message || "Failed to delete entry");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <section id="predict" className="py-24 bg-secondary/40 relative">
            <div className="mx-auto max-w-6xl px-4">
                <div className="max-w-2xl mb-12">
                    <p className="text-sm font-medium text-primary mb-3">Live demo</p>
                    <h2 className="text-3xl md:text-5xl font-semibold font-display">
                        Try the prediction model
                    </h2>
                    <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                        Provide self-reported lifestyle and wearable inputs across four
                        stages. The model returns a simulated risk profile for depression,
                        anxiety, and sleep disorders.
                    </p>
                </div>

                {/* Form & Result Container */}
                <div className="relative min-h-[460px] rounded-3xl">
                    
                    {/* Blurred Content Grid */}
                    <div className={cn("grid lg:grid-cols-5 gap-6 transition duration-300", !currentUser && "blur-[5px] pointer-events-none select-none")}>
                        <div className="lg:col-span-3 rounded-2xl bg-card border border-border p-6 md:p-8 shadow-soft">
                            {/* Stepper */}
                            <div className="mb-6">
                                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                                    <motion.div className="h-full bg-gradient-primary" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}/>
                                </div>
                                <div className="mt-4 grid grid-cols-4 gap-2">
                                    {steps.map((s, i) => {
                                        const Icon = s.icon;
                                        const active = i === stepIdx;
                                        const done = i < stepIdx;
                                        return (<button 
                                            key={s.id} 
                                            type="button" 
                                            onClick={() => setStepIdx(i)} 
                                            disabled={!currentUser}
                                            className={`flex flex-col items-center gap-1.5 text-[10px] font-medium transition cursor-pointer ${active
                                                ? "text-primary"
                                                : done
                                                    ? "text-foreground"
                                                    : "text-muted-foreground"}`}
                                        >
                                            <span className={`w-8 h-8 rounded-full grid place-items-center border ${active
                                                ? "border-primary bg-primary/10"
                                                : done
                                                    ? "border-primary/40 bg-primary/5"
                                                    : "border-border bg-background"}`}
                                            >
                                                <Icon className="w-4 h-4"/>
                                            </span>
                                            <span className="hidden sm:inline">{s.label}</span>
                                        </button>);
                                    })}
                                </div>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                next();
                            }} className="space-y-6">
                                {stepIdx === 0 && (<div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Age" hint="Range: 13–35 years">
                                        <input type="number" min={13} max={35} className={inputCls} value={form.age} onChange={(e) => update("age", e.target.value === "" ? "" : Number(e.target.value))}/>
                                    </Field>
                                    <Field label="Gender">
                                        <select className={inputCls} value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                                            <option value="">Select gender</option>
                                            <option>Female</option>
                                            <option>Male</option>
                                            <option>Non-binary</option>
                                            <option>Prefer not to say</option>
                                        </select>
                                    </Field>
                                    <Field label="Height (cm)" hint="Range: 120–220 cm">
                                        <input type="number" min={120} max={220} className={inputCls} value={form.heightCm} onChange={(e) => update("heightCm", e.target.value === "" ? "" : Number(e.target.value))}/>
                                    </Field>
                                    <Field label="Weight (kg)" hint="Range: 30–200 kg">
                                        <input type="number" min={30} max={200} className={inputCls} value={form.weightKg} onChange={(e) => update("weightKg", e.target.value === "" ? "" : Number(e.target.value))}/>
                                    </Field>
                                    <Field label="BMI (auto-calculated)" hint="Healthy range: 18.5–24.9">
                                        <input readOnly className={`${inputCls} bg-muted/40`} value={bmi ?? ""} placeholder="—"/>
                                    </Field>
                                </div>)}

                                {stepIdx === 1 && (<div className="grid sm:grid-cols-2 gap-5">
                                    <Field label={`Sleep duration: ${form.sleepHours}h / night`}>
                                        <Range value={form.sleepHours} onChange={(n) => update("sleepHours", n)} min={2} max={12}/>
                                    </Field>
                                    <Field label={`Sleep quality: ${form.sleepQuality}/10`}>
                                        <Range value={form.sleepQuality} onChange={(n) => update("sleepQuality", n)}/>
                                    </Field>
                                    <Field label={`Bedtime regularity: ${form.bedtimeRegularity}/10`} hint="How consistent is your sleep schedule?">
                                        <Range value={form.bedtimeRegularity} onChange={(n) => update("bedtimeRegularity", n)}/>
                                    </Field>
                                    <Field label={`Night awakenings: ${form.awakenings}`} hint="Average times you wake up per night">
                                        <Range value={form.awakenings} onChange={(n) => update("awakenings", n)} min={0} max={8}/>
                                    </Field>
                                </div>)}

                                {stepIdx === 2 && (<div className="grid sm:grid-cols-2 gap-5">
                                    <Field label={`Stress level: ${form.stress}/10`}>
                                        <Range value={form.stress} onChange={(n) => update("stress", n)}/>
                                    </Field>
                                    <Field label={`Anxiety score: ${form.anxietyScore}/10`}>
                                        <Range value={form.anxietyScore} onChange={(n) => update("anxietyScore", n)}/>
                                    </Field>
                                    <Field label={`Mood score: ${form.moodScore}/10`}>
                                        <Range value={form.moodScore} onChange={(n) => update("moodScore", n)}/>
                                    </Field>
                                    <Field label={`Physical activity: ${form.activityMinutes} min/day`}>
                                        <Range value={form.activityMinutes} onChange={(n) => update("activityMinutes", n)} min={0} max={180} step={5}/>
                                    </Field>
                                    <Field label={`Screen time: ${form.screenTimeHours}h / day`}>
                                        <Range value={form.screenTimeHours} onChange={(n) => update("screenTimeHours", n)} min={0} max={16}/>
                                    </Field>
                                    <Field label={`Social media: ${form.socialMediaHours}h / day`}>
                                        <Range value={form.socialMediaHours} onChange={(n) => update("socialMediaHours", n)} min={0} max={12}/>
                                    </Field>
                                    <Field label={`Caffeine: ${form.caffeineCups} cups/day`}>
                                        <Range value={form.caffeineCups} onChange={(n) => update("caffeineCups", n)} min={0} max={8}/>
                                    </Field>
                                    <Field label={`Social support: ${form.socialSupport}/10`}>
                                        <Range value={form.socialSupport} onChange={(n) => update("socialSupport", n)}/>
                                    </Field>
                                    <Field label="Alcohol use">
                                        <select className={inputCls} value={form.alcohol} onChange={(e) => update("alcohol", e.target.value)}>
                                            <option>Never</option>
                                            <option>Occasionally</option>
                                            <option>Weekly</option>
                                            <option>Daily</option>
                                        </select>
                                    </Field>
                                    <Field label="Smoking">
                                        <select className={inputCls} value={form.smoking} onChange={(e) => update("smoking", e.target.value)}>
                                            <option>Never</option>
                                            <option>Former</option>
                                            <option>Occasional</option>
                                            <option>Daily</option>
                                        </select>
                                    </Field>
                                    <Field label="Diet quality">
                                        <select className={inputCls} value={form.diet} onChange={(e) => update("diet", e.target.value)}>
                                            <option>Poor</option>
                                            <option>Average</option>
                                            <option>Balanced</option>
                                            <option>Excellent</option>
                                        </select>
                                    </Field>
                                </div>)}

                                {stepIdx === 3 && (<div className="grid sm:grid-cols-2 gap-4">
                                    <Field label="Resting heart rate (bpm)" hint="Typical: 60–100 bpm">
                                        <input type="number" min={40} max={140} className={inputCls} value={form.restingHr} onChange={(e) => update("restingHr", Number(e.target.value))}/>
                                    </Field>
                                    <Field label="Heart rate variability (ms)" hint="Healthy youth: 40–80 ms">
                                        <input type="number" min={10} max={150} className={inputCls} value={form.hrv} onChange={(e) => update("hrv", Number(e.target.value))}/>
                                    </Field>
                                    <Field label="SpO₂ (%)" hint="Normal: 95–100%">
                                        <input type="number" min={80} max={100} className={inputCls} value={form.spo2} onChange={(e) => update("spo2", Number(e.target.value))}/>
                                    </Field>
                                    <Field label="Daily steps" hint="Wearable 7-day average">
                                        <input type="number" min={0} max={40000} step={100} className={inputCls} value={form.steps} onChange={(e) => update("steps", Number(e.target.value))}/>
                                    </Field>
                                </div>)}

                                <div className="flex items-center justify-between gap-3 pt-2">
                                    <button type="button" onClick={() => stepIdx === 0 ? reset() : setStepIdx((i) => i - 1)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-secondary transition cursor-pointer">
                                        {stepIdx === 0 ? (<>
                                            <RotateCcw className="w-4 h-4"/> Reset
                                        </>) : (<>
                                            <ChevronLeft className="w-4 h-4"/> Back
                                        </>)}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={savingPrediction}
                                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95 transition cursor-pointer disabled:opacity-60"
                                    >
                                        {savingPrediction ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                                            </>
                                        ) : isLast ? (
                                            <>
                                                <Sparkles className="w-4 h-4"/> Run prediction
                                            </>
                                        ) : (
                                            <>
                                                Next <ChevronRight className="w-4 h-4"/>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Result Panel */}
                        <div id="risk-result" className="lg:col-span-2 rounded-2xl glass p-6 shadow-soft h-fit lg:sticky lg:top-24">
                            <div className="text-xs text-muted-foreground">
                                Prediction result
                            </div>
                            <div className="font-display font-semibold mt-1">Risk profile</div>
                            <div className="space-y-5 mt-6">
                                {[
                                    { icon: Brain, label: "Depression", value: result?.depression },
                                    { icon: HeartPulse, label: "Anxiety", value: result?.anxiety },
                                    { icon: Moon, label: "Sleep disorder", value: result?.sleep },
                                ].map((r) => (<div key={r.label}>
                                    <div className="flex items-center justify-between text-sm mb-2">
                                        <span className="inline-flex items-center gap-2">
                                            <r.icon className="w-4 h-4 text-primary"/>
                                            {r.label}
                                        </span>
                                        <span className="font-medium tabular-nums">
                                            {r.value != null ? `${r.value}%` : "—"}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: r.value != null ? `${r.value}%` : 0 }} transition={{ duration: 0.8 }} className="h-full bg-gradient-mint"/>
                                    </div>
                                </div>))}
                            </div>
                            {result && (<div className="mt-6 grid grid-cols-3 gap-2 text-center">
                                {[
                                    { k: "BMI", v: bmi ?? "—" },
                                    { k: "HRV", v: `${form.hrv}ms` },
                                    { k: "Steps", v: form.steps.toLocaleString() },
                                ].map((s) => (<div key={s.k} className="rounded-xl bg-background/60 border border-border px-2 py-2">
                                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                        {s.k}
                                    </div>
                                    <div className="text-xs font-semibold tabular-nums">
                                        {s.v}
                                    </div>
                                </div>))}
                            </div>)}
                            <p className="mt-6 text-xs text-muted-foreground">
                                {result
                                    ? "Demonstration output from a simulated model surface — not a clinical diagnosis."
                                    : "Complete all four stages and run the model to populate your risk profile."}
                            </p>
                        </div>
                    </div>

                    {/* Locked Security Overlay */}
                    {!currentUser && (
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center glass rounded-3xl border border-border/80 bg-background/65 backdrop-blur-[6px] shadow-elegant animate-fade-in">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center shadow-glow mb-4">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h3 className="font-display font-semibold text-lg text-foreground">
                                Authentication Required
                            </h3>
                            <p className="text-xs text-muted-foreground max-w-xs mt-2 mb-6">
                                Sign in to input your wearable vitals and compute mental health probability risk indexes.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={openLogin}
                                    className="text-xs font-semibold px-4.5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95 transition cursor-pointer"
                                >
                                    Sign In
                                </button>
                                <button
                                    onClick={openSignup}
                                    className="text-xs font-semibold px-4.5 py-2.5 rounded-xl border border-border bg-card text-foreground shadow-soft hover:bg-muted/80 transition cursor-pointer"
                                >
                                    Create Account
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Personal Prediction History Section */}
                {currentUser && (
                    <div className="mt-16 border-t border-border/60 pt-16">
                        <div className="flex items-center gap-2 mb-6">
                            <Calendar className="w-4 h-4 text-primary" />
                            <h3 className="font-display font-semibold text-lg text-foreground">
                                Your Saved Prediction History
                            </h3>
                            <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-semibold">
                                {historyList.length} Runs
                            </span>
                        </div>

                        {historyLoading ? (
                            <div className="rounded-2xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground shadow-soft flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                Loading your prediction history...
                            </div>
                        ) : historyList.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-border/60 bg-card p-8 text-center text-sm text-muted-foreground shadow-soft">
                                <p>You haven't run any risk predictions yet. Fill in your vitals and click "Run prediction" to save your first result!</p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {historyList.map((h) => (
                                    <div key={h.id} className="glass p-5 rounded-2xl border border-border/40 shadow-soft hover:shadow-elegant transition relative group">
                                        <button
                                            onClick={() => handleDeleteHistory(h.id)}
                                            disabled={deletingId === h.id}
                                            className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition cursor-pointer disabled:opacity-100"
                                            title="Delete Record"
                                        >
                                            {deletingId === h.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                        <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
                                            <Calendar className="w-3 h-3 text-primary/70" />
                                            {new Date(h.timestamp).toLocaleDateString(undefined, {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric"
                                            })}{" "}
                                            at{" "}
                                            {new Date(h.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </div>
                                        
                                        {/* Risk levels progress */}
                                        <div className="space-y-2.5 mt-4">
                                            {[
                                                { label: "Depression", value: h.results.depression, color: "bg-blue-500" },
                                                { label: "Anxiety", value: h.results.anxiety, color: "bg-orange-500" },
                                                { label: "Sleep Issue", value: h.results.sleep, color: "bg-purple-500" },
                                            ].map((risk) => (
                                                <div key={risk.label} className="text-xs">
                                                    <div className="flex justify-between font-medium mb-1">
                                                        <span className="text-muted-foreground">{risk.label}</span>
                                                        <span className="text-foreground">{risk.value}%</span>
                                                    </div>
                                                    <div className="h-1 rounded-full bg-muted overflow-hidden">
                                                        <div className={cn("h-full", risk.color)} style={{ width: `${risk.value}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Quick Vitals details */}
                                        <div className="mt-4 pt-3 border-t border-border/40 grid grid-cols-3 gap-1 text-[9px] uppercase tracking-wider text-muted-foreground text-center">
                                            <div>
                                                <div>Steps</div>
                                                <div className="font-semibold text-foreground mt-0.5">{h.inputs.steps.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <div>HRV</div>
                                                <div className="font-semibold text-foreground mt-0.5">{h.inputs.hrv}ms</div>
                                            </div>
                                            <div>
                                                <div>Sleep</div>
                                                <div className="font-semibold text-foreground mt-0.5">{h.inputs.sleepHours}h</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
