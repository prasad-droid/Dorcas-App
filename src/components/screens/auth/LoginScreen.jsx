import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Zap,
  ChevronLeft,
  Phone,
  User,
  MapPin,
} from "lucide-react";
import { Logo } from "../../ui/Logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";

export const LoginScreen = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, authMode, setAuthMode } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [coords, setCoords] = useState({
    lat: null,
    lng: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTech = authMode === "technician";
  const fontClass = isTech ? "font-tech" : "font-sans";

  // Load saved credentials for current role
  useEffect(() => {
    const savedName = localStorage.getItem(`prev_login_name_${authMode}`) || "";
    const savedPhone = localStorage.getItem(`prev_login_phone_${authMode}`) || "";
    setName(savedName);
    setPhoneNumber(savedPhone);
    setAgreedToTerms(false);
  }, [authMode]);

  const [showLocationModal, setShowLocationModal] = useState(false);

  // Auto-check location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setShowLocationModal(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setShowLocationModal(false);
      },
      (err) => {
        if (err.code === 1) {
          setShowLocationModal(true);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setShowLocationModal(false);
      },
      (err) => {
        if (err.code === 1) {
          showToast("Location permission denied", "error");
        } else {
          showToast("Unable to fetch location", "error");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phoneNumber.trim()) {
      showToast("Please enter both Name and Phone Number", "error");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${API_BASE}/auth/login_simple.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            phone: phoneNumber,
            role: authMode,
            latitude: coords.lat,
            longitude: coords.lng
          }),
        },
      );

      const data = await response.json();

      if (data.status) {
        // Save current session
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("role", authMode);

        // Save previous login details
        localStorage.setItem(`prev_login_name_${authMode}`, name);
        localStorage.setItem(`prev_login_phone_${authMode}`, phoneNumber);
        localStorage.setItem("prev_login_role", authMode);

        setIsAuthenticated(true);
        showToast("Logged in successfully!", "success");

        if (authMode === "technician") {
          navigate("/tech");
        } else {
          navigate("/");
        }
      } else {
        showToast(data.message || "Invalid details", "error");
      }
    } catch (error) { 
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`h-[100dvh] w-full bg-base overflow-hidden relative flex flex-col justify-between ${fontClass}`}>
      <div className={`absolute top-0 left-0 right-0 h-64 bg-gradient-to-b ${isTech ? "from-emerald-500/10" : "from-brand/10"} to-transparent -z-10`} />

      {/* App Bar / Header */}
      <div className="px-6 pt-12 pb-2 flex items-center justify-between shrink-0">
        <button
          onClick={() => navigate(-1)}
          className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center ${isTech ? "text-emerald-600" : "text-brand"}`}
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Logo className={`w-8 h-8 ${isTech ? "text-emerald-600" : "text-brand"}`} />
          <span className={`font-black text-xl tracking-tight ${isTech ? "text-emerald-600" : "text-brand"}`}>
            Dorcas
          </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Main Content Form */}
      <div className="px-6 pb-6 pt-2 flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="mt-1 mb-4">
            <h1 className={`text-2xl font-black tracking-normal ${isTech ? "text-emerald-600" : "text-brand"}`}>
              Welcome Back
            </h1>
            <p className={`text-sm font-semibold mt-0.5 ${isTech ? "text-emerald-800/60" : "text-brand/60"}`}>
              Sign in with your registered details
            </p>
          </div>

          {/* Role Selector */}
          <div className={`flex p-1 rounded-2xl mb-5 border-2 ${isTech ? "bg-emerald-50 border-emerald-400" : "bg-brand/5 border-blue-400"}`}>
            <button
              type="button"
              onClick={() => setAuthMode("customer")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${authMode === "customer" ? "bg-white text-brand shadow-md shadow-brand/10" : (isTech ? "text-emerald-600/40" : "text-brand/40")}`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setAuthMode("technician")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${authMode === "technician" ? "bg-white text-emerald-600 shadow-md shadow-emerald-600/10" : "text-brand/40"}`}
            >
              Technician
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3.5">
              <div>
                <label className={`block text-xs font-black uppercase tracking-[0.1em] mb-1.5 px-1 ${isTech ? "text-emerald-700/80" : "text-brand/70"}`}>
                  Full Name
                </label>
                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors border-2 ${isTech ? "text-emerald-600/30 group-focus-within:text-emerald-600 border-emrald-400" : "text-brand/30 group-focus-within:text-brand"}`}>
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full bg-white border rounded-2xl py-3.5 pl-12 pr-4 text-base font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-2 border-emerald-600 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-2 border-blue-400 text-blue-900 focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-black uppercase tracking-[0.1em] mb-1.5 px-1 ${isTech ? "text-emerald-700/80" : "text-brand/70"}`}>
                  Mobile Number
                </label>
                <div className="relative group flex items-center">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isTech ? "text-emerald-600/30 group-focus-within:text-emerald-600" : "text-brand/30 group-focus-within:text-brand"}`}>
                    <Phone size={18} />
                  </div>
                  <span className={`absolute left-11 text-base font-semibold select-none ${isTech ? "text-emerald-700/60" : "text-brand/60"}`}>
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhoneNumber(val);
                    }}
                    placeholder="00000 00000"
                    className={`w-full bg-white border rounded-2xl py-3.5 pl-20 pr-4 text-base font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-2 border-emerald-600 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-2 border-blue-400 text-brand focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-2xl shadow-lg transition-all flex justify-center items-center gap-2.5 text-base font-black tracking-normal ${isSubmitting ? "opacity-70" : ""} ${isTech
                ? "bg-emerald-600 shadow-emerald-600/20 text-white hover:brightness-110"
                : "bg-brand shadow-brand/20 text-white hover:-translate-y-0.5"
                }`}
            >
              {isSubmitting ? "Signing in..." : (isTech ? "Access Dashboard" : "Login Securely")}
              {isTech ? <Zap size={16} /> : <Shield size={16} />}
            </button>
          </form>
        </div>

        <div className="text-center pt-4">
          <p className={`text-sm font-semibold ${isTech ? "text-emerald-800/40" : "text-brand/40"}`}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className={`font-black hover:underline ${isTech ? "text-emerald-600" : "text-brand"}`}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>

      {/* Location Permission Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 backdrop-blur-sm ${isTech ? "bg-emerald-950/40" : "bg-brand/40"}`}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 ${isTech ? "bg-emerald-600/5" : "bg-brand/5"}`} />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl ${isTech ? "bg-emerald-600 shadow-emerald-600/20" : "bg-brand shadow-brand/20"}`}>
                  <MapPin size={40} />
                </div>

                <h3 className={`text-2xl font-black tracking-tight mb-3 ${isTech ? "text-emerald-600" : "text-brand"}`}>Location Access</h3>
                <p className={`text-base font-medium leading-relaxed mb-8 ${isTech ? "text-emerald-800/60" : "text-brand/60"}`}>
                  To provide you with the best experience and find nearby services, we need access to your location.
                </p>

                <button
                  onClick={requestLocation}
                  className={`w-full py-4 rounded-2xl font-black text-[15px] shadow-lg active:scale-95 transition-transform ${isTech ? "bg-emerald-600 text-white shadow-emerald-600/20" : "bg-brand text-white shadow-brand/20"}`}
                >
                  Allow Access
                </button>

                <button
                  onClick={() => setShowLocationModal(false)}
                  className={`mt-4 text-xs font-black uppercase tracking-[0.1em] transition-colors ${isTech ? "text-emerald-600/40 hover:text-emerald-600" : "text-brand/30 hover:text-brand"}`}
                >
                  I'll do it later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
