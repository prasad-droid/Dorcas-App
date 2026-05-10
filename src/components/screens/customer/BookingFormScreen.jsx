import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft, Bell, MapPin, Star, MessageSquare, Phone, User, Calendar, Clock, Map, AlignLeft, Info, Check, Shield, Wallet, Gift, Trophy
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useAuth } from "../../../context/AuthContext";
import { ScratchCard } from "../../ui/ScratchCard";
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

import { API_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";
import { MapPicker } from "../../ui/MapPicker";

export function BookingFormScreen() {
  const { serviceId, providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { setMyBookings, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();

  const [step, setStep] = useState("form"); // "form" or "success"
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [providerDetails, setProviderDetails] = useState(null);
  const [generatedCard, setGeneratedCard] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    pincode: "",
    date: "",
    time: "",
    instructions: "",
    paymentType: "Pay After Service",
    latitude: "",
    longitude: ""
  });

  const serviceName = queryParams.get("name") || "Home Cleaning";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        // 1. Fetch Profile Data to pre-fill
        const profileRes = await fetch(`${API_BASE}/profile/get_profile.php`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Role": role
          }
        });
        const profileData = await profileRes.json();
        if (profileData.status) {
          setFormData(prev => ({
            ...prev,
            fullName: profileData.data.name || "",
            phoneNumber: profileData.data.phone || "",
            address: profileData.data.address || "",
            city: profileData.data.city || "",
            pincode: profileData.data.pincode || ""
          }));
        }

        // 2. Fetch Provider Details (if one was chosen)
        if (providerId !== "0") {
          const vendorRes = await fetch(`${API_BASE}/vendors/get_vendor_details.php?vendor_id=${providerId}`);
          const vendorData = await vendorRes.json();
          if (vendorData.status) {
            setProviderDetails(vendorData.data);
          }
        }
      } catch (error) {

        console.error("Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    getLocation(true); // Auto-capture on mount (silent mode)
  }, [providerId]);

  const getLocation = async (silent = false) => {
    try {
      if (!silent) showToast("Detecting location...", "info");

      let coordinates;
      if (Capacitor.isNativePlatform()) {
        const perm = await Geolocation.checkPermissions();
        if (perm.location === 'granted') {
          coordinates = await Geolocation.getCurrentPosition({ timeout: 5000 });
        } else if (perm.location === 'prompt') {
          const req = await Geolocation.requestPermissions();
          if (req.location === 'granted') {
            coordinates = await Geolocation.getCurrentPosition();
          }
        }
      } else {
        // Web fallback
        if (!navigator.geolocation) {
          if (!silent) showToast("Location not supported", "error");
          return;
        }
        coordinates = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      }

      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      );

      const data = await res.json();
      const addr = data.address || {};

      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
        city: addr.city || addr.town || addr.village || prev.city,
        pincode: addr.postcode || prev.pincode,
        address: data.display_name || prev.address,
      }));
      if (!silent) showToast("Location updated!", "success");
    } catch (error) {
      if (!silent) showToast("Permission denied or location failed. Please enter manually.", "error");
    }
  };

  const handleMapLocationChange = async (lat, lng) => {
    try {
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
      
      // Reverse geocode to update address/city
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
      );
      const data = await res.json();
      const addr = data.address || {};
      
      setFormData(prev => ({
        ...prev,
        city: addr.city || addr.town || addr.village || prev.city,
        pincode: addr.postcode || prev.pincode,
        address: data.display_name || prev.address,
      }));
    } catch (error) {
      console.error("Map reverse geocode error:", error);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const response = await fetch(`${API_BASE}/bookings/create_booking.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Role": role
        },
        body: JSON.stringify({
          vendor_id: providerId,
          service_id: serviceId,
          booking_name: formData.fullName,
          booking_phone: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
          service_date: formData.date,
          service_time: formData.time,
          notes: formData.instructions,
          payment_mode: "cash",
          latitude: formData.latitude,
          longitude: formData.longitude
        })
      });

      const data = await response.json();
      console.log("Response Data:", data);
      
      if (data.status) {
        setGeneratedCard({ ...data.data.scratch_card, booking_id: data.data.booking_id });
        const newBooking = {
          id: `B-${data.data.booking_id}`,
          service: serviceName,
          date: formData.date,
          time: formData.time,
          status: "Confirmed",
          price: `₹${providerDetails?.price || "499"}`,
          provider: providerDetails?.name || "Professional",
          address: `${formData.address}, ${formData.city} - ${formData.pincode}`
        };

        setMyBookings(prev => [newBooking, ...prev]);
        showToast("Booking created successfully!", "success");
        setStep("success");
      } else {
        showToast(data.message || "Failed to create booking", "error");
      }
    } catch (error) {
      console.error("Booking Error:", error);
      showToast("Something went wrong while creating your booking.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 font-bold text-brand">{t('loading')}</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <BookingSuccessView
        details={{ ...formData, service: serviceName, price: `₹${providerDetails?.price || "499"}` }}
        card={generatedCard}
        onClose={() => navigate("/")}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col w-full h-full bg-[#f8fbff] overflow-y-auto remove-scrollbar relative"
    >
      {/* Background Graphic */}
      <div className="absolute top-0 w-full h-64 bg-brand/5 -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-5 z-30 sticky top-0 brand-gradient text-white shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl shadow-sm flex items-center justify-center border border-white/10 text-white"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-lg font-black">{t('booking') + ' ' + t('view_details')}</h1>
        <div className="w-11" />
      </div>

      <div className="px-6 pb-30">
        {/* Service Summary Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand/5 mb-8 mt-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
              <Shield size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-brand leading-tight">{serviceName}</h2>
              <p className="text-xs font-bold text-brand/40 uppercase tracking-widest mt-1">Premium Home Service</p>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleConfirm} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-brand/40 uppercase tracking-[2px] px-1">{t('personal_info')}</h3>

            <div className="grid grid-cols-1 gap-4">
              <FormInput icon={User} placeholder={t('full_name')} value={formData.fullName} onChange={(val) => setFormData({ ...formData, fullName: val })} />
              <FormInput icon={Phone} placeholder={t('mobile_number')} type="tel" value={formData.phoneNumber} onChange={(val) => setFormData({ ...formData, phoneNumber: val })} />
            </div>

            <div className="flex items-center justify-between mt-6 px-1">
              <h3 className="text-[11px] font-black text-brand/40 uppercase tracking-[2px]">{t('service_location')}</h3>
              <button
                type="button"
                onClick={() => getLocation(false)}
                className="text-[10px] font-black text-brand bg-brand/5 px-3 py-1.5 rounded-xl border border-brand/10 flex items-center gap-1.5 active:scale-95 transition-transform"
              >
                <MapPin size={12} className="text-brand" />
                {t('use_current_location')}
              </button>
            </div>

            <div className="mt-2 mb-4">
              <MapPicker 
                lat={formData.latitude} 
                lng={formData.longitude} 
                onLocationChange={handleMapLocationChange} 
              />
            </div>

            {formData.latitude && (
              <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-100 w-fit ml-1 -mt-2 mb-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-700">Location Captured: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}</span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4">
              <div className="relative group">
                <div className="absolute left-5 top-6 text-brand/20 group-focus-within:text-brand transition-colors">
                  <Map size={18} />
                </div>
                <textarea
                  placeholder="Full Address"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="w-full bg-white border border-brand/5 text-brand rounded-2xl pt-5.5 pb-4 pl-14 pr-6 text-[15px] font-bold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/20 transition-all placeholder:text-brand/20 shadow-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput icon={MapPin} placeholder={t('city')} value={formData.city} onChange={(val) => setFormData({ ...formData, city: val })} />
                <FormInput icon={MapPin} placeholder={t('pincode')} maxLength={6} value={formData.pincode} onChange={(val) => setFormData({ ...formData, pincode: val })} />
              </div>
            </div>

            <h3 className="text-[11px] font-black text-brand/40 uppercase tracking-[2px] px-1 mt-6">Schedule Preference</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormInput icon={Calendar} placeholder={t('service_date')} type="date" value={formData.date} onChange={(val) => setFormData({ ...formData, date: val })} />
              <FormInput icon={Clock} placeholder={t('preferred_time')} type="time" value={formData.time} onChange={(val) => setFormData({ ...formData, time: val })} />
            </div>

            <h3 className="text-[11px] font-black text-brand/40 uppercase tracking-[2px] px-1 mt-6">Additional Info</h3>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand/20 group-focus-within:text-brand transition-colors">
                <AlignLeft size={18} />
              </div>
              <input
                type="text"
                placeholder={t('special_instructions')}
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                className="w-full bg-white border border-brand/5 text-brand rounded-2xl py-4.5 pl-14 pr-6 text-[15px] font-bold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/20 transition-all placeholder:text-brand/20 shadow-sm"
              />
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-brand/[0.03] border border-brand/5 rounded-3xl p-6 mt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand font-black">
                <Wallet size={20} />
              </div>
              <h4 className="text-sm font-black text-brand">{t('payment_mode')}</h4>
            </div>

            <div className="bg-white border-2 border-brand rounded-2xl p-4 flex items-center justify-between mb-4">
              <span className="font-bold text-brand">{t('pay_after_service')}</span>
              <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" strokeWidth={4} />
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                <Info size={20} className="text-emerald-700" />
              </div>
              <p className="text-[11px] font-bold text-emerald-800 leading-relaxed">
                No payment needed now. Our professional will collect payment (cash or your preferred mode) after completing the service.
              </p>
            </div>
          </div>

          {/* Scratch Card Promo */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl mt-8">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                <Gift size={28} className="animate-bounce" />
              </div>
              <div>
                <h5 className="font-black text-lg leading-tight">You'll get a Scratch Card!</h5>
                <p className="text-[11px] font-bold text-white/70">Win up to <span className="text-white font-black">₹499 reward points</span> added to your wallet after booking.</p>
              </div>
            </div>
          </div>

          {/* Service Amount and Confirm Booking at the end */}
          <div className="mt-8 pt-8 border-t border-brand/5 space-y-6">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[11px] font-black text-brand/30 uppercase tracking-[2px] block mb-1">{t('total_amount')}</span>
                <span className="text-2xl font-black text-brand tracking-tighter">₹{providerDetails?.price || "499"}</span>
              </div>
              {providerDetails?.rating && (
                <button type="button" className="flex items-center gap-1.5 text-[11px] font-black text-brand bg-brand/5 px-3 py-1.5 rounded-xl border border-brand/10">
                  <Star size={12} className="fill-brand" /> {providerDetails.rating} Rating
                </button>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className={`w-full brand-gradient text-white py-5 rounded-[2rem] text-[17px] font-black shadow-[0_15px_35px_rgba(21,84,171,0.3)] transition-all flex items-center justify-center gap-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              {isSubmitting ? t('loading') : t('confirm_booking')}
              {!isSubmitting && <Shield size={20} />}
            </motion.button>
          </div>


        </form>
      </div>
    </motion.div>
  );
}

