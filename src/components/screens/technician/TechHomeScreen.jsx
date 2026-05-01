import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell, MapPin, Power, Briefcase, IndianRupee,
  ChevronRight, HelpCircle, Phone, BookOpen, FileText,
  AlertCircle, CheckCircle2, Clock, Star, Zap
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE } from "../../../config";

export function TechHomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [activeJob, setActiveJob] = useState(null); // Mock for now

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const response = await fetch(`${API_BASE}/profile/get_profile.php`, {
          headers: { "Authorization": `Bearer ${token}`, "Role": role }
        });
        const data = await response.json();
        if (data.status) {
          setProfileData(data.data);
        }
      } catch (error) {
        console.error("Tech Dashboard Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-y-auto pb-24 remove-scrollbar"
    >
      {/* Header */}
      <div className="bg-brand pt-12 pb-18 px-6 rounded-b-[2.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand to-blue-700 opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl p-0.5 border border-white/30 shadow-inner">
               <img 
                  src={profileData?.profile_img || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop"} 
                  className="w-full h-full rounded-xl object-cover"
                  alt="Profile"
               />
            </div>
            <div>
              <p className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-0.5">Welcome back,</p>
              <h2 className="text-2xl font-black tracking-tight text-white leading-none">{profileData?.name?.split(' ')[0] || "Partner"}</h2>
              <div className="flex items-center gap-1 text-white/90">
                <MapPin size={12} className="text-white" />
                <span className="text-[10px] font-bold tracking-wide">{profileData?.city || "Mumbai, MH"}</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => navigate("/notifications")}
            className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center relative backdrop-blur-md border border-white/20 active:scale-95 transition-transform"
          >
            <Bell size={24} className="text-white" />
            <motion.span 
               animate={{ scale: [1, 1.4, 1] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 border-2 border-brand rounded-full shadow-lg shadow-red-500/50"
            ></motion.span>
          </button>
        </div>
      </div>

      <div className="px-5 mt-8 space-y-6">

        {/* Active Work / Request Card */}
        <AnimatePresence mode="wait">
          {!activeJob ? (
            <motion.div
              key="no-job"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-black/[0.03] rounded-xl p-4 shadow-sm overflow-hidden relative"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-black/[0.02]">
                  <img
                    src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=400&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt="Service"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-brand/30 uppercase tracking-widest">New Request</span>
                      <span className="text-sm font-black text-brand">₹8,500</span>
                    </div>
                    <h3 className="font-black text-brand text-base mt-0.5 leading-tight">Full Home Painting</h3>
                    <p className="text-[11px] font-bold text-brand/40 flex items-center gap-1 mt-1">
                      <MapPin size={10} /> Sector 44, Seawoods • 2.4 km
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-gray-50 rounded-md text-[9px] font-black text-brand/60 uppercase border border-black/[0.02]">Today, 4:00 PM</div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-brand text-white py-2.5 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-transform">
                  Accept Job
                </button>
                <button className="px-5 bg-gray-50 text-brand/40 py-2.5 rounded-lg font-bold text-sm border border-black/[0.02] active:scale-95 transition-transform">
                  Ignore
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active-job"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-brand rounded-xl p-4 shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-brand text-white px-3 py-1 rounded-bl-lg text-[9px] font-black uppercase tracking-widest">Ongoing</div>
              <div className="flex gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-brand shrink-0">
                  <Briefcase size={32} />
                </div>
                <div>
                  <h3 className="font-black text-brand text-lg">Deep House Cleaning</h3>
                  <p className="text-xs font-bold text-brand/40">Bandra West, Mumbai</p>
                </div>
              </div>
              <button className="w-full bg-brand text-white py-3 rounded-lg font-bold text-sm shadow-sm">
                View Job Details
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Performance Metrics Dashboard */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-brand/30 uppercase tracking-widest px-1">Performance Dashboard</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Primary Stat: Earnings */}
            <div className="col-span-2 bg-brand rounded-xl p-5 shadow-md relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
               <div className="relative z-10 flex justify-between items-center text-white">
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">Today's Earnings</p>
                    <div className="flex items-center gap-1">
                      <IndianRupee size={18} />
                      <span className="text-2xl font-black">2,450</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                     <IndianRupee size={24} />
                  </div>
               </div>
            </div>

            {[
              { label: "Total Jobs Done", value: "124", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
              { label: "Avg. Rating", value: "4.9", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
              { label: "Services Offered", value: "08", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "Completed Jobs", value: "118", icon: CheckCircle2, color: "text-brand", bg: "bg-brand/5" },
              { label: "Active Jobs", value: "03", icon: Clock, color: "text-brand", bg: "bg-brand/5" },
              { label: "Missed / Declined", value: "02", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
              { label: "Customer Reviews", value: "128", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Acceptance Rate", value: "98%", icon: Zap, color: "text-purple-500", bg: "bg-purple-50" }
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-black/[0.03] shadow-sm flex flex-col gap-2">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={16} fill={stat.icon === Star ? "currentColor" : "none"} />
                </div>
                <div>
                  <p className="text-[9px] font-bold text-brand/30 uppercase tracking-tight leading-tight">{stat.label}</p>
                  <span className="text-lg font-black text-brand">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[11px] font-black text-brand/30 uppercase tracking-widest">Recent Reviews</h3>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg border border-amber-100">
               <Star size={12} className="text-amber-500" fill="currentColor" />
               <span className="text-[11px] font-black text-amber-900">4.9</span>
               <span className="text-[9px] font-bold text-amber-900/40">(128)</span>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: "Rahul Sharma", rating: 5, comment: "Excellent work on the house painting. Very professional and completed the job on time.", date: "2 days ago" },
              { name: "Priya Kapoor", rating: 5, comment: "Highly skilled and polite. Cleaned up everything after the work was done.", date: "1 week ago" }
            ].map((review, i) => (
              <div key={i} className="bg-white p-4 rounded-xl border border-black/[0.03] shadow-sm active:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-brand/5 flex items-center justify-center text-brand font-black text-xs border border-brand/5">
                      {review.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-black text-brand leading-none mb-1">{review.name}</h4>
                      <div className="flex items-center gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={10} className="text-amber-500" fill="currentColor" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-brand/30 uppercase tracking-tighter">{review.date}</span>
                </div>
                <p className="text-xs text-brand/60 leading-relaxed font-medium italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
          <button className="w-full py-4 text-[11px] font-black text-brand/30 uppercase tracking-widest border border-dashed border-brand/10 rounded-xl active:bg-gray-50 transition-colors">
            View All Performance Logs
          </button>
        </div>

        {/* Pending Actions / Warnings */}
        {!profileData?.is_approved && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-900 mb-1">KYC Pending</h4>
              <p className="text-[11px] text-amber-900/60 font-medium leading-relaxed">Your profile is under review. Complete your document upload to speed up the process.</p>
              <button className="mt-3 text-[11px] font-black text-amber-900 uppercase underline decoration-2 underline-offset-4">Complete Profile</button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
