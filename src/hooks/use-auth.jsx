import { createContext, useContext, useState, useEffect } from "react";
import { usersApi } from "@/api/usersApi";
import { toast } from "sonner";

const SESSION_KEY = "neuro_predict_session";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      try {
        const storedSession = localStorage.getItem(SESSION_KEY);
        if (!storedSession) return;

        const sessionUser = JSON.parse(storedSession);
        const latestUser = await usersApi.getByEmail(sessionUser.email);
        setCurrentUser(latestUser);
      } catch (error) {
        console.error("Failed to restore auth session", error);
        localStorage.removeItem(SESSION_KEY);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await usersApi.login({ email, password });
      const user = response.data;

      const sessionData = { email: user.email, name: user.name, role: user.role };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      setCurrentUser(user);

      toast.success(`Welcome back, ${user.name}!`);
      return { success: true, user };
    } catch (error) {
      toast.error(error.message || "Login failed");
      return { success: false, error: error.message };
    }
  };

  const signup = async ({ name, email, password, role }) => {
    try {
      if (!name || !email || !password || !role) {
        toast.error("Please fill in all fields.");
        return { success: false, error: "Missing required fields" };
      }

      const response = await usersApi.register({ name, email, password, role });

      toast.success("Account created successfully! Please sign in.");
      return { success: true };
    } catch (error) {
      toast.error(error.message || "Registration failed");
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    toast.success("Logged out successfully.");
  };

  const value = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    isAdmin: currentUser?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
