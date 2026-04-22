/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, createContext, useContext, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { MobileAppLayout } from "./components/layout/MobileAppLayout";
import { HomeScreen } from "./components/screens/HomeScreen";
import { BookingsScreen } from "./components/screens/BookingsScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import { RewardsScreen } from "./components/screens/RewardsScreen";
import { CategoryScreen } from "./components/screens/CategoryScreen";
import { ServiceProvidersScreen } from "./components/screens/ServiceProvidersScreen";
import { BookingFormScreen } from "./components/screens/BookingFormScreen";
import { DashboardScreen } from "./components/screens/DashboardScreen"; 
import { TechHomeScreen } from "./components/screens/TechHomeScreen";
import { TechEarningsScreen } from "./components/screens/TechEarningsScreen";
import { OnboardingScreen } from "./components/screens/OnboardingScreen";
import { OrderHistoryScreen } from "./components/screens/OrderHistoryScreen";
import { LoginScreen } from "./components/screens/LoginScreen";
import { RegisterScreen } from "./components/screens/RegisterScreen";
import { Logo } from "./components/ui/Logo";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Zap } from "lucide-react";

import { AuthContext } from "./context/AuthContext";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("customer");
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false); 
  const [myBookings, setMyBookings] = useState([]); 

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
      setShowSplash(true); 
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);
  
  // Redirect to login if not authenticated and not on public routes
  useEffect(() => {
    if (!isAppLoading && !showSplash && !isAuthenticated && !["/login", "/register"].includes(location.pathname)) {
      navigate("/login");
    }
  }, [isAuthenticated, location.pathname, isAppLoading, showSplash, navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authMode, setAuthMode, myBookings, setMyBookings }}>
      <div className="min-h-[100dvh] h-[100dvh] sm:min-h-screen bg-brand flex items-center justify-center sm:p-4 overflow-hidden font-sans tracking-normal">
        {/* Mobile emulator constraint for desktop, full width on mobile */}
        <div className="w-full h-[100dvh] sm:h-[844px] sm:w-[390px] sm:max-h-[95vh] sm:rounded-[2.5rem] sm:border-[14px] sm:border-black sm:overflow-hidden bg-base relative flex flex-col items-center shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          
          {/* Fake iOS Dynamic Island for Desktop preview */}
          <div className="hidden sm:block absolute top-[10px] left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-full z-[999] shadow-inner"></div>

          {/* Loading Screen Overlay */}
          <AnimatePresence>
            {isAppLoading && (
              <motion.div
                key="splash"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0 z-[2000] bg-brand flex flex-col items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center"
                >
                  <div className="w-28 h-28 bg-base rounded-3xl flex items-center justify-center mb-6 shadow-2xl p-5 border border-white/20">
                    <Logo className="w-full h-full text-brand" />
                  </div>
                  <h1 className="text-4xl font-extrabold text-white tracking-tight mb-8">Dorcas</h1>
                  
                  {/* Loading Dots */}
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2.5 h-2.5 bg-white rounded-full"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ 
                          duration: 0.8, 
                          repeat: Infinity, 
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* New Onboarding Splash Screen Overlay */}
          <AnimatePresence>
            {showSplash && (
              <OnboardingScreen onComplete={() => {
                setShowSplash(false);
                if (!isAuthenticated) {
                  navigate("/login");
                }
              }} />
            )}
          </AnimatePresence>

          <MobileAppLayout>
            <AnimatePresence mode="wait">
              <div key={location.pathname} className="contents">
                <Routes location={location}>
                  {/* Public Auth Routes */}
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/register" element={<RegisterScreen />} />

                  {/* Protected Routes based on Mode */}
                  {authMode === "technician" ? (
                    <>
                      <Route path="/tech" element={<TechHomeScreen />} />
                      <Route path="/tech/earnings" element={<TechEarningsScreen />} />
                      <Route path="/tech/profile" element={<ProfileScreen />} />
                      <Route path="*" element={<Navigate to={isAuthenticated ? "/tech" : "/login"} replace />} />
                    </>
                  ) : (
                    <>
                      <Route path="/" element={<HomeScreen />} />
                      <Route path="/bookings" element={<BookingsScreen />} />
                      <Route path="/rewards" element={<RewardsScreen />} />
                      <Route path="/profile" element={<ProfileScreen />} />
                      <Route path="/dashboard" element={<DashboardScreen />} />
                      <Route path="/order-history" element={<OrderHistoryScreen />} />
                      <Route path="/category/:categoryId" element={<CategoryScreen />} />
                      <Route path="/service/:serviceId" element={<ServiceProvidersScreen />} />
                      <Route path="/book/:serviceId/:providerId" element={<BookingFormScreen />} />
                      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
                    </>
                  )}
                </Routes>
              </div>
            </AnimatePresence>
          </MobileAppLayout>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
