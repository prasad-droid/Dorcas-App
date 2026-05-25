import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User, Shield, ChevronRight, LogOut, Settings, HelpCircle,
  FileText, Star, Briefcase, IndianRupee, MapPin,
  CheckCircle2, CreditCard, Award, LayoutDashboard
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { API_BASE } from "../../../config";

export function TechPortfolioScreen() {
  const { isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localImage, setLocalImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        const response = await fetch(`${API_BASE}/profile/get_profile.php`, {
          headers: { "Authorization": `Bearer ${token}`, "Role": role }
        });

        const data = await response.json();
        if (data.status) setProfileData(data.data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated]);

  useEffect(() => {
    if (profileData?.id) {
      const role = localStorage.getItem("role");
      const savedImage = localStorage.getItem(`profile_image_${role}_${profileData.id}`);
      if (savedImage) setLocalImage(savedImage);
    }
  }, [profileData]);

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const portfolioMenuItems = [
    {
      icon: LayoutDashboard,
      label: "My Dashboard",
      desc: "Full performance & expertise overview",
      action: () => navigate("/tech/dashboard")
    },
    {
      icon: Shield,
      label: "ID Verification",
      desc: "KYC & Professional credentials",
      action: () => navigate("/tech/verification")
    },
    {
      icon: Briefcase,
      label: "Update Services",
      desc: "Modify your service offerings",
      action: () => navigate("/tech/manage-services")
    },
    {
      icon: Award,
      label: "Referral & Earn",
      desc: "Get 100 Points per partner refer",
      action: () => navigate("/tech/referral")
    },
    {
      icon: CreditCard,
      label: "Banking & Payouts",
      desc: "Settlement accounts & history",
      action: () => navigate("/tech/earnings")
    },
    {
      icon: HelpCircle,
      label: t('help_support'),
      desc: "Get help with your partner account",
      action: () => navigate("/support")
    },
  ];

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
      className="flex flex-col w-full h-full bg-[#f8fafc] overflow-y-auto pb-24 remove-scrollbar"
    >
      {/* Brand Gradient Header */}
      <div className="brand-gradient pt-10 pb-14 px-5 rounded-b-[2rem] shadow-lg relative  text-white flex flex-col items-center">
        <div className="absolute inset-0 overflow-hidden rounded-b-[2rem]">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        <div className="absolute top-12 right-6 z-10 w-full flex justify-end">
          <button
            onClick={() => navigate("/settings")}
            className="w-10 h-10 bg-base/10 backdrop-blur-md border border-base/20 rounded-full flex items-center justify-center active:scale-90 transition-all shadow-sm"
          >
            <Settings size={20} className="text-base" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 bg-base rounded-full flex items-center justify-center p-1 mb-3 shadow-xl border-2 border-white overflow-hidden">
              {localImage || profileData?.profile_img ? (
                <img
                  src={localImage || (profileData?.profile_img?.startsWith('http') ? profileData.profile_img : `${UPLOAD_BASE}/${profileData.profile_img}`)}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-brand">{getInitials(profileData?.name)}</span>
              )}
            </div>
            <div className="absolute bottom-4 right-0 w-7 h-7 bg-emerald-500 rounded-full border-4 border-brand flex items-center justify-center text-white">
              <CheckCircle2 size={12} strokeWidth={4} />
            </div>
          </div>
          <h2 className="text-[22px] font-black tracking-tight text-white">{profileData?.name || "Professional Partner"}</h2>
          <div className="flex items-center gap-2 mt-1">
            <MapPin size={12} className="text-white/60" />
            <p className="text-white/70 text-[12px] font-bold uppercase tracking-wider">{profileData?.location || "Mumbai, India"}</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-20 px-5 -mt-8 mb-6">
        <div className="bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-gray-900 rounded-2xl p-5 flex justify-between items-center text-center">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand/30 mb-1">Rating</p>
            <div className="flex items-center justify-center gap-1">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <p className="text-lg font-black text-brand">{profileData?.stats?.rating || "0.0"}</p>
            </div>
          </div>
          <div className="w-[1px] h-10 bg-brand/5 mx-2" />
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand/30 mb-1">Jobs Done</p>
            <p className="text-lg font-black text-brand">{profileData?.stats?.total_jobs || "0"}</p>
          </div>
          <div className="w-[1px] h-10 bg-brand/5 mx-2" />
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand/30 mb-1">Earnings</p>
            <p className="text-lg font-black text-emerald-600">₹{profileData?.stats?.total_earnings || "0"}</p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="flex-1 px-5 pt-2 pb-20 space-y-3">
        <div className="flex items-center justify-between px-1 mb-4">
          <h3 className="text-[11px] font-bold text-brand/60 uppercase tracking-[2px]">Partner Dashboard</h3>
        </div>

        {portfolioMenuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.action}
              className="bg-white p-4 rounded-2xl flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all shadow-sm hover:bg-brand/5 group"
            >
              <div className="w-12 h-12 bg-brand/5 group-hover:bg-brand/10 rounded-xl flex items-center justify-center transition-colors">
                <Icon size={22} className="text-brand" />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-brand">{item.label}</h4>
                <p className="text-[11px] font-semibold text-brand/40 mt-0.5 leading-snug">{item.desc}</p>
              </div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-brand/20 group-hover:text-brand/40 transition-colors">
                <ChevronRight size={18} />
              </div>
            </div>
          );
        })}

        <button
          onClick={logout}
          className="w-full mt-8 bg-red-50 p-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform text-red-600 font-bold text-[14px] border border-red-100/50"
        >
          <LogOut size={18} />
          {t('sign_out')}
        </button>

        <p className="text-center text-[10px] font-bold text-brand/20 uppercase tracking-[3px] py-6">
          Dorcas Partner v2.4.0
        </p>
      </div>
    </motion.div>
  );
}
