import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Zap,
  ChevronLeft,
  Phone,
  Lock,
  Apple,
  Globe,
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP

  // Clear inputs when switching roles or steps
  useEffect(() => {
    setPhoneNumber("");
    setOtp("");
    setStep(1);
  }, [authMode]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // STEP 1 → SEND OTP
    if (step === 1) {
      if (!phoneNumber.trim()) {
        showToast("Please enter phone number", "error");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/auth/login_send_otp.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: phoneNumber,
              role: authMode,
            }),
          },
        );

        const data = await response.json();
        // console.log("Send OTP:", data);

        if (data.status) {
          showToast("OTP sent successfully!", "success");
          setStep(2);
        } else {
          showToast(data.message || "Failed to send OTP", "error");
        }
      } catch (error) {
        // console.error("Send OTP Error:", error);
        showToast("Something went wrong", "error");
      }
    }

    // STEP 2 → VERIFY OTP
    else {
      if (!otp.trim()) {
        showToast("Please enter OTP", "error");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/auth/login_verify_otp.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: phoneNumber,
              otp: otp,
              role: authMode,
            }),
          },
        );

        const data = await response.json();
        // console.log("Verify OTP:", data);

        if (data.status) {
          // ✅ Save token
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("role", authMode);

          setIsAuthenticated(true);
          showToast("Logged in successfully!", "success");

          // Redirect
          if (authMode === "technician") {
            navigate("/tech");
          } else {
            navigate("/");
          }
        } else {
          showToast(data.message || "Invalid OTP", "error");
        }
      } catch (error) {
        // console.error("Verify OTP Error:", error);
        showToast("Something went wrong", "error");
      }
    }
  };
  return (
    <div className="h-full w-full bg-base overflow-y-auto relative scroll-smooth flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-brand/10 to-transparent -z-10" />

      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
        <button
          onClick={() => (step === 2 ? setStep(1) : navigate(-1))}
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
            {step === 1 ? "Welcome Back" : "Verify OTP"}
          </h1>
          <p className="text-brand/60 font-medium mt-1">
            {step === 1
              ? "Sign in to continue your journey"
              : `Enter the code sent to ${phoneNumber}`}
          </p>
        </div>

        {/* Role Selector - Only shown in step 1 */}
        {step === 1 && (
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
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                {authMode === "technician"
                  ? "Technician Mobile Number"
                  : "Mobile Number"}
              </label>
              <div className="relative group">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${step === 2 ? "text-brand/20" : "text-brand/30 group-focus-within:text-brand"}`}
                >
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={step === 2}
                  placeholder="+91 00000 00000"
                  className={`w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none transition-all placeholder:text-brand/20 shadow-sm ${step === 2 ? "opacity-60 bg-brand/5" : "focus:ring-4 focus:ring-brand/5 focus:border-brand/40"}`}
                  required
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                    Enter OTP
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                      maxLength={6}
                      required
                    />
                  </div>
                  <div className="mt-4 flex justify-between px-1">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[11px] font-bold text-brand hover:underline"
                    >
                      Change Number
                    </button>
                    <button
                      type="button"
                      className="text-[11px] font-bold text-brand/40"
                    >
                      Resend in 0:30
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            className={`w-full py-4 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-3 text-[15px] font-black tracking-normal ${authMode === "technician"
                ? "bg-emerald-600 shadow-emerald-600/20 text-white hover:brightness-110"
                : "bg-brand shadow-brand/20 text-white hover:shadow-2xl hover:shadow-brand/30 hover:-translate-y-0.5"
              }`}
          >
            {step === 1
              ? "Send Security Code"
              : authMode === "technician"
                ? "Access Dashboard"
                : "Login Securely"}
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
    </div>
  );
};
