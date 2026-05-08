/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, createContext, useContext, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";
import { MobileAppLayout } from "./components/layout/MobileAppLayout";

// Capacitor & Notifications
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { NotificationService } from "./services/NotificationService";

// Auth Screens
import { LoginScreen } from "./components/screens/auth/LoginScreen";
import { RegisterScreen } from "./components/screens/auth/RegisterScreen";
import { OnboardingScreen } from "./components/screens/auth/OnboardingScreen";

// Customer Screens
import { HomeScreen } from "./components/screens/customer/HomeScreen";
import { BookingsScreen } from "./components/screens/customer/BookingsScreen";
import { RewardsScreen } from "./components/screens/customer/RewardsScreen";
import { CategoryScreen } from "./components/screens/customer/CategoryScreen";
import { ServiceProvidersScreen } from "./components/screens/customer/ServiceProvidersScreen";
import { BookingFormScreen } from "./components/screens/customer/BookingFormScreen";
import { DashboardScreen } from "./components/screens/customer/DashboardScreen";
import { OrderHistoryScreen } from "./components/screens/customer/OrderHistoryScreen";

// Technician Screens
import { TechHomeScreen } from "./components/screens/technician/TechHomeScreen";
import { TechServicesScreen } from "./components/screens/technician/TechServicesScreen";
import { TechJobDetailScreen } from "./components/screens/technician/TechJobDetailScreen";
import { TechPortfolioScreen } from "./components/screens/technician/TechPortfolioScreen";
import { TechDashboardScreen } from "./components/screens/technician/TechDashboardScreen";
import { TechEarningsScreen } from "./components/screens/technician/TechEarningsScreen";
import { TechVerificationScreen } from "./components/screens/technician/TechVerificationScreen";
import { ManageServicesScreen } from "./components/screens/technician/ManageServicesScreen";
import { ReferralScreen } from "./components/screens/technician/ReferralScreen";
import { TechCommissionScreen } from "./components/screens/technician/TechCommissionScreen";

// Shared Screens
import { ProfileScreen } from "./components/screens/shared/ProfileScreen";
import { SupportScreen } from "./components/screens/shared/SupportScreen";
import { TermsPolicyScreen } from "./components/screens/shared/TermsPolicyScreen";
import { SettingsScreen } from "./components/screens/shared/SettingsScreen";
import { NotificationScreen } from "./components/screens/customer/NotificationScreen";
import { DealsScreen } from "./components/screens/customer/DealsScreen";
import { PaymentCallbackScreen } from "./components/screens/shared/PaymentCallbackScreen";

import { Logo } from "./components/ui/Logo";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Zap } from "lucide-react";

import { AuthContext, useAuth } from "./context/AuthContext";
import { ToastProvider, useToast } from "./context/ToastContext";
import { LanguageProvider } from "./context/LanguageContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [authMode, setAuthMode] = useState(() => localStorage.getItem("role") || "customer");
  const [myBookings, setMyBookings] = useState([]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <LanguageProvider>
      <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, authMode, setAuthMode, myBookings, setMyBookings, logout }}>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthContext.Provider>
    </LanguageProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, authMode, logout } = useAuth();

  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false);

  // Push Notifications Setup
  useEffect(() => {
    if (isAuthenticated && Capacitor.isNativePlatform()) {
      const initPush = async () => {
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }
        
        if (permStatus.receive === 'granted') {
          try {
            await PushNotifications.register();
          } catch (err) {
            console.error("Push registration failed", err);
          }
          
          PushNotifications.addListener('registration', (token) => {
            NotificationService.registerDevice(token.value, null, authMode);
          });

          PushNotifications.addListener('pushNotificationReceived', (notification) => {
            showToast(`${notification.title}: ${notification.body}`, "info");
          });

          PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
            navigate("/notifications");
          });
        }
      };
      
      initPush();
    }
  }, [isAuthenticated, authMode]);

  // Back Button Handling
  useEffect(() => {
    const backButtonListener = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        CapApp.exitApp();
      }
    });

    return () => {
      backButtonListener.then(l => l.remove());
    };
  }, []);

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
      if (!isAuthenticated) {
        setShowSplash(true);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Redirect logic
  useEffect(() => {
    if (isAppLoading || showSplash) return;

    const publicRoutes = ["/login", "/register"];
    const isOnPublicRoute = publicRoutes.includes(location.pathname);

    if (!isAuthenticated) {
      if (!isOnPublicRoute) {
        navigate("/login");
      }
    } else {
      if (isOnPublicRoute) {
        navigate(authMode === "technician" ? "/tech" : "/");
      } else if (authMode === "technician" && location.pathname === "/") {
        navigate("/tech");
      } else if (authMode === "customer" && location.pathname === "/tech") {
        navigate("/");
      }
    }
  }, [isAuthenticated, location.pathname, isAppLoading, showSplash, navigate, authMode]);

  return (
    <div className="min-h-[100dvh] h-[100dvh] sm:min-h-screen bg-brand flex items-center justify-center sm:p-4 overflow-hidden font-sans tracking-normal">
      <div className="w-full h-[100dvh] sm:h-[844px] sm:w-[390px] sm:max-h-[95vh] sm:rounded-[2.5rem] sm:border-[14px] sm:border-black sm:overflow-hidden bg-base relative flex flex-col items-center shadow-[0_20px_60px_rgba(0,0,0,0.4)]">

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
                <h1 className="text-4xl font-extrabold text-white tracking-tight mb-8">Dorcasaid</h1>

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

        {/* Onboarding Screen Overlay */}
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
                    <Route path="/tech/services" element={<TechServicesScreen />} />
                    <Route path="/tech/job/:jobId" element={<TechJobDetailScreen />} />
                    <Route path="/tech/dashboard" element={<TechDashboardScreen />} />
                    <Route path="/tech/manage-services" element={<ManageServicesScreen />} />
                    <Route path="/tech/referral" element={<ReferralScreen />} />
                    <Route path="/tech/verification" element={<TechVerificationScreen />} />
                    <Route path="/tech/earnings" element={<TechEarningsScreen />} />
                    <Route path="/tech/commissions" element={<TechCommissionScreen />} />
                    <Route path="/tech/portfolio" element={<TechPortfolioScreen />} />
                    <Route path="/payment-callback" element={<PaymentCallbackScreen />} />
                    <Route path="/notifications" element={<NotificationScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                    <Route path="/support" element={<SupportScreen />} />
                    <Route path="/terms-policy" element={<TermsPolicyScreen />} />
                    <Route path="/settings" element={<SettingsScreen />} />
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/tech" : "/login"} replace />} />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/bookings" element={<BookingsScreen />} />
                    <Route path="/rewards" element={<RewardsScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                    <Route path="/support" element={<SupportScreen />} />
                    <Route path="/terms-policy" element={<TermsPolicyScreen />} />
                    <Route path="/settings" element={<SettingsScreen />} />
                    <Route path="/dashboard" element={<DashboardScreen />} />
                    <Route path="/order-history" element={<OrderHistoryScreen />} />
                    <Route path="/notifications" element={<NotificationScreen />} />
                    <Route path="/deals" element={<DealsScreen />} />
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
  );
}
