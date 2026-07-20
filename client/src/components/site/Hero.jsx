import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Activity } from "lucide-react";
import heroImg from "@/assets/hero-ai-health.jpg";
export function Hero() {
    return (<section id="top" className="relative pt-32 pb-20 bg-hero overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
            <Sparkles className="w-3.5 h-3.5 text-primary"/>
            Predictive analytics for youth mental health
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold leading-[1.05]">
            AI-Powered Mental Health{" "}
            <span className="text-gradient">Prediction</span> for Youth
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Using Machine Learning to identify early signs of depression, anxiety,
            and sleep disorders — combining behavioral, wearable, and lifestyle
            signals into trustworthy clinical insight.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#about" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant hover:opacity-95 transition">
              Explore research <ArrowRight className="w-4 h-4"/>
            </a>
            <a href="#predict" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-card transition">
              <Activity className="w-4 h-4 text-primary"/> Try prediction model
            </a>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {[
            { v: "92.4%", l: "Accuracy" },
            { v: "3", l: "ML models" },
            { v: "12k+", l: "Samples" },
        ].map((s) => (<div key={s.l}>
                <dt className="text-2xl font-display font-semibold text-gradient">
                  {s.v}
                </dt>
                <dd className="text-xs text-muted-foreground mt-1">{s.l}</dd>
              </div>))}
          </dl>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
          <div className="absolute -inset-6 bg-gradient-mint opacity-20 blur-3xl rounded-full"/>
          <div className="relative rounded-3xl overflow-hidden glass shadow-elegant">
            <img src={heroImg} alt="Neural network brain visualization for AI mental health prediction" width={1280} height={1024} className="w-full h-auto"/>
          </div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 shadow-soft hidden sm:block">
            <div className="text-xs text-muted-foreground">Model confidence</div>
            <div className="text-2xl font-display font-semibold">94.1%</div>
            <div className="mt-2 h-1.5 w-32 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-primary" style={{ width: "94%" }}/>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>);
}
