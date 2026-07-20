import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { AuthScreenProvider, useAuthScreen } from "@/hooks/use-auth-screen";
import { Toaster } from "@/components/ui/sonner";
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
import { AdminDashboard } from "@/components/site/AdminDashboard";
import { LoginPage } from "@/components/site/auth/LoginPage";
import { SignupPage } from "@/components/site/auth/SignupPage";

const queryClient = new QueryClient();

function AppContent() {
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const { authScreen } = useAuthScreen();

  if (authScreen === "login") {
    return (
      <>
        <LoginPage />
        <Toaster position="top-right" closeButton richColors />
      </>
    );
  }

  if (authScreen === "signup") {
    return (
      <>
        <SignupPage />
        <Toaster position="top-right" closeButton richColors />
      </>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar
        showAdminDashboard={showAdminDashboard}
        setShowAdminDashboard={setShowAdminDashboard}
      />

      {showAdminDashboard ? (
        <AdminDashboard />
      ) : (
        <>
          <Hero />
          <About />
          <Methodology />
          <Performance />
          <Predict />
          <Findings />
          <Ethics />
          <Team />
        </>
      )}

      <Footer />
      <Toaster position="top-right" closeButton richColors />
    </main>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthScreenProvider>
          <AppContent />
        </AuthScreenProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
