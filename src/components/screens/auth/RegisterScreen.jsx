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
  Search,
} from "lucide-react";
import { Logo } from "../../ui/Logo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";

export const RegisterScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralParam = searchParams.get("refer");
  const { setIsAuthenticated, authMode, setAuthMode } = useAuth();
  const { showToast } = useToast();
  const [loadingLocation, setLoadingLocation] = useState("");
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
    agreedToTerms: false,
  });

  useEffect(() => {
    if (referralParam) {
      setFormData(prev => ({ ...prev, referralCode: referralParam }));
    }
  }, [referralParam]);

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Auto-check location on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'prompt') {
          setShowLocationModal(true);
        } else if (result.state === 'granted') {
          getLocation();
        }
      });
    } else {
      setShowLocationModal(true);
    }
  }, []);
  useEffect(() => {
    setFormData({
      phoneNumber: "",
      otp: "",
      name: "",
      email: "",
      pincode: "",
      city: "",
      state: "",
      area: "", // ✅ NEW
      address: "",
      landmark: "", // optional (good UX)
      referralCode: "",
      latitude: "",
      longitude: "",
      selectedServices: [],
      agreedToTerms: false,
    });
  }, [authMode]);

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

  const getLocation = () => {
    if (!navigator.geolocation) {
      showToast("Location not supported", "error");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
          );

          const data = await res.json();
          const addr = data.address || {};

          setFormData((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            city: addr.city || addr.town || addr.village || "",
            state: addr.state || "",
            pincode: addr.postcode || "",
            area: addr.suburb || addr.neighbourhood || addr.city_district || "",
            address: data.display_name || "",
          }));
        } catch (err) {
          // console.error(err);
          showToast("Failed to fetch location details", "error");
        }

        setLoadingLocation(false);
      },
      () => {
        showToast("Permission denied. Please enter manually.", "error");
        setLoadingLocation(false);
      },
    );
  };

  const handleNext = async (e) => {
    if (e) e.preventDefault();
    console.log("Here", authMode);
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
        console.log(data);

        if (data.status) {
          showToast("OTP sent successfully!", "success");
          setStep(2);
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
        console.log(data);
        if (data.status) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("role", authMode);
          showToast("Phone verified successfully!", "success");
          setStep(3);
        } else {
          showToast(data.message || "Invalid OTP", "error");
        }
      } catch (error) {
        // console.error("Error sending OTP:", error);
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
          console.log(data);

          if (data.status) {
            handleFinalSubmit();
          } else {
            showToast(data.message || "Registration failed", "error");
          }
        } catch (error) {
          // console.error("Error : ", error.toString());
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
              services: formData.selectedServices, // 👈 important
            }),
          },
        );

        const data = await response.json();
        console.log("Step 4 Response:", data);

        if (data.status) {
          handleFinalSubmit();
        } else {
          showToast(data.message || "Failed to complete profile", "error");
        }
      } catch (error) {
        // console.error("Step 4 Error:", error);
        showToast("Something went wrong", "error");
      }
    }
  };

  const handleFinalSubmit = () => {
    if (authMode === "technician") {
      setShowSuccessModal(true);
    } else {
      setIsAuthenticated(true);
      navigate("/");
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
            className="space-y-4"
          >
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
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="John Doe"
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
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="+91 00000 00000"
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start gap-3 px-1 pt-2">
              <input
                type="checkbox"
                id="reg-terms"
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                className="mt-1 w-4 h-4 rounded border-brand/20 text-brand focus:ring-brand/20"
              />
              <label htmlFor="reg-terms" className="text-[12px] font-medium text-brand/60 leading-snug">
                I agree to the <button type="button" className="text-brand font-bold hover:underline">Terms of Service</button> and <button type="button" className="text-brand font-bold hover:underline">Privacy Policy</button>
              </label>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                Verification Code
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                  <Shield size={18} />
                </div>
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) =>
                    setFormData({ ...formData, otp: e.target.value })
                  }
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-[11px] font-medium text-brand/50 mt-3 px-1">
                Code sent to {formData.phoneNumber}
              </p>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                  required
                />
              </div>
            </div>

            {authMode === "technician" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                    City
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      placeholder="Mumbai"
                      className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                    State
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                      <MapPin size={18} />
                    </div>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      placeholder="MH"
                      className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
            {loadingLocation && (
              <div className="flex items-center gap-2 px-3 py-2 bg-brand/5 rounded-xl border border-brand/10">
                <div className="w-3 h-3 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-brand/60 tracking-wider uppercase">Detecting Location...</span>
              </div>
            )}
            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                Full Address
              </label>
              <div className="relative group">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[11px] font-black text-brand/40 uppercase mb-2 px-1">
                      Room No / Building Name
                    </label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) =>
                        setFormData({ ...formData, landmark: e.target.value })
                      }
                      placeholder="Flat 101, Sunshine Apartments"
                      className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 px-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div>
                    <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                      placeholder="Andheri West"
                      className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 px-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all shadow-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-4">
                  <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                    Address
                  </label>
                  <textarea
                    className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 px-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all shadow-sm"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  ></textarea>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">
                Pincode
              </label>
              <div className="relative group">
                <input
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 px-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all shadow-sm"
                  type="text"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase mb-2 px-1">
                Referral Code (Optional)
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
                placeholder="Enter referral code"
                className="w-full bg-white border border-brand/10 rounded-2xl py-4 px-4 text-[15px] font-semibold"
              />
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-brand/5 rounded-3xl p-6 border border-brand/10">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-black text-brand uppercase tracking-[0.1em]">
                  Available Services
                </label>
                <span className="text-[10px] font-black text-white bg-brand px-3 py-1 rounded-full shadow-lg shadow-brand/20">
                  {formData.selectedServices.length} Selected
                </span>
              </div>
              <p className="text-[12px] font-medium text-brand/60 leading-snug">
                Choose the categories and specific services you are qualified to provide.
              </p>
            </div>

            <div className="space-y-4 pb-12">
              {categories.map((category) => {
                const isOpen = openCategory === category.id;
                const selectedCount = category.services.filter(s => formData.selectedServices.includes(s.id)).length;
                
                return (
                  <div key={category.id} className="group">
                    {/* Category Header */}
                    <button
                      type="button"
                      onClick={() => setOpenCategory(isOpen ? null : category.id)}
                      className={`w-full p-5 rounded-2xl flex justify-between items-center transition-all border ${
                        isOpen 
                          ? "bg-white border-brand shadow-xl shadow-brand/5 ring-4 ring-brand/5" 
                          : "bg-white border-brand/10 hover:border-brand/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          isOpen ? "bg-brand text-white" : "bg-brand/5 text-brand"
                        }`}>
                          <img src={category.category_img} alt="" />
                        </div>
                        <div className="text-left">
                          <span className={`block font-black text-sm tracking-tight transition-colors ${
                            isOpen ? "text-brand" : "text-brand/80"
                          }`}>
                            {category.category_name}
                          </span>
                          {selectedCount > 0 && (
                            <span className="text-[10px] font-bold text-emerald-600 block">
                              {selectedCount} services selected
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                        isOpen ? "bg-brand/10 text-brand rotate-180" : "bg-brand/5 text-brand/40"
                      }`}>
                        <ChevronLeft size={16} className="-rotate-90" />
                      </div>
                    </button>

                    {/* Services Grid (Accordion) */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-2 gap-3 px-1">
                            {category.services.map((service) => {
                              const isSelected = formData.selectedServices.includes(service.id);

                              return (
                                <motion.button
                                  whileTap={{ scale: 0.97 }}
                                  type="button"
                                  key={service.id}
                                  onClick={() => toggleService(service.id)}
                                  className={`p-4 rounded-xl border text-xs font-bold transition-all flex flex-col gap-3 relative overflow-hidden text-left ${
                                    isSelected 
                                      ? "bg-brand border-brand text-white shadow-lg shadow-brand/20" 
                                      : "bg-white border-brand/5 text-brand/60 hover:border-brand/20"
                                  }`}
                                >
                                  {isSelected && (
                                    <motion.div 
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-bl-xl flex items-center justify-center"
                                    >
                                      <Check size={12} className="text-brand" strokeWidth={4} />
                                    </motion.div>
                                  )}
                                  <span className="relative z-10">{service.service_name}</span>
                                  <span className={`text-[10px] font-medium opacity-60 ${isSelected ? "text-white" : "text-brand/40"}`}>
                                    Professional Service
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
    <div className="h-full w-full bg-base overflow-y-auto relative scroll-smooth flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-brand/10 to-transparent -z-10" />

      <div className="px-6 pt-12 pb-6 flex items-center justify-between">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : navigate(-1))}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-brand" />
          <span className="font-black text-xl tracking-tight text-brand">
            Dorcasaid
          </span>
        </div>
        <div className="w-10" />
      </div>

      <div className="px-6 pb-24 pt-4">
        <div className="mt-4 mb-8">
          <h1 className="text-3xl font-black text-brand tracking-normal">
            {step === 4 ? "Specialties" : "Create Account"}
          </h1>
          <p className="text-brand/60 font-medium mt-1">
            {step === 1 && "Join the community of trusted services"}
            {step === 2 && "Verification code sent to your phone"}
            {step === 3 && "Tell us a bit about yourself"}
            {step === 4 && "Select all services you can provide"}
          </p>
        </div>

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

        <form onSubmit={handleNext} className="space-y-5 pb-10">
          {renderStep()}

          <div className="pt-4">
            <button
              type="submit"
              disabled={step === 4 && formData.selectedServices.length === 0}
              className={`w-full py-4 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-3 text-[15px] font-black tracking-normal ${authMode === "technician"
                  ? "bg-emerald-600 shadow-emerald-600/20 text-white hover:brightness-110 disabled:opacity-50 disabled:grayscale"
                  : "bg-brand shadow-brand/20 text-white hover:shadow-2xl hover:shadow-brand/30 hover:-translate-y-0.5"
                }`}
            >
              {step === 1
                ? "Send Verification"
                : step === 4
                  ? "Complete Profile & Enter Dashboard"
                  : step === 3 && authMode === "customer"
                    ? "Create Account"
                    : "Continue"}
              {authMode === "technician" ? (
                <Zap size={18} />
              ) : (
                <Shield size={18} />
              )}
            </button>
          </div>
        </form>

        <div className="mt-auto pt-10 text-center">
          <p className="text-brand/40 text-xs font-medium">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-brand font-black hover:underline"
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
              className="absolute inset-0 bg-brand/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-sm rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
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
                  onClick={() => {
                    getLocation();
                    setShowLocationModal(false);
                  }}
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
