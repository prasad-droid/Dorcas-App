import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, Shield, ChevronRight, LogOut, Settings, HelpCircle, 
  FileText, LayoutDashboard, Calendar, Bell, ChevronLeft,
  CreditCard, MapPin, Briefcase  
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";

import { API_BASE } from "../../../config";

const ProfileMenuItem = ({ icon: Icon, label, desc, action }) => (
  <div 
    onClick={action}
    className="bg-brand/5 p-4 rounded-2xl flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all shadow-[0_2px_10px_rgba(13,110,253,0.03)] border border-brand/5 hover:bg-brand/10"
  >
    <div className="w-12 h-12 bg-base shadow-sm rounded-xl flex items-center justify-center border border-brand/5">
      <Icon size={20} className="text-brand" />
    </div>
    <div className="flex-1">
      <h4 className="text-[14px] font-bold text-brand">{label}</h4>
      <p className="text-[12px] font-semibold text-brand/50 mt-0.5 leading-snug">{desc}</p>
    </div>
    <div className="w-8 h-8 bg-base shadow-sm rounded-full flex items-center justify-center">
      <ChevronRight size={16} className="text-brand/40" />
    </div>
  </div>
);

export function ProfileScreen() {
  const { isAuthenticated, authMode, logout } = useAuth();
  const { t } = useLanguage();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localImage, setLocalImage] = useState(null);
  const navigate = useNavigate();

  const isTech = authMode === "technician";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        const response = await fetch(`${API_BASE}/profile/get_profile.php`, {
          headers: { 
            "Authorization": `Bearer ${token}`, 
            "Role": role,
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();
        if (data.status) setProfileData(data.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, authMode]);

  useEffect(() => {
    if (profileData?.id) {
      const role = localStorage.getItem("role");
      const savedImage = localStorage.getItem(`profile_image_${role}_${profileData.id}`);
      if (savedImage) setLocalImage(savedImage);
    }
  }, [profileData]);

  const customerMenuItems = [
    { icon: LayoutDashboard, label: t('home'), desc: "Overview and insights", action: () => navigate("/") },
    { icon: Calendar, label: t('bookings'), desc: "View past and upcoming services", action: () => navigate("/order-history") },
    { icon: HelpCircle, label: t('help_support'), desc: "FAQs and contact us", action: () => navigate("/support") },
    { icon: FileText, label: t('terms_policies'), desc: "Privacy policy and terms of service", action: () => navigate("/terms-policy") },
  ];

  const techMenuItems = [
    { icon: LayoutDashboard, label: "Performance Dashboard", desc: "View detailed performance metrics", action: () => navigate("/tech/dashboard") },
    { icon: Briefcase, label: "Update Services", desc: "Modify your service offerings", action: () => navigate("/tech/manage-services") },
    { icon: CreditCard, label: t('earnings'), desc: "Track your revenue and payouts", action: () => navigate("/tech/earnings") },
    { icon: User, label: "Referral & Earn", desc: "Get 100 Points per partner refer", action: () => navigate("/tech/referral") },
    { icon: HelpCircle, label: t('help_support'), desc: "Get help with your account", action: () => navigate("/support") },
    { icon: FileText, label: t('terms_policies'), desc: "Service partner guidelines", action: () => navigate("/terms-policy") },
  ];

  const mainMenuItems = isTech ? techMenuItems : customerMenuItems;

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading && isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-base">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-brand/40 uppercase tracking-widest">{t('loading')}</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base relative overflow-hidden"
    >
      <div className="relative bg-brand pt-14 pb-14 px-5 rounded-b-[2.5rem] shadow-sm text-base flex flex-col items-center">
        <div className="absolute inset-0 overflow-hidden rounded-b-[2.5rem]">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="absolute top-12 right-6 z-10 w-full flex justify-end">
          <button 
            onClick={() => navigate("/settings")}
            className="w-10 h-10 bg-base/10 backdrop-blur-md border border-base/20 rounded-full flex items-center justify-center hover:bg-base/20 transition-colors shadow-sm"
          >
            <Settings size={20} className="text-base" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-base rounded-full flex items-center justify-center p-1 mb-3 shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-brand shadow-brand/30 overflow-hidden">
            {localImage || profileData?.profile_img ? (
              <img src={localImage || profileData?.profile_img} alt="Profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-3xl font-black text-brand">{getInitials(profileData?.name)}</span>
            )}
          </div>
          <h2 className="text-[22px] font-extrabold tracking-tight drop-shadow-md">{profileData?.name || "Guest User"}</h2>
          <p className="text-base/80 text-[13px] font-semibold mt-0.5 bg-base/10 px-3 py-1 rounded-full backdrop-blur-sm shadow-inner">{profileData?.phone || "No phone"}</p>
        </div>
      </div>

      <div className="relative z-20 px-6 -mt-8 mb-4">
        <div className="bg-base shadow-[0_8px_20px_rgba(13,110,253,0.08)] border border-brand/5 rounded-2xl p-4 flex justify-between items-center text-center divide-x divide-brand/10">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand/50 mb-1">
              {isTech ? "Jobs Done" : (profileData?.stats?.label1 || t('bookings'))}
            </p>
            <p className="text-xl font-black text-brand">
              {isTech ? (profileData?.stats?.total_jobs || "0") : (profileData?.stats?.value1 || "0")}
            </p>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand/50 mb-1">
              {isTech ? "Earnings" : (profileData?.stats?.label2 || t('rewards'))}
            </p>
            <p className="text-xl font-black text-[#ffb800]">
              {isTech ? `₹${profileData?.stats?.total_earnings || "0"}` : (profileData?.stats?.value2 || "0")}
            </p>
          </div>
          <div 
            className={`flex-1 ${isTech ? 'cursor-pointer active:opacity-60 transition-opacity' : ''}`}
            onClick={() => isTech && navigate("/tech/reviews")}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand/50 mb-1">
              {isTech ? "Rating" : "Status"}
            </p>
            <p className="text-sm font-black text-brand mt-1 flex items-center justify-center gap-1">
              {isTech ? (
                <>
                  <Star size={12} fill="currentColor" className="text-amber-500" />
                  {profileData?.stats?.rating || "0.0"}
                </>
              ) : (profileData?.stats?.value3 || "REGULAR")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-2 pb-20 space-y-3 overflow-y-auto">
        {/* Menu Items */}
        <div className="space-y-6">
          {isTech && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-black text-brand/30 uppercase tracking-widest px-1">Business Settings</h3>
              <ProfileMenuItem 
                icon={Briefcase} 
                label="Update Services" 
                desc="Add or remove your service offerings"
                action={() => navigate("/tech/manage-services")}
              />
              <ProfileMenuItem 
                icon={User} 
                label="Referral & Earn" 
                desc="Invite partners and earn 100 points"
                action={() => navigate("/tech/referral")}
              />
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-[11px] font-black text-brand/30 uppercase tracking-widest px-1">Account & Support</h3>
            {mainMenuItems.filter(item => !['Update Services', 'Referral & Earn'].includes(item.label)).map((item, idx) => (
              <ProfileMenuItem 
                key={idx}
                icon={item.icon} 
                label={item.label} 
                desc={item.desc}
                action={item.action}
              />
            ))}
          </div>
        </div>

        <button 
          onClick={logout}
          className="w-full mt-8 bg-red-50 p-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform text-red-600 font-bold text-[14px] border border-red-100"
        >
          <LogOut size={18} />
          {t('sign_out')}
        </button>
      </div>
    </motion.div>
  );
}
