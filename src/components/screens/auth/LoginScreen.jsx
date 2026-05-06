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

  // Clear inputs when switching roles
  useEffect(() => {
    setName("");
    setPhoneNumber("");
    setAgreedToTerms(false);
  }, [authMode]);

  const [showLocationModal, setShowLocationModal] = useState(false);

  // Auto-check location on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'prompt') {
          setShowLocationModal(true);
        } else if (result.state === 'granted') {
          requestLocation();
        }
      });
    } else {
      setShowLocationModal(true);
    }
  }, []);

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setShowLocationModal(false);
      }, (err) => {
        console.warn(err);
        setShowLocationModal(false);
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phoneNumber.trim()) {
      showToast("Please enter both Name and Phone Number", "error");
      return;
    }

    // if (!agreedToTerms) {
    //   showToast("Please agree to the Terms and Conditions", "error");
    //   return;
    // }

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
      console.log(data);
      
      if (data.status) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("role", authMode);

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
    <div className="h-full w-full bg-base overflow-y-auto relative scroll-smooth flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-brand/10 to-transparent -z-10" />

      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-brand" />
          <span className="font-black text-xl tracking-tight text-brand">
            Dorcas
          </span>
        </div>
        <div className="w-10" />
      </div>

      <div className="px-6 pb-20 pt-4">
        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-black text-brand tracking-normal">
            Welcome Back
          </h1>
          <p className="text-brand/60 font-medium mt-1">
            Sign in with your registered details
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex bg-brand/5 p-1 rounded-2xl mb-8 border border-brand/5">
          <button
            onClick={() => setAuthMode("customer")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${authMode === "customer" ? "bg-white text-brand shadow-md shadow-brand/10" : "text-brand/40"}`}
          >
            Customer
          </button>
          <button
            onClick={() => setAuthMode("technician")}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${authMode === "technician" ? "bg-white text-brand shadow-md shadow-brand/10" : "text-brand/40"}`}
          >
            Technician
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                Mobile Number
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 00000 00000"
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                  required
                />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-3 text-[15px] font-black tracking-normal ${isSubmitting ? "opacity-70" : ""} ${authMode === "technician"
              ? "bg-emerald-600 shadow-emerald-600/20 text-white hover:brightness-110"
              : "bg-brand shadow-brand/20 text-white hover:shadow-2xl hover:shadow-brand/30 hover:-translate-y-0.5"
              }`}
          >
            {isSubmitting ? "Signing in..." : (authMode === "technician" ? "Access Dashboard" : "Login Securely")}
            {authMode === "technician" ? (
              <Zap size={18} />
            ) : (
              <Shield size={18} />
            )}
          </button>
        </form>

        <div className="mt-auto pt-10 text-center">
          <p className="text-brand/40 text-xs font-medium">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-brand font-black hover:underline"
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
              className="absolute inset-0 bg-brand/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full -mr-16 -mt-16" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-brand/20">
                  <MapPin size={40} />
                </div>
                
                <h3 className="text-2xl font-black text-brand tracking-tight mb-3">Location Access</h3>
                <p className="text-sm font-medium text-brand/60 leading-relaxed mb-8">
                  To provide you with the best experience and find nearby services, we need access to your location.
                </p>
                
                <button
                  onClick={requestLocation}
                  className="w-full bg-brand text-white py-4 rounded-2xl font-black text-[15px] shadow-lg shadow-brand/20 active:scale-95 transition-transform"
                >
                  Allow Access
                </button>
                
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="mt-4 text-[11px] font-black text-brand/30 uppercase tracking-[0.1em] hover:text-brand transition-colors"
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