function FormInput({ icon: Icon, placeholder, type = "text", value, onChange, maxLength }) {
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand/20 group-focus-within:text-brand transition-colors">
        <Icon size={18} />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        required
        className="w-full bg-white border border-brand/5 text-brand rounded-2xl py-4.5 pl-14 pr-6 text-[15px] font-bold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/20 transition-all placeholder:text-brand/20 shadow-sm"
      />
    </div>
  );
}



// Inside BookingSuccessView
function BookingSuccessView({ details, onClose, card }) {
  const { t } = useLanguage();
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const handleScratch = async () => {
    if (!card?.id || rewardClaimed) return;

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const response = await fetch(`${API_BASE}/rewards/scratch_card.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Role": role
        },
        body: JSON.stringify({ card_id: card.id })
      });

      const data = await response.json();
      if (data.status) {
        setRewardClaimed(true);
      }
    } catch (error) {
      // console.error("Scratch reward error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col w-full h-full bg-[#f0f4f8] overflow-y-auto remove-scrollbar relative p-6 pt-16 pb-12"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/20">
          <Check size={40} className="text-white" strokeWidth={4} />
        </div>
        <h2 className="text-3xl font-black text-brand tracking-tighter">{t('booking_confirmed')}</h2>
        <p className="text-brand/50 font-bold mt-1 uppercase text-[10px] tracking-widest">Job ID: {card?.booking_id || "PENDING"}</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-brand/5 mb-8">
        <h3 className="text-sm font-black text-brand/30 uppercase tracking-widest mb-6">{t('view_details')}</h3>
        <div className="space-y-4">
          <DetailRow label={t('home')} value={details.service} />
          <DetailRow label={t('date')} value={details.date || "Tomorrow"} />
          <DetailRow label={t('time')} value={details.time || "10:00 AM"} />
          <DetailRow label={t('service_location')} value={`${details.address}, ${details.city}`} />
          <DetailRow label={t('payment_mode')} value={details.paymentType} />
          <div className="pt-4 border-t border-brand/5 flex items-center justify-between">
            <span className="font-black text-brand text-lg">{t('total_amount')}</span>
            <span className="font-black text-brand text-xl">{details.price}</span>
          </div>
        </div>
      </div>

      {/* Interactive Scratch Card */}
      <div className="text-center mb-4">
        <h3 className="text-[11px] font-black text-brand/40 uppercase tracking-[2px] mb-1">
          {rewardClaimed ? "Reward Added to Wallet!" : "Scratch to reveal your reward"}
        </h3>
        {rewardClaimed && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-1"
          >
            <Check size={12} strokeWidth={4} /> Points successfully added
          </motion.p>
        )}
      </div>

      <div className="max-w-[280px] mx-auto w-full">
        <ScratchCard
          cashback={card?.reward_amount || 0}
          onReveal={handleScratch}
        />
      </div>

      <div className="mt-auto pt-10 pb-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full brand-gradient text-white py-5 rounded-[2rem] text-[17px] font-black shadow-lg hover:shadow-brand/20 transition-all flex items-center justify-center gap-2"
        >
          Go to My Dashboard
        </motion.button>
      </div>
    </motion.div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-[12px] font-bold text-brand/40 uppercase tracking-wider shrink-0 mt-0.5">{label}</span>
      <span className="text-[14px] font-black text-brand text-right leading-tight">{value || "Not Specified"}</span>
    </div>
  );
}
