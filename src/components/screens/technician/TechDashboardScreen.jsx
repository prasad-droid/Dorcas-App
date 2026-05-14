import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Star, CheckCircle2, Briefcase,
  IndianRupee, Zap, Clock, AlertCircle, Award,
  ShieldCheck, LayoutDashboard, Search, TrendingUp, MapPin
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
    completionRate: "0%",
    activeJobs: "0",
    completedJobs: "0",
    reviewsCount: "0",
    servicesOffered: "0",
    missedJobs: "0",
    totalRequests: "0",
    totalAccepted: "0",
    totalDeclined: "0",
    totalExpired: "0"
  });
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) {
          navigate("/login");
          return;
        }
        const headers = { "Authorization": `Bearer ${token}`, "Role": role };

        // Fetch Profile
        const profRes = await fetch(`${API_BASE}/profile/get_profile.php`, { headers });
        const profData = await profRes.json();
        console.log('profileData', profData);
        // Fetch Stats
        const statsRes = await fetch(`${API_BASE}/vendors/get_tech_stats.php`, { headers });
        const statsData = await statsRes.json();
        console.log('statsData', statsData);
        // Fetch My Services
        const servicesRes = await fetch(`${API_BASE}/vendors/get_vendor_services.php`, { headers });
        const servicesData = await servicesRes.json();
        console.log('servicesData', servicesData);
        if (servicesData.status) setServices(servicesData.data);

        if (profData.status) {
          setProfileData(profData.data);
          const pStats = profData.data.stats || {};
          const act = statsData.data?.activity || {};

          setStats({
            totalJobs: pStats.total_jobs || "0",
            monthlyGrowth: pStats.growth || "+0%",
            todayRevenue: `₹${pStats.today_earnings || "0"}`,
            rating: pStats.rating || "0.0",
            acceptanceRate: act.acceptance_rate || "0%",
            completionRate: act.completion_rate || "0%",
            activeJobs: pStats.active_jobs || "0",
            completedJobs: act.total_completed || "0",
            reviewsCount: pStats.reviews_count || "0",
            servicesOffered: pStats.services_count || "0",
            missedJobs: (parseInt(act.total_declined || 0) + parseInt(act.total_expired || 0)).toString(),
            totalRequests: act.total_requests || "0",
            totalAccepted: act.total_accepted || "0",
            totalDeclined: act.total_declined || "0",
            totalExpired: act.total_expired || "0"
          });
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

  const kycStatus = profileData?.kyc_status || 'none';
  const isVerified = kycStatus === 'verified' || profileData?.is_approved;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col w-full h-full bg-[#f8fafc] overflow-y-auto pb-24 remove-scrollbar"
    >
      {/* Brand Gradient Header */}
      <div className="brand-gradient pt-12 pb-5 px-6 rounded-b-[2.5rem] shadow-lg relative text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md hover:bg-white/30 transition-all shadow-sm border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black tracking-tight leading-none mb-1">Dashboard</h2>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[2px]">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
          </div>
          <div className="w-11" />
        </div>

        <div className="relative z-10 flex gap-2 -mt-5 justify-center items-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <MapPin size={12} className="text-orange-400" />
            <span className="text-[9px] font-black uppercase tracking-wider text-white">{profileData?.city || "Vasai-Virar"}</span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-10 space-y-6 relative z-20">

        {/* Web Style Stats Grid (3 columns) */}
        <div className="grid grid-cols-3 gap-3">
          <WebStatCard label="Total Jobs" value={stats.totalJobs} icon={Briefcase} color="text-teal-500" bg="bg-teal-50" />
          <WebStatCard label="Avg. Rating" value={stats.rating} icon={Star} color="text-amber-500" bg="bg-amber-50" />
          <WebStatCard label="Services" value={stats.servicesOffered} icon={Zap} color="text-blue-500" bg="bg-blue-50" />

          <WebStatCard label="Completed" value={stats.completedJobs} icon={CheckCircle2} color="text-emerald-500" bg="bg-emerald-50" />
          <WebStatCard label="Active" value={stats.activeJobs} icon={Clock} color="text-pink-500" bg="bg-pink-50" />
          <WebStatCard label="Missed" value={stats.missedJobs} icon={AlertCircle} color="text-slate-400" bg="bg-slate-50" />

          <WebStatCard label="Today Revenue" value={stats.todayRevenue} icon={IndianRupee} color="text-brand" bg="bg-brand/5" />
          <WebStatCard label="Reviews" value={stats.reviewsCount} icon={Star} color="text-purple-500" bg="bg-purple-50" />
          <WebStatCard label="Acceptance Rate" value={stats.acceptanceRate} icon={TrendingUp} color="text-teal-600" bg="bg-teal-50" />
        </div>

        {/* My Services & Profile Sections - Side by side style on mobile as cards */}
        <div className="space-y-6">
          {/* My Services Card */}
          <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-orange-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap size={18} className="text-orange-500" />
                <h3 className="text-sm font-black text-brand uppercase tracking-tight">My Services</h3>
              </div>
              <button onClick={() => navigate("/tech/manage-services")} className="text-[10px] font-bold text-teal-600 hover:underline uppercase tracking-widest">View All</button>
            </div>
            <div className="p-4 flex gap-3 overflow-x-auto remove-scrollbar">
              {services.length > 0 ? services.map((svc, i) => (
                <div key={i} className="min-w-[100px] bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white rounded-xl mb-2 overflow-hidden border border-slate-100 flex items-center justify-center p-1">
                    <img src={"https://dorcasaid.com/" + svc.image_path} alt="" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-[10px] font-black text-brand leading-tight line-clamp-2">{svc.service_name}</span>
                  <span className="text-[8px] font-bold text-brand/40 uppercase mt-1">{svc.category_name}</span>
                </div>
              )) : (
                <p className="text-[10px] text-brand/40 font-bold py-4 w-full text-center">No services added yet.</p>
              )}
            </div>
          </div>


        </div>

      </div>
    </motion.div>
  );
}

function WebStatCard({ label, value, icon: Icon, color, bg }) {
  return (
    <div className={`flex flex-col items-center p-3 rounded-2xl ${bg} border border-brand/5 shadow-sm text-center min-h-[90px] justify-center`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${color} bg-white shadow-inner`}>
        <Icon size={16} />
      </div>
      <div className="text-[15px] font-black text-brand tracking-tighter leading-none mb-1">{value}</div>
      <p className="text-[9px] font-bold text-brand/40 uppercase tracking-tight leading-tight px-1">{label}</p>
    </div>
  );
}



