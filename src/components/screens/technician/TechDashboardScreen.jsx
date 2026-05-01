import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Star, CheckCircle2, Briefcase, 
  IndianRupee, Zap, Clock, AlertCircle, Award,
  ShieldCheck, LayoutDashboard, Search, TrendingUp, Users
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { API_BASE } from "../../../config";

export function TechDashboardScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: "0",
    monthlyGrowth: "+0%",
    todayRevenue: "₹0",
    rating: "0.0",
    acceptanceRate: "0%",
    activeJobs: "0",
    completedJobs: "0",
    reviewsCount: "0",
    servicesOffered: "0",
    missedJobs: "0"
  });
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const expertServices = [
    { id: 1, name: "Home Cleaning", category: "Cleaning", rating: "4.9", icon: "🧹" },
    { id: 2, name: "Deep Sanitization", category: "Cleaning", rating: "4.8", icon: "✨" }
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const headers = { "Authorization": `Bearer ${token}`, "Role": role };
        
        const response = await fetch(`${API_BASE}/profile/get_profile.php`, { headers });
        const data = await response.json();
        
        if (data.status) {
          setProfileData(data.data);
          if (data.data.stats) {
            setStats({
              totalJobs: data.data.stats.total_jobs || "0",
              monthlyGrowth: data.data.stats.growth || "+0%",
              todayRevenue: `₹${data.data.stats.today_earnings || "0"}`,
              rating: data.data.stats.rating || "0.0",
              acceptanceRate: data.data.stats.acceptance_rate || "0%",
              activeJobs: data.data.stats.active_jobs || "0",
              completedJobs: data.data.stats.completed_jobs || "0",
              reviewsCount: data.data.stats.reviews_count || "0",
              servicesOffered: data.data.stats.services_count || "0",
              missedJobs: data.data.stats.missed_jobs || "0"
            });
          }
        }
      } catch (error) {
        console.error("Dashboard Detail Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchDashboardData();
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
      {/* Premium Header - Referenced from Customer Dashboard */}
      <div className="bg-brand pt-14 pb-24 px-5 rounded-b-[2.5rem] shadow-sm relative overflow-hidden text-base flex flex-col">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-base/20 rounded-full flex items-center justify-center hover:bg-base/30 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-black tracking-tight">Performance Dashboard</h2>
          <div className="w-10 h-10"></div>
        </div>
      </div>

      {/* Floating Main Stats Card - Cleaner & Compact */}
      <div className="relative z-20 px-5 -mt-12 mb-8">
        <div className="bg-white shadow-[0_15px_35px_rgba(13,110,253,0.12)] border border-brand/5 rounded-[2rem] p-6 flex gap-4">
          <div className="flex-1 bg-brand/5 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-brand/10">
            <span className="text-[10px] font-black text-brand/40 uppercase tracking-widest mb-1">Total Jobs</span>
            <span className="text-3xl font-black text-brand tracking-tighter">{stats.totalJobs}</span>
          </div>
          <div className="flex-[1.5] bg-gradient-to-br from-brand to-brand/80 rounded-2xl p-4 flex flex-col justify-center text-base shadow-inner overflow-hidden relative">
            <div className="absolute top-2 right-2 opacity-20"><TrendingUp size={48} /></div>
            <div className="relative z-10">
              <span className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1 block">Monthly Growth</span>
              <span className="text-3xl font-black text-white">{stats.monthlyGrowth}</span>
              <div className="mt-2 flex items-center gap-1 bg-white/20 w-max px-2 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider">
                {parseFloat(stats.rating) >= 4.5 ? "Top 5% Partner" : "Active Partner"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-8">
        
        {/* Core Performance Grid - Grouped by type */}
        <div className="space-y-4">
          <SectionHeader title="Live Performance Metrics" />
          <div className="grid grid-cols-2 gap-3">
             {[
               { label: "Today's Revenue", value: stats.todayRevenue, icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-50" },
               { label: "Partner Rating", value: stats.rating, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
               { label: "Acceptance Rate", value: stats.acceptanceRate, icon: Zap, color: "text-purple-500", bg: "bg-purple-50" },
               { label: "Active Jobs", value: stats.activeJobs, icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
               { label: "Completed Jobs", value: stats.completedJobs, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
               { label: "Customer Reviews", value: stats.reviewsCount, icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
               { label: "Services Offered", value: stats.servicesOffered, icon: Briefcase, color: "text-brand", bg: "bg-brand/5" },
               { label: "Missed / Declined", value: stats.missedJobs, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" }
             ].map((stat, i) => (
               <div key={i} className="bg-white rounded-2xl p-4 border border-brand/5 shadow-sm flex items-center gap-3">
                 <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} shrink-0`}>
                   <stat.icon size={18} fill={stat.icon === Star ? "currentColor" : "none"} />
                 </div>
                 <div className="min-w-0">
                   <p className="text-[9px] font-black text-brand/30 uppercase tracking-tight leading-none mb-1.5 truncate">{stat.label}</p>
                   <span className="text-base font-black text-brand tracking-tighter">{stat.value}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Expertise Section - Compact Mode */}
        <div className="space-y-4">
          <SectionHeader title="Your Expert Portfolios" />
          <div className="grid grid-cols-1 gap-3">
            {expertServices.map((service) => (
              <div 
                key={service.id} 
                className="bg-white p-4 rounded-2xl border border-brand/5 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-xl">{service.icon}</div>
                  <div>
                    <h4 className="text-[13px] font-black text-brand leading-none mb-1">{service.name}</h4>
                    <span className="text-[10px] font-bold text-brand/30 uppercase tracking-widest">{service.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-lg">
                  <Star size={10} fill="currentColor" />
                  <span className="text-[11px] font-black">{service.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Recognition Card - From Customer Design System */}
        <div className="bg-[#ffb800]/10 rounded-3xl shadow-[0_4px_16px_rgba(255,184,0,0.1)] border border-[#ffb800]/30 p-6 relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 opacity-10">
            <ShieldCheck size={120} />
          </div>
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <span className="bg-[#ffb800] text-brand text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md">Elite Partner</span>
          </div>
          <h3 className="text-lg font-extrabold text-brand tracking-tight mb-1 relative z-10">You're in the Top Tier.</h3>
          <p className="text-[12px] font-semibold text-brand/70 mb-4 relative z-10 leading-snug">
            Your performance stats are in the top 5% of all technicians. You are now a priority partner for premium bookings.
          </p>
          <button className="bg-brand text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md relative z-10 active:scale-95 transition-all">
            View Benefits
          </button>
        </div>

      </div>
    </motion.div>
  );
}

function SectionHeader({ title }) {
  return (
    <h3 className="text-[11px] font-black text-brand/30 uppercase tracking-[2px] px-1">{title}</h3>
  );
}
