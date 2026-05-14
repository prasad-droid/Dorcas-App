import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell, MapPin, Power, Briefcase, IndianRupee,
  ChevronRight, HelpCircle, Phone, BookOpen, Shield,
  AlertCircle, CheckCircle2, Clock, Star, Zap, Gift, LayoutGrid
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { API_BASE, UPLOAD_BASE } from "../../../config";
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export function TechHomeScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localImage, setLocalImage] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [activeJob, setActiveJob] = useState(null);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [stats, setStats] = useState({
    todayEarnings: "0",
    totalJobs: "0",
    avgRating: "0.0",
    acceptanceRate: "0%",
    activeJobs: "0",
    completedJobs: "0"
  });
  const [pendingCommissions, setPendingCommissions] = useState([]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (Capacitor.isNativePlatform()) {
          const perm = await Geolocation.checkPermissions();
          if (perm.location === 'granted') {
            const position = await Geolocation.getCurrentPosition({ timeout: 5000 });
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          } else if (perm.location === 'prompt') {
            const req = await Geolocation.requestPermissions();
            if (req.location === 'granted') {
              const position = await Geolocation.getCurrentPosition();
              setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
            }
          }
        } else if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          });
        }
      } catch (err) {
        console.warn("Location error:", err);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Role": role,
          "Content-Type": "application/json"
        };

        // 1. Fetch Profile & Stats
        const profileRes = await fetch(`${API_BASE}/profile/get_profile.php`, { headers });
        const profileJson = await profileRes.json();
        if (profileJson.status) {
          setProfileData(profileJson.data);
          if (profileJson.data.reviews) {
            setReviews(profileJson.data.reviews);
          }
          if (profileJson.data.stats) {
            setStats(prev => ({
              ...prev,
              todayEarnings: profileJson.data.stats.today_earnings || "0",
              totalJobs: profileJson.data.stats.total_jobs || "0",
              avgRating: profileJson.data.stats.rating || "0.0",
              completedJobs: profileJson.data.stats.completed_jobs || "0",
              activeJobs: profileJson.data.stats.active_jobs || "0",
              acceptanceRate: profileJson.data.stats.acceptance_rate || "0%"
            }));
          }
        }

        // 2. Fetch Active/Ongoing Job (Assigned to this technician)
        const activeRes = await fetch(`${API_BASE}/bookings/get_technician_bookings.php`, { headers });
        const activeJson = await activeRes.json();
        console.log(activeJson);

        if (activeJson.status && activeJson.data.length > 0) {
          // Filter for pending or ongoing jobs assigned to me
          const ongoing = activeJson.data.filter(j => j.status?.toLowerCase() === 'ongoing' || j.status?.toLowerCase() === 'pending');
          if (ongoing.length > 0) {
            setActiveJob(ongoing[0]);
          }

          // Check for pending commissions
          const pending = activeJson.data.filter(j => j.status?.toLowerCase() === 'completed' && j.commission_status?.toLowerCase() === 'pending');
          setPendingCommissions(pending);
        }

        // 3. Fetch Available New Requests (matching tech category/location)
        const requestsRes = await fetch(`${API_BASE}/bookings/get_available_jobs.php`, { headers });
        const requestsJson = await requestsRes.json();

        if (requestsJson.status) {
          const mapped = requestsJson.data.map(job => {
            const dist = calculateDistance(
              userLocation?.lat,
              userLocation?.lng,
              job.latitude,
              job.longitude
            );
            return {
              ...job,
              distanceValue: dist,
              distance: dist ? `${dist.toFixed(1)} km` : "Nearby",
              image: `https://www.dorcasaid.com/admin/${job.image}`
            };
          }).sort((a, b) => (a.distanceValue || 999) - (b.distanceValue || 999));

          // Apply 2km filtering logic: if jobs exist < 2km, show only them.
          const within2km = mapped.filter(j => j.distanceValue && j.distanceValue <= 2);
          setAvailableRequests(within2km.length > 0 ? within2km : mapped);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, userLocation]);

  useEffect(() => {
    if (profileData?.id) {
      const role = localStorage.getItem("role");
      const savedImage = localStorage.getItem(`profile_image_${role}_${profileData.id}`);
      if (savedImage) setLocalImage(savedImage);
    }
  }, [profileData]);

  const [techStats, setTechStats] = useState(null);

  useEffect(() => {
    const fetchTechStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const headers = { "Authorization": `Bearer ${token}`, "Role": role };
        const res = await fetch(`${API_BASE}/vendors/get_tech_stats.php`, { headers });
        const data = await res.json();
        if (data.status) setTechStats(data.data);
      } catch (e) { }
    };
    fetchTechStats();
  }, []);

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

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
      {/* KYC Verification Modal Overlay (Moved to top of relative parent) */}
      <AnimatePresence>
        {(profileData?.kyc_status !== 'verified' || !profileData?.is_approved) && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-6 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-brand/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-amber-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 opacity-50" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 mb-6 shadow-xl shadow-amber-500/10">
                  <Shield size={40} strokeWidth={2.5} />
                </div>

                <h3 className="text-2xl font-black text-brand tracking-tight mb-3">{t('verification_required')}</h3>
                <p className="text-[13px] font-medium text-brand/60 leading-relaxed mb-8">
                  Your account is currently <span className="text-amber-600 font-bold">{t('pending_approval')}</span>. {t('kyc_desc')}
                </p>

                <div className="w-full space-y-3">
                  <button
                    onClick={() => navigate("/tech/verification")}
                    className="w-full bg-brand text-white py-4 rounded-2xl font-black text-[15px] shadow-xl shadow-brand/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    {t('start_kyc')} <Zap size={18} />
                  </button>
                  <p className="text-[10px] font-black text-brand/30 uppercase tracking-[0.1em]">Documents usually verified in 24h</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Brand Gradient Header */}
      <div className="brand-gradient pt-12 pb-5 px-6 rounded-b-[2.5rem] relative  shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl p-0.5 border border-white/30 shadow-inner overflow-hidden cursor-pointer active:scale-95 transition-transform flex items-center justify-center" onClick={() => navigate("/profile")}>
              {localImage || profileData?.profile_img ? (
                <img
                  src={localImage || (profileData.profile_img.startsWith('http') ? profileData.profile_img : `${UPLOAD_BASE}/${profileData.profile_img}`)}
                  className="w-full h-full rounded-xl object-cover"
                  alt="Profile"
                />
              ) : (
                <span className="text-xl font-black text-white">{getInitials(profileData?.name)}</span>
              )}
            </div>
            <div className="text-white">
              <p className="text-white/60 text-[10px] font-black tracking-widest uppercase mb-0.5">Welcome back,</p>
              <h2 className="text-2xl font-black tracking-tight leading-none">{profileData?.name?.split(' ')[0] || "Partner"}</h2>
              <div className="flex items-center gap-1 opacity-90">
                <MapPin size={12} />
                <span className="text-[10px] font-bold tracking-wide">{profileData?.city || "Mumbai, MH"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/tech/referral")}
              className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 active:scale-95 transition-transform shadow-sm"
            >
              <Gift size={22} className="text-white" />
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="w-11 h-11 bg-white/10 rounded-2xl flex items-center justify-center relative backdrop-blur-md border border-white/20 active:scale-95 transition-transform shadow-sm"
            >
              <Bell size={22} className="text-white" />
              <motion.span
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-red-500 border-2 border-brand rounded-full shadow-lg shadow-red-500/50"
              ></motion.span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 mt-8 space-y-6 relative">
        {/* Dashboard Content (Visible behind modal but inactive) */}
        <div className={(profileData?.kyc_status !== 'verified' || !profileData?.is_approved) ? "blur-[2px] pointer-events-none" : ""}>
          {/* Active Work / Request Card */}
          <AnimatePresence mode="wait">
            {activeJob ? (
              <motion.div
                key="active-job"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-brand rounded-xl p-4 shadow-md relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-brand text-white px-3 py-1 rounded-bl-lg text-[9px] font-black uppercase tracking-widest">{t('ongoing')}</div>
                <div className="flex gap-4 mb-4">
                  <div className="w-16 h-16 bg-brand/5 rounded-lg flex items-center justify-center text-brand shrink-0">
                    <Briefcase size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-brand text-lg leading-tight">{activeJob.service_name || activeJob.category_name}</h3>
                    <p className="text-xs font-bold text-brand/40 flex items-center gap-1 mt-1">
                      <MapPin size={10} /> {activeJob.address || "Location TBD"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/tech/job/${activeJob.id}`)}
                  className="w-full bg-brand text-white py-3 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-transform"
                >
                  {t('view_details')}
                </button>
              </motion.div>
            ) : availableRequests.length > 0 ? (
              <motion.div
                key="new-request"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-black/[0.03] rounded-xl p-4 shadow-sm overflow-hidden relative"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-black/[0.02]">
                    <img
                      src={availableRequests[0].image}
                      className="w-full h-full object-cover"
                      alt="Service"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-brand/30 uppercase tracking-widest">New Request</span>
                        <span className="text-sm font-black text-brand">₹{availableRequests[0].service_price || 0}</span>
                      </div>
                      <h3 className="font-black text-brand text-base mt-0.5 leading-tight">{availableRequests[0].service_name || availableRequests[0].title}</h3>
                      <p className="text-[11px] font-bold text-brand/40 flex items-center gap-1 mt-1">
                        <MapPin size={10} /> {availableRequests[0].city || "Nearby"} • {availableRequests[0].distance || "2.4 km"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-2 py-1 bg-gray-50 rounded-md text-[9px] font-black text-brand/60 uppercase border border-black/[0.02]">{availableRequests[0].time || "Today"}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/tech/job/${availableRequests[0].id}`)}
                    className="flex-1 bg-brand text-white py-2.5 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-transform"
                  >
                    {t('view_accept')}
                  </button>
                  <button className="px-5 bg-gray-50 text-brand/40 py-2.5 rounded-lg font-bold text-sm border border-black/[0.02] active:scale-95 transition-transform">
                    {t('ignore')}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-brand/5 border border-dashed border-brand/20 rounded-xl p-8 flex flex-col items-center justify-center text-center"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand mb-3 shadow-sm">
                  <Clock size={24} className="animate-pulse" />
                </div>
                <h3 className="font-black text-brand text-sm">{t('waiting_jobs')}</h3>
                <p className="text-[10px] font-bold text-brand/40 uppercase tracking-widest mt-1">{t('waiting_desc')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Commission Due Alert */}
          <AnimatePresence>
            {pendingCommissions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-4 items-center"
              >
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                  <IndianRupee size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[13px] font-black text-brand leading-tight">Commission Dues Pending</h4>
                  <p className="text-[10px] font-bold text-red-600/60 uppercase mt-0.5">Please pay to keep receiving jobs</p>
                </div>
                <button
                  onClick={() => navigate("/tech/commissions")}
                  className="bg-brand text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                >
                  Pay Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Performance Dashboard with Graphs */}
          <div className="space-y-4 mt-5">
            <h3 className="text-[11px] font-black text-brand/80 uppercase tracking-widest px-1">{t('performance_overview')}</h3>

            {/* Main Graph Card */}
            <div className="bg-white rounded-[2rem] p-6 border border-brand/5 shadow-sm">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[10px] font-black text-brand/30 uppercase tracking-widest mb-1">{t('monthly_analytics')}</p>
                  <h4 className="text-xl font-black text-brand">{t('booking_history')}</h4>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-brand" />
                    <span className="text-[9px] font-bold text-brand/40">{t('accepted')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-[9px] font-bold text-brand/40">{t('missed')}</span>
                  </div>
                </div>
              </div>

              {/* Simple Bar Graph */}
              <div className="h-40 flex items-end justify-between gap-2 px-2">
                {techStats?.monthly.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex justify-center gap-0.5">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(m.accepted / 20) * 100}%` }}
                        className="w-2 bg-brand rounded-t-full"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(m.missed / 20) * 100}%` }}
                        className="w-2 bg-red-400 rounded-t-full"
                      />
                    </div>
                    <span className="text-[9px] font-black text-brand/30 uppercase">{m.month}</span>
                  </div>
                )) || <div className="w-full h-full bg-brand/5 rounded-2xl animate-pulse" />}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 bg-brand rounded-[2rem] p-6 shadow-xl shadow-brand/20 relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer" onClick={() => navigate("/tech/earnings")}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="relative z-10 flex justify-between items-center text-white">
                  <div>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-1">{t('earnings_today')}</p>
                    <div className="flex items-center gap-1">
                      <IndianRupee size={18} />
                      <span className="text-2xl font-black">{stats.todayEarnings}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <IndianRupee size={24} />
                  </div>
                </div>
              </div>

              {
                [
                  { label: t('avg_rating'), value: stats.avgRating, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
                  { label: "Acceptance Rate", value: techStats?.activity?.acceptance_rate || stats.acceptanceRate, icon: Zap, color: "text-purple-500", bg: "bg-purple-50" },
                  { label: "Completed Jobs", value: techStats?.activity?.total_completed || stats.completedJobs, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { label: "Missed / Declined", value: techStats?.activity ? (parseInt(techStats.activity.total_declined) + parseInt(techStats.activity.total_expired)) : "0", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" }
                ].map((stat, i) => (
                  <div key={i} className="bg-white rounded-[2rem] p-5 border border-brand/5 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                      <stat.icon size={18} fill={stat.icon === Star ? "currentColor" : "none"} />
                    </div>
                    <p className="text-[10px] font-black text-brand/30 uppercase tracking-tight mb-1">{stat.label}</p>
                    <span className="text-xl font-black text-brand">{stat.value}</span>
                  </div>
                ))
              }
            </div>

            {/* View Full Dashboard Link */}
            <button
              onClick={() => navigate("/tech/dashboard")}
              className="w-full py-4 bg-brand/5 border border-brand/10 rounded-2xl flex items-center justify-center gap-2 text-brand font-black text-[11px] uppercase tracking-widest active:scale-95 transition-transform"
            >
              View Dashboard <ChevronRight size={16} />
            </button>
          </div>

          {/* Top Services & Ratings Section */}
          <div className="grid grid-cols-1 gap-6 mt-5">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-brand/80 uppercase tracking-widest px-1">{t('top_services')}</h3>
              <div className="bg-white rounded-[2rem] p-6 border border-brand/5 shadow-sm space-y-4">
                {techStats?.top_services.length > 0 ? techStats.top_services.map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand/5 flex items-center justify-center text-brand font-black text-[10px]">0{i + 1}</div>
                      <span className="text-sm font-bold text-brand">{s.service_name}</span>
                    </div>
                    <span className="text-xs font-black text-brand/40">{s.count} {t('jobs')}</span>
                  </div>
                )) : <p className="text-xs text-brand/30 text-center py-4">No data yet</p>}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-brand/80 uppercase tracking-widest px-1">{t('recent_completed')}</h3>
              <div className="space-y-3">
                {techStats?.recent_completed.length > 0 ? techStats.recent_completed.map((job, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-brand/5 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-black text-brand leading-none mb-1">{job.service_name}</h4>
                        <p className="text-[10px] font-bold text-brand/40 uppercase">₹{job.amount_paid || 0}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-brand/40 uppercase">{new Date(job.completed_at).toLocaleDateString()}</span>
                  </div>
                )) : <div className="py-8 text-center bg-white rounded-[2rem] border border-dashed border-brand/10 text-brand/20 text-[10px] font-black uppercase">No completed jobs</div>}
              </div>
            </div>


          </div>
        </div>
      </div>
    </motion.div>
  );
}
