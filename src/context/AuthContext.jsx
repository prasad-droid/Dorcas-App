import { createContext, useContext } from "react";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  authMode: "customer",
  setAuthMode: () => {},
  myBookings: [],
  setMyBookings: () => {},
  logout: () => {}
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthContext.Provider");
  }
  return context;
};
