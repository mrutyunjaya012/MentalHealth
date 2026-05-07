import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Methodology } from "@/components/site/Methodology";
import { Performance } from "@/components/site/Performance";
import { Predict } from "@/components/site/Predict";
import { Findings } from "@/components/site/Findings";
import { Ethics } from "@/components/site/Ethics";
import { Team } from "@/components/site/Team";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuroPredict — AI-Powered Mental Health Prediction for Youth" },
      {
        name: "description",
        content:
          "Predictive analytics research using Random Forest, Logistic Regression and Decision Trees to detect depression, anxiety and sleep disorders in youth.",
      },
      { property: "og:title", content: "NeuroPredict — AI Mental Health Prediction for Youth" },
      {
        property: "og:description",
        content:
          "Machine Learning research for early detection of depression, anxiety and sleep disorders in youth.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <About />
      <Methodology />
      <Performance />
      <Predict />
      <Findings />
      <Ethics />
      <Team />
      <Footer />
    </main>
  );
}
