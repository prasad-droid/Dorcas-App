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
import { Logo } from "./components/ui/Logo";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, X, ChevronLeft, ChevronRight, Zap } from "lucide-react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false); // Paused popup
  const [authMode, setAuthMode] = useState("customer");
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false); // New Onboarding Splash
  const [myBookings, setMyBookings] = useState([]); // Manage actual bookings

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
      setShowSplash(true); 
    }, 1500); // 1.5s simulated load time, followed by onboarding splash
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authMode, setAuthMode, setShowAuthPopup, myBookings, setMyBookings }}>
      <div className="min-h-[100dvh] h-[100dvh] sm:min-h-screen bg-brand flex items-center justify-center sm:p-4 overflow-hidden font-sans tracking-tight">
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
                  setShowAuthPopup(true);
                }
              }} />
            )}
          </AnimatePresence>

          <MobileAppLayout>
            <AnimatePresence mode="wait">
              <div key={location.pathname} className="contents">
                <Routes location={location}>
                  {authMode === "technician" ? (
                    <>
                      <Route path="/tech" element={<TechHomeScreen />} />
                      <Route path="/tech/earnings" element={<TechEarningsScreen />} />
                      <Route path="/tech/profile" element={<ProfileScreen />} />
                      <Route path="*" element={<Navigate to="/tech" replace />} />
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
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </>
                  )}
                </Routes>
              </div>
            </AnimatePresence>
          </MobileAppLayout>

          {/* Global Welcome / Login Popup */}
          <AnimatePresence>
            {!isAuthenticated && showAuthPopup && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[90]"
                  onClick={() => setShowAuthPopup(false)}
                />
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                  className="absolute bottom-0 left-0 right-0 z-[100] bg-base rounded-t-3xl flex flex-col w-full h-[90%]"
                >
                  {/* iOS Sheet Grabber */}
                  <div className="w-full flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1.5 bg-black/20 rounded-full"></div>
                  </div>

                  {/* Close Button */}
                  <button 
                    onClick={() => setShowAuthPopup(false)}
                    className="absolute top-4 right-5 bg-black/5 text-black/60 rounded-full p-1.5 flex items-center justify-center hover:bg-black/10 transition-colors z-10"
                  >
                    <X size={18} strokeWidth={2.5} />
                  </button>

                  <div className="flex-1 flex flex-col px-4 w-full relative pt-6 pb-8 overflow-y-auto overflow-x-hidden">
                    <div className="flex bg-brand/10 p-1 rounded-xl mb-6 max-w-xs mx-auto w-full">
                      <button 
                        onClick={() => {
                          setAuthMode("customer");
                          navigate("/");
                        }}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === "customer" ? "bg-base text-brand shadow-sm" : "text-brand/50"}`}
                      >
                        Customer
                      </button>
                      <button 
                        onClick={() => {
                          setAuthMode("technician");
                          navigate("/tech");
                        }}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === "technician" ? "bg-base text-brand shadow-sm" : "text-brand/50"}`}
                      >
                        Partner Pro
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {authMode === "customer" ? (
                        <motion.div 
                          key="customer-login"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          className="max-w-sm mx-auto w-full flex flex-col items-center flex-1"
                        >
                          <div className="w-20 h-20 bg-base rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-brand/5 p-4 border border-brand/10">
                            <Logo className="w-full h-full text-brand" />
                          </div>
                          <h1 className="text-3xl font-extrabold text-brand tracking-tight mb-2 text-center">Welcome</h1>
                          <p className="text-sm font-medium text-brand/60 mb-8 text-center">Sign in to book trusted home services.</p>

                          <div className="space-y-4 w-full">
                            <div>
                              <label className="block text-xs font-bold text-brand/80 uppercase tracking-wider mb-2">Phone Number</label>
                              <input 
                                type="tel" 
                                placeholder="+91 00000 00000"
                                className="w-full bg-brand/5 border border-brand/20 text-brand rounded-xl py-4 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:bg-base transition-colors placeholder:text-brand/40"
                              />
                            </div>
                            
                            <button 
                              onClick={() => {
                                setIsAuthenticated(true);
                                setShowAuthPopup(false);
                              }}
                              className="w-full mt-2 bg-brand hover:brightness-110 text-white text-[15px] font-bold py-4 rounded-xl shadow-lg shadow-brand/20 transition-all flex justify-center items-center gap-2"
                            >
                              Continue Securely <Shield size={16} />
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="tech-login"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className="max-w-sm mx-auto w-full flex flex-col items-center flex-1"
                        >
                          <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20 p-4 border border-emerald-500/20">
                            <Logo className="w-full h-full text-white" />
                          </div>
                          <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight mb-2 text-center">Dorcas Pro</h1>
                          <p className="text-sm font-medium text-emerald-900/60 mb-8 text-center">Login to your professional dashboard.</p>

                          <div className="space-y-4 w-full">
                            <div>
                              <label className="block text-xs font-bold text-emerald-900/80 uppercase tracking-wider mb-2">Registered Mobile</label>
                              <input 
                                type="tel" 
                                placeholder="+91 00000 00000"
                                className="w-full bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors placeholder:text-emerald-900/40"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-emerald-900/80 uppercase tracking-wider mb-2 mt-1">Pro PIN / Password</label>
                              <input 
                                type="password" 
                                placeholder="••••••"
                                className="w-full bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors placeholder:text-emerald-900/40"
                              />
                            </div>
                            
                            <button 
                              onClick={() => {
                                setIsAuthenticated(true);
                                setShowAuthPopup(false);
                              }}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[15px] font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex justify-center items-center gap-2 mt-4"
                            >
                              Access Dashboard <Zap size={16} fill="white" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <p className="text-center text-xs font-medium text-black/30 mt-auto pt-8">
                      By continuing, you agree to our Terms & Privacy Policy
                    </p>
                  </div>
                </motion.div>
             </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
