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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { mainCategories } from "../../../data/services";
import { API_BASE } from "../../../config";

export const RegisterScreen = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, authMode, setAuthMode } = useAuth();
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
    area: "", // ✅ NEW
    address: "",
    landmark: "", // optional (good UX)
    referralCode: "",
    latitude: "",
    longitude: "",
    selectedServices: [],
  });

  // Clear state when switching roles
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

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Location not supported");
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
          console.error(err);
          alert("Failed to fetch location details");
        }

        setLoadingLocation(false);
      },
      () => {
        alert("Permission denied. Please enter manually.");
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
        alert("Please enter a phone number");
        return;
      }
      
      // Validate Indian phone number (10 digits, starts with 6-9)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/\D/g, ''))) {
        alert("Please enter a valid Indian phone number (10 digits starting with 6-9)");
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
          setStep(2);
        } else {
          alert(data.message || "Failed to send OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Error sending OTP. Please try again.");
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
          setStep(3);
        } else {
          alert(data.message || "Please Add Correct OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        alert("Error sending OTP. Please try again.");
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
            alert(data.message || "  try again.");
          }
        } catch (error) {
          console.error("Error : ", error.toString());
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
          alert(data.message || "Failed to complete profile");
        }
      } catch (error) {
        console.error("Step 4 Error:", error);
        alert("Something went wrong");
      }
    }
  };

  const handleFinalSubmit = () => {
    setIsAuthenticated(true);
    if (authMode === "technician") {
      navigate("/tech");
    } else {
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
            <button
              type="button"
              onClick={getLocation}
              className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-bold"
            >
              {loadingLocation ? "Fetching location..." : "📍 Use My Location"}
            </button>
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
            className="space-y-4"
          >
            <div className="flex items-center justify-between px-1">
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em]">
                Select Your Services
              </label>
              <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                {formData.selectedServices.length} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 pb-20">
              {categories.map((category) => (
                <div key={category.id} className="mb-4">
                  {/* Category Card */}
                  <button
                  type="button"
                    onClick={() =>
                      setOpenCategory(
                        openCategory === category.id ? null : category.id,
                      )
                    }
                    className="w-full p-4 bg-white rounded-2xl shadow-sm flex justify-between items-center"
                  >
                    <span className="font-bold">{category.category_name}</span>
                    <span>{openCategory === category.id ? "▲" : "▼"}</span>
                  </button>

                  {/* Services */}
                  {openCategory === category.id && (
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {category.services.map((service) => {
                        const isSelected = formData.selectedServices.includes(
                          service.id,
                        );

                        return (
                          <button
                          type="button"
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`p-3 rounded-xl border ${
                              isSelected ? "bg-brand text-white" : "bg-white"
                            }`}
                          >
                            {service.service_name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
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
              className={`w-full py-4 rounded-2xl shadow-xl transition-all flex justify-center items-center gap-3 text-[15px] font-black tracking-normal ${
                authMode === "technician"
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
    </div>
  );
};
