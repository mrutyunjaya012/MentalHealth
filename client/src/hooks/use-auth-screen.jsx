import { createContext, useContext, useState, useCallback } from "react";

const AuthScreenContext = createContext(null);

export function AuthScreenProvider({ children }) {
  const [authScreen, setAuthScreen] = useState(null);

  const openLogin = useCallback(() => {
    setAuthScreen("login");
  }, []);

  const openSignup = useCallback(() => {
    setAuthScreen("signup");
  }, []);

  const closeAuth = useCallback(() => {
    setAuthScreen(null);
  }, []);

  const goToLoginAfterSignup = useCallback(() => {
    setAuthScreen("login");
  }, []);

  return (
    <AuthScreenContext.Provider
      value={{
        authScreen,
        openLogin,
        openSignup,
        closeAuth,
        goToLoginAfterSignup,
      }}
    >
      {children}
    </AuthScreenContext.Provider>
  );
}

export function useAuthScreen() {
  const context = useContext(AuthScreenContext);
  if (!context) {
    throw new Error("useAuthScreen must be used within an AuthScreenProvider");
  }
  return context;
}
