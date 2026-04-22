import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, ChevronLeft, User, Phone, Mail, MapPin, Check, Search } from "lucide-react";
import { Logo } from "../ui/Logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { mainCategories } from "../../data/services";

export const RegisterScreen = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, authMode, setAuthMode } = useAuth();
  
  // App Steps
  const [step, setStep] = useState(1); // 1: Name/Phone, 2: OTP, 3: Details, 4: Services (Tech only)
  
  // Form State
  const [formData, setFormData] = useState({
    phoneNumber: "",
    otp: "",
    fullName: "",
    email: "",
    pincode: "",
    city: "",
    state: "",
    address: "",
    selectedServices: []
  });

  // Clear state when switching roles
  useEffect(() => {
    setFormData({
      phoneNumber: "",
      otp: "",
      fullName: "",
      email: "",
      pincode: "",
      city: "",
      state: "",
      address: "",
      selectedServices: []
    });
    setStep(1);
  }, [authMode]);

  const handleNext = (e) => {
    if (e) e.preventDefault();
    
    if (step === 1) {
      setStep(2); // Move to OTP
    } else if (step === 2) {
      setStep(3); // Move to Details
    } else if (step === 3) {
      if (authMode === "technician") {
        setStep(4); // Move to Services
      } else {
        handleFinalSubmit();
      }
    } else if (step === 4) {
      handleFinalSubmit();
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
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(id)
        ? prev.selectedServices.filter(s => s !== id)
        : [...prev.selectedServices, id]
    }));
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  placeholder="John Doe"
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">Mobile Number</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                  <Phone size={18} />
                </div>
                <input 
                  type="tel" 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
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
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">Verification Code</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                  <Shield size={18} />
                </div>
                <input 
                  type="text" 
                  value={formData.otp}
                  onChange={(e) => setFormData({...formData, otp: e.target.value})}
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                  maxLength={6}
                  required
                />
              </div>
              <p className="text-[11px] font-medium text-brand/50 mt-3 px-1">Code sent to {formData.phoneNumber}</p>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                  required
                />
              </div>
            </div>

            {authMode === "technician" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">City</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                      <MapPin size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="Mumbai"
                      className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">State</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                      <MapPin size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      placeholder="MH"
                      className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">Full Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-[1.125rem] text-brand/30 group-focus-within:text-brand transition-colors">
                  <MapPin size={18} />
                </div>
                <textarea 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="House No, Street, Landmark..."
                  rows={2}
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm resize-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em] mb-2 px-1">Pincode</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
                  <MapPin size={18} />
                </div>
                <input 
                  type="text" 
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full bg-white border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
                  required
                />
              </div>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <label className="block text-[11px] font-black text-brand/40 uppercase tracking-[0.1em]">Select Your Services</label>
                <span className="text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                  {formData.selectedServices.length} Selected
                </span>
             </div>
             
             <div className="grid grid-cols-2 gap-3 pb-20">
                {mainCategories.map((cat) => {
                  const isSelected = formData.selectedServices.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleService(cat.id)}
                      className={`relative aspect-[4/3] rounded-3xl overflow-hidden border-2 transition-all group ${
                        isSelected ? "border-brand shadow-lg scale-[0.98]" : "border-transparent"
                      }`}
                    >
                      <div className={`absolute inset-0 transition-opacity bg-brand ${isSelected ? "opacity-100" : "opacity-0"}`} />
                      <div className={`absolute inset-0 bg-white/90 group-hover:bg-brand/5 transition-colors ${isSelected ? "hidden" : "block"}`} />
                      
                      <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 transition-all ${
                            isSelected ? "bg-white text-brand" : "bg-brand/10 text-brand"
                         }`}>
                            <cat.icon size={24} />
                         </div>
                         <p className={`text-[13px] font-bold text-center leading-tight transition-colors ${
                            isSelected ? "text-white" : "text-brand"
                         }`}>
                           {cat.name}
                         </p>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-white text-brand rounded-full p-1 shadow-sm">
                           <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                    </button>
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
          onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-brand"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 text-brand" />
          <span className="font-black text-xl tracking-tight text-brand">Dorcas</span>
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
              {step === 1 ? "Send Verification" : step === 4 ? "Complete Profile & Enter Dashboard" : (step === 3 && authMode === "customer" ? "Create Account" : "Continue")}
              {authMode === "technician" ? <Zap size={18} /> : <Shield size={18} />}
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
