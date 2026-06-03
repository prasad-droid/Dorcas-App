import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Zap,
  ChevronLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Check,
} from "lucide-react";
import { Logo } from "../../ui/Logo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { AndroidSmsRetriever } from '@capgo/capacitor-android-sms-retriever';

export const RegisterScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralParam = searchParams.get("refer");
  const { setIsAuthenticated, authMode, setAuthMode } = useAuth();
  const { showToast } = useToast();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  // App Steps
  const [step, setStep] = useState(1); // 1: Name/Phone, 2: OTP, 3: Details, 4: Services (Tech only)

  // Form State
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
    name: "",
    email: "",
    pincode: "",
    city: "",
    state: "",
    area: "",
    address: "",
    landmark: "",
    referralCode: referralParam || "",
    latitude: "",
    longitude: "",
    selectedServices: [],
    agreedToTerms: true,
  });

  const isTech = authMode === "technician";
  const fontClass = isTech ? "font-tech" : "font-sans";

  useEffect(() => {
    if (referralParam) {
      setFormData(prev => ({ ...prev, referralCode: referralParam }));
    }
  }, [referralParam]);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Auto-check location on mount
  useEffect(() => {
    const checkLocation = async () => {
      if (Capacitor.isNativePlatform()) {
        const perm = await Geolocation.checkPermissions();
        if (perm.location === 'granted') {
          getLocation();
        } else if (perm.location === 'prompt') {
          setShowLocationModal(true);
        }
      } else if (navigator.permissions) {
        try {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          if (result.state === 'granted') {
            getLocation();
          } else if (result.state === 'prompt') {
            setShowLocationModal(true);
          }
        } catch (e) {
          setShowLocationModal(true);
        }
      } else {
        setShowLocationModal(true);
      }
    };
    checkLocation();
  }, []);

  // Fetch categories for services
  useEffect(() => {
    fetch(`${API_BASE}/services/get_services.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setCategories(data.data);
        }
      });
  }, []);

  // Auto-fetch location on mount
  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async (isManual = false) => {
    setLoadingLocation(true);
    try {
      let coordinates;
      if (Capacitor.isNativePlatform()) {
        const perm = await Geolocation.checkPermissions();
        if (perm.location !== 'granted') {
          const req = await Geolocation.requestPermissions();
          if (req.location !== 'granted') throw new Error("Permission denied");
        }
        coordinates = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000
        });
      } else {
        if (!navigator.geolocation) {
          if (isManual) showToast("Location not supported by your browser", "error");
          setLoadingLocation(false);
          return;
        }
        coordinates = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000
          });
        });
      }

      if (coordinates) {
        const lat = coordinates.coords.latitude;
        const lng = coordinates.coords.longitude;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
          {
            headers: {
              'User-Agent': 'DorcasApp/1.0'
            }
          }
        );

        const data = await res.json();
        const addr = data.address || {};

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          city: addr.city || addr.town || addr.village || prev.city,
          state: addr.state || prev.state,
          pincode: addr.postcode || prev.pincode,
          area: addr.suburb || addr.neighbourhood || addr.city_district || addr.subdistrict || prev.area,
          address: data.display_name || prev.address,
          landmark: addr.house_number || addr.building || prev.landmark,
        }));

        if (isManual) showToast("Location updated successfully", "success");
      }
    } catch (error) {
      if (isManual) showToast("Could not detect location. Please enter manually.", "error");
      console.error("Location Error:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleNext = async (e) => {
    if (e) e.preventDefault();
    if (step === 1) {
      // Validate phone number and send OTP
      if (!formData.phoneNumber.trim()) {
        showToast("Please enter a phone number", "error");
        return;
      }

      // Validate Indian phone number (10 digits, starts with 6-9)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
        showToast("Please enter a valid Indian phone number", "error");
        return;
      }

      if (!formData.agreedToTerms) {
        showToast("Please agree to the Terms and Conditions", "error");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE}/auth/send_otp.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.name,
              phone: formData.phoneNumber,
              role: authMode,
            }),
          },
        );

        const data = await response.json();

        if (data.status) {
          showToast("OTP sent successfully!", "success");
          setStep(2);

          // Start SMS Retriever for real auto-fetch
          if (Capacitor.isNativePlatform()) {
            try {

              const setupListener = async () => {
                const listener = await AndroidSmsRetriever.addListener('smsReceived', (event) => {
                  const otpMatch = event.message.match(/\d{6}/);
                  if (otpMatch) {
                    setFormData(prev => ({ ...prev, otp: otpMatch[0] }));
                    showToast("OTP auto-filled from SMS", "success");
                  }
                  listener.remove();
                });
                await AndroidSmsRetriever.startWatch();
              };

              setupListener();
            } catch (e) {
              console.warn("SMS Retriever not available", e);
            }
          }

          // Keep simulation for non-native/fallback
          if (!Capacitor.isNativePlatform()) {
            setTimeout(() => {
              setFormData(prev => ({ ...prev, otp: "" }));
              showToast("OTP auto-filled (Simulation)", "info");
            }, 3000);
          }
        } else {
          showToast(data.message || "Failed to send OTP", "error");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        showToast("Error sending OTP. Please try again.", "error");
      }
    }
    // Step 2 Verify OTP
    else if (step === 2) {
      try {
        const response = await fetch(
          `${API_BASE}/auth/verify_otp.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              phone: formData.phoneNumber,
              otp: formData.otp,
              role: authMode,
            }),
          },
        );

        const data = await response.json();
        if (data.status) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("role", authMode);
          showToast("Phone verified successfully!", "success");
          setStep(3);
        } else {
          showToast(data.message || "Invalid OTP", "error");
        }
      } catch (error) {
        showToast("Error verifying OTP. Please try again.", "error");
      }
    }
    // Additional Details
    else if (step === 3) {
      if (authMode === "technician") {
        setStep(4); // Move to Services
      } else {
        try {
          const response = await fetch(
            `${API_BASE}/auth/complete-profile.php`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
                role: authMode,
              },
              body: JSON.stringify(formData),
            },
          );

          const data = await response.json();

          if (data.status) {
            handleFinalSubmit();
          } else {
            showToast(data.message || "Registration failed", "error");
          }
        } catch (error) {
          showToast("Something went wrong", "error");
        }
      }
    } else if (step === 4) {
      try {
        const response = await fetch(
          `${API_BASE}/auth/complete-profile.php`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
              role: authMode,
            },
            body: JSON.stringify({
              ...formData,
              services: formData.selectedServices,
            }),
          },
        );

        const data = await response.json();

        if (data.status) {
          handleFinalSubmit();
        } else {
          showToast(data.message || "Failed to complete profile", "error");
        }
      } catch (error) {
        showToast("Something went wrong", "error");
      }
    }
  };

  const handleFinalSubmit = () => {
    if (authMode === "technician") {
      setShowSuccessModal(true);
    } else {
      setIsAuthenticated(true);
      navigate("/", { replace: true });
    }
  };

  const toggleService = (id) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter((s) => s !== id)
        : [...prev.selectedServices, id],
    }));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 overflow-y-auto max-h-[50dvh] remove-scrollbar pr-0.5"
          >
            <div>
              <label className={`block text-xs font-black uppercase tracking-[0.1em] mb-1.5 px-1 ${isTech ? "text-emerald-700/80" : "text-brand/70"}`}>
                Full Name
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isTech ? "text-emerald-600/30 group-focus-within:text-emerald-600" : "text-brand/30 group-focus-within:text-brand"}`}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                  className={`w-full bg-white border rounded-2xl py-3 pl-12 pr-4 text-base font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-emerald-600/20 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-gray-900 text-brand focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
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
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData({ ...formData, phoneNumber: val });
                  }}
                  placeholder="00000 00000"
                  className={`w-full bg-white border rounded-2xl py-3 pl-20 pr-4 text-base font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-emerald-600/20 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-gray-900 text-brand focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
                  required
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-3 px-1 pt-1">
              <input
                type="checkbox"
                id="reg-terms"
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                className={`mt-1 w-4 h-4 rounded border-brand/20 focus:ring-brand/20 ${isTech ? "text-emerald-600 focus:ring-emerald-600/20 border-emerald-600/20" : "text-brand"}`}
              />
              <label htmlFor="reg-terms" className={`text-[11px] font-semibold leading-snug ${isTech ? "text-emerald-800/60" : "text-brand/60"}`}>
                I agree to the <a href="https://dorcasaid.com/terms-condition.php" className={`font-black hover:underline ${isTech ? "text-emerald-600" : "text-brand"}`}>Terms of Service</a> and <a href="https://dorcasaid.com/privacy-policy.php" className={`font-black hover:underline ${isTech ? "text-emerald-600" : "text-brand"}`}>Privacy Policy</a>
              </label>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 overflow-y-auto max-h-[50dvh] remove-scrollbar pr-0.5"
          >
            <div>
              <label className={`block text-xs font-black uppercase tracking-[0.1em] mb-1.5 px-1 ${isTech ? "text-emerald-700/80" : "text-brand/70"}`}>
                Verification Code
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isTech ? "text-emerald-600/30 group-focus-within:text-emerald-600" : "text-brand/30 group-focus-within:text-brand"}`}>
                  <Shield size={18} />
                </div>
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                  placeholder="Enter 6-digit OTP"
                  className={`w-full bg-white border rounded-2xl py-3.5 pl-12 pr-4 text-base font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-emerald-600/20 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-gray-900 text-brand focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
                  maxLength={6}
                  required
                />
              </div>
              <p className={`text-[10px] font-bold mt-2 px-1 ${isTech ? "text-emerald-800/50" : "text-brand/50"}`}>
                Code sent to +91 {formData.phoneNumber}
              </p>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3 overflow-y-auto max-h-[52dvh] remove-scrollbar pr-0.5 pb-2"
          >
            <div>
              <label className={`block text-[10px] font-black uppercase tracking-[0.1em] mb-1 px-1 ${isTech ? "text-emerald-700/80" : "text-brand/70"}`}>
                Email Address
              </label>
              <div className="relative group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isTech ? "text-emerald-600/30 group-focus-within:text-emerald-600" : "text-brand/30 group-focus-within:text-brand"}`}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className={`w-full bg-white border rounded-2xl py-2.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-emerald-600/20 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-gray-900 text-brand focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-[0.1em] mb-1 px-1 ${isTech ? "text-emerald-700/80" : "text-brand/70"}`}>
                  City
                </label>
                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isTech ? "text-emerald-600/30 group-focus-within:text-emerald-600" : "text-brand/30 group-focus-within:text-brand"}`}>
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="City"
                    className={`w-full bg-white border rounded-2xl py-2.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-emerald-600/20 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-gray-900 text-brand focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
                    required
                  />
                </div>
              </div>
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-[0.1em] mb-1 px-1 ${isTech ? "text-emerald-700/80" : "text-brand/70"}`}>
                  State
                </label>
                <div className="relative group">
                  <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isTech ? "text-emerald-600/30 group-focus-within:text-emerald-600" : "text-brand/30 group-focus-within:text-brand"}`}>
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="State"
                    className={`w-full bg-white border rounded-2xl py-2.5 pl-12 pr-4 text-sm font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-emerald-600/20 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-gray-900 text-brand focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
                    required
                  />
                </div>
              </div>
            </div>

            {loadingLocation && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${isTech ? "bg-emerald-50 border-emerald-100" : "bg-brand/5 border-brand/10"}`}>
                <div className={`w-3 h-3 border-2 border-t-transparent rounded-full animate-spin ${isTech ? "border-emerald-600" : "border-brand"}`} />
                <span className={`text-[9px] font-bold tracking-wider uppercase ${isTech ? "text-emerald-700/80" : "text-brand/60"}`}>Detecting Location...</span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1 px-1">
                <label className={`block text-[10px] font-black uppercase tracking-[0.1em] ${isTech ? "text-emerald-700/80" : "text-brand/70"}`}>
                  Full Address
                </label>
                <button
                  type="button"
                  onClick={() => getLocation(true)}
                  className={`flex items-center gap-1.5 transition-colors ${isTech ? "text-emerald-600 hover:text-emerald-700" : "text-brand hover:text-brand/80"}`}
                >
                  <MapPin size={12} className={isTech ? "text-emerald-600" : "text-brand"} />
                  <span className="text-[9px] font-black uppercase tracking-wider">Detect</span>
                </button>
              </div>
              <div className="relative group">
                <textarea
                  className={`w-full bg-white border rounded-2xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-emerald-600/20 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-gray-900 text-brand focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
                  placeholder="Street address, building name, flat number, etc."
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows={2}
                  required
                ></textarea>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[10px] font-black uppercase tracking-[0.1em] mb-1 px-1 ${isTech ? "text-emerald-700/80" : "text-brand/70"}`}>
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="6-digit Pincode"
                  className={`w-full bg-white border rounded-2xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-emerald-600/20 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-gray-900 text-brand focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className={`block text-[10px] font-black uppercase mb-1 px-1 ${isTech ? "text-emerald-700/80" : "text-brand/70"}`}>
                  Referral Code
                </label>
                <input
                  type="text"
                  value={formData.referralCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      referralCode: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Code (Optional)"
                  className={`w-full bg-white border rounded-2xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm ${isTech ? "border-emerald-600/20 text-emerald-700 focus:ring-emerald-500/5 focus:border-emerald-600/40 placeholder:text-emerald-600/40" : "border-gray-900 text-brand focus:ring-brand/5 focus:border-brand/40 placeholder:text-brand/45"}`}
                />
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 overflow-y-auto max-h-[50dvh] remove-scrollbar pr-0.5"
          >
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.1em]">
                  Available Services
                </label>
                <span className="text-[9px] font-black text-white bg-emerald-600 px-2 py-0.5 rounded-full shadow-lg">
                  {formData.selectedServices.length} Selected
                </span>
              </div>
              <p className="text-[11px] font-semibold text-emerald-800/60 leading-snug">
                Choose the categories and specific services you are qualified to provide.
              </p>
            </div>

            <div className="space-y-3 pb-4">
              {categories.map((category) => {
                const isOpen = openCategory === category.id;
                const selectedCount = category.services.filter(s => formData.selectedServices.includes(s.id)).length;

                return (
                  <div key={category.id} className="group">
                    {/* Category Header */}
                    <button
                      type="button"
                      onClick={() => setOpenCategory(isOpen ? null : category.id)}
                      className={`w-full p-4 rounded-2xl flex justify-between items-center transition-all border ${isOpen
                          ? "bg-white border-emerald-600 shadow-lg shadow-emerald-600/5 ring-4 ring-emerald-500/5"
                          : "bg-white border-emerald-600/10 hover:border-emerald-600/30"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? "bg-emerald-600 text-white animate-pulse" : "bg-emerald-50 text-emerald-600"
                          }`}>
                          <img src={`https://www.dorcasaid.com/admin/${category.category_img}`} alt="" className="w-5 h-5 object-contain" />
                        </div>
                        <div className="text-left">
                          <span className={`block font-black text-xs tracking-tight transition-colors ${isOpen ? "text-emerald-600" : "text-emerald-800/80"
                            }`}>
                            {category.category_name}
                          </span>
                          {selectedCount > 0 && (
                            <span className="text-[9px] font-bold text-emerald-600 block">
                              {selectedCount} selected
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? "bg-emerald-50 text-emerald-600 rotate-180" : "bg-emerald-50 text-emerald-600/40"
                        }`}>
                        <ChevronLeft size={12} className="-rotate-90" />
                      </div>
                    </button>

                    {/* Services Grid (Accordion) */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-2 px-0.5">
                            {category.services.map((service) => {
                              const isSelected = formData.selectedServices.includes(service.id);

                              return (
                                <motion.button
                                  whileTap={{ scale: 0.97 }}
                                  type="button"
                                  key={service.id}
                                  onClick={() => toggleService(service.id)}
                                  className={`p-3 rounded-xl border text-[10px] font-bold transition-all flex flex-col gap-2 relative overflow-hidden text-left ${isSelected
                                      ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20"
                                      : "bg-white border-emerald-600/10 text-emerald-800/60 hover:border-emerald-600/25"
                                    }`}
                                >
                                  {isSelected && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-bl-lg flex items-center justify-center"
                                    >
                                      <Check size={9} className="text-emerald-600" strokeWidth={4} />
                                    </motion.div>
                                  )}
                                  <span className="relative z-10">{service.service_name}</span>
                                  <span className={`text-[8px] font-medium opacity-60 ${isSelected ? "text-white" : "text-emerald-800/45"}`}>
                                    Professional
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`h-[100dvh] w-full bg-base overflow-hidden relative flex flex-col justify-between ${fontClass}`}>
      <div className={`absolute top-0 left-0 right-0 h-64 bg-gradient-to-b ${isTech ? "from-emerald-500/10" : "from-brand/10"} to-transparent -z-10`} />

      {/* App Bar / Header */}
      <div className="px-6 pt-12 pb-2 flex items-center justify-between shrink-0">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
          className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center ${isTech ? "text-emerald-600" : "text-brand"}`}
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Logo className={`w-8 h-8 ${isTech ? "text-emerald-600" : "text-brand"}`} />
          <span className={`font-black text-xl tracking-tight ${isTech ? "text-emerald-600" : "text-brand"}`}>
            Dorcasaid
          </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Main Content Form */}
      <div className="px-6 pb-6 pt-2 flex-1 flex flex-col justify-between overflow-hidden">
        <div>
          <div className="mt-1 mb-4">
            <h1 className={`text-2xl font-black tracking-normal ${isTech ? "text-emerald-600" : "text-brand"}`}>
              {step === 4 ? "Specialties" : "Create Account"}
            </h1>
            <p className={`text-sm font-semibold mt-0.5 ${isTech ? "text-emerald-800/60" : "text-brand/60"}`}>
              {step === 1 && "Join the community of trusted services"}
              {step === 2 && `Verification code sent to +91 ${formData.phoneNumber}`}
              {step === 3 && "Tell us a bit about yourself"}
              {step === 4 && "Select all services you can provide"}
            </p>
          </div>

          {step === 1 && (
            <div className={`flex p-1 rounded-2xl mb-5 border ${isTech ? "bg-emerald-50 border-emerald-100" : "bg-brand/5 border-brand/5"}`}>
              <button
                onClick={() => setAuthMode("customer")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${authMode === "customer" ? "bg-white text-brand shadow-md shadow-brand/10" : (isTech ? "text-emerald-600/40" : "text-brand/40")}`}
              >
                Customer
              </button>
              <button
                onClick={() => setAuthMode("technician")}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${authMode === "technician" ? "bg-white text-emerald-600 shadow-md shadow-emerald-600/10" : "text-brand/40"}`}
              >
                Technician
              </button>
            </div>
          )}

          <form onSubmit={handleNext} className="flex-1 flex flex-col justify-between overflow-hidden">
            {renderStep()}

            <div className="pt-4 shrink-0">
              <button
                type="submit"
                disabled={step === 4 && formData.selectedServices.length === 0}
                className={`w-full py-3.5 rounded-2xl shadow-lg transition-all flex justify-center items-center gap-2.5 text-base font-black tracking-normal ${isTech
                  ? "bg-emerald-600 shadow-emerald-600/20 text-white hover:brightness-110 disabled:opacity-50 disabled:grayscale"
                  : "bg-brand shadow-brand/20 text-white hover:-translate-y-0.5"
                  }`}
              >
                {step === 1
                  ? "Send Verification"
                  : step === 4
                    ? "Complete Profile & Enter Dashboard"
                    : step === 3 && authMode === "customer"
                      ? "Create Account"
                      : "Continue"}
                {isTech ? <Zap size={16} /> : <Shield size={16} />}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center pt-4 shrink-0">
          <p className={`text-xs font-semibold ${isTech ? "text-emerald-800/40" : "text-brand/40"}`}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className={`font-black hover:underline ${isTech ? "text-emerald-600" : "text-brand"}`}
            >
              Sign In
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
                <p className={`text-sm font-medium leading-relaxed mb-8 ${isTech ? "text-emerald-800/60" : "text-brand/60"}`}>
                  To provide you with the best experience and find nearby services, we need access to your location.
                </p>

                <button
                  onClick={() => {
                    getLocation();
                    setShowLocationModal(false);
                  }}
                  className={`w-full py-4 rounded-2xl font-black text-[15px] shadow-lg active:scale-95 transition-transform ${isTech ? "bg-emerald-600 text-white shadow-emerald-600/20" : "bg-brand text-white shadow-brand/20"}`}
                >
                  Allow Access
                </button>

                <button
                  onClick={() => setShowLocationModal(false)}
                  className={`mt-4 text-[11px] font-black uppercase tracking-[0.1em] transition-colors ${isTech ? "text-emerald-600/40 hover:text-emerald-600" : "text-brand/30 hover:text-brand"}`}
                >
                  I'll do it later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Technician Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-brand/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-500 mb-8">
                  <Check size={48} strokeWidth={3} />
                </div>

                <h3 className="text-2xl font-black text-brand tracking-tight mb-4">Registration Successful!</h3>
                <p className="text-sm font-medium text-brand/60 leading-relaxed mb-8">
                  Welcome to the partner community. To start receiving bookings, you must now complete your <span className="text-brand font-black">KYC verification</span>.
                </p>

                <div className="w-full space-y-4">
                  <button
                    onClick={() => {
                      setIsAuthenticated(true);
                      navigate("/tech");
                    }}
                    className="w-full bg-brand text-white py-4 rounded-2xl font-black text-[15px] shadow-xl shadow-brand/20 active:scale-95 transition-transform"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
