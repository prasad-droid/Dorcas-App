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
import { TechHomeSkeleton } from "../../ui/SkeletonScreen";

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
  const [selectedMonth, setSelectedMonth] = useState(null);

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
    const fetchData = async (isBackground = false) => {
      try {
        if (!isBackground) setIsLoading(true);
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

        if (activeJson.status && activeJson.data.length > 0) {
          // Filter for pending or ongoing jobs assigned to me
          const ongoing = activeJson.data.filter(j => j.status?.toLowerCase() === 'ongoing' || j.status?.toLowerCase() === 'pending');
          if (ongoing.length > 0) {
            setActiveJob(ongoing[0]);
          }

          // Check for pending commissions
          const pending = activeJson.data.filter(j =>
            j.status?.toLowerCase() === 'completed' &&
            j.commission_status?.toLowerCase() === 'pending' &&
            parseFloat(j.commission_amount || 0) > 0
          );
          setPendingCommissions(pending);
        }

        // 3. Fetch Available New Requests (matching tech category/location)
        const requestsRes = await fetch(`${API_BASE}/bookings/get_available_jobs.php`, { headers });
        const requestsJson = await requestsRes.json();
        console.log("Available Jobs : ", requestsJson);


        // 4. Fetch Tech Services for Fake Lead
        const servicesRes = await fetch(`${API_BASE}/vendors/get_vendor_services.php`, { headers });
        const servicesJson = await servicesRes.json();
        const techServices = servicesJson.status ? servicesJson.data : [];
        const topService = techServices.length > 0 ? techServices[0] : null;

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
              image: `https://www.dorcasaid.com/${job.image}`
            };
          }).sort((a, b) => (a.distanceValue || 999) - (b.distanceValue || 999));

          // Apply 2km filtering logic: if jobs exist < 2km, show only them.
          const within2km = mapped.filter(j => j.distanceValue && j.distanceValue <= 2);

          // Inject Fake Lead for unverified users
          const currentProfile = profileJson.data || profileData;
          if (currentProfile?.kyc_status !== 'verified' || !currentProfile?.is_approved) {
            const fakeLead = {
              id: "fake_123",
              service_name: topService ? topService.service_name : "Premium Cleaning Service",
              service_price: topService ? topService.price : "2500",
              city: "Near You",
              distance: "0.5 km",
              image: "https://www.dorcasaid.com/" + topService.image_path,
              is_fake: true,
              time: "Just now"
            };
            setAvailableRequests([fakeLead, ...(within2km.length > 0 ? within2km : mapped)]);
          } else {
            setAvailableRequests(within2km.length > 0 ? within2km : mapped);
          }
        }
      } catch (error) {
      } finally {
        if (!isBackground) setIsLoading(false);
      }
    };

    fetchData(false);

    // Short Polling for Real-Time Updates
    const intervalId = setInterval(() => {
      fetchData(true);
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(intervalId);
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
    return <TechHomeSkeleton />;
  }
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-y-auto pb-24 remove-scrollbar"
    >

      {/* Brand Gradient Header */}
      <div className="brand-gradient pt-12 pb-5 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden text-white shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl p-0.5 border border-white/30 shadow-inner overflow-hidden cursor-pointer active:scale-95 transition-transform flex items-center justify-center shrink-0" onClick={() => navigate("/profile")}>
              {localImage || profileData?.profile_img ? (
                <img
                  src={localImage || (profileData.profile_img.startsWith('http') ? profileData.profile_img : `${UPLOAD_BASE}/${profileData.profile_img}`)}
                  className="w-full h-full rounded-xl object-cover"
                  alt="Profile"
                />
              ) : (
                <span className="text-lg font-black text-white">{getInitials(profileData?.name)}</span>
              )}
            </div>
            <div className="text-white min-w-0 flex-1">
              <p className="text-white/60 text-[9px] font-black tracking-widest uppercase mb-0.5">Welcome back,</p>
              <h2 className="text-lg font-black tracking-tight leading-none truncate">{profileData?.name || "Partner"}</h2>

              {/* Location display: below the name horizontally, wrapped in two lines */}
              <div className="flex items-start gap-1 mt-1 text-white/95">
                <MapPin size={12} className="shrink-0 mt-0.5 text-white" />
                <span
                  className="text-[10px] font-semibold leading-tight text-left"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {profileData?.address || profileData?.city || "Mumbai, MH"}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <button
              onClick={() => navigate("/tech/dashboard")}
              className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20 active:scale-95 transition-transform shadow-sm"
              title="Dashboard"
            >
              <LayoutGrid size={18} className="text-white" />
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center relative backdrop-blur-md border border-white/20 active:scale-95 transition-transform shadow-sm"
            >
              <Bell size={18} className="text-white" />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-lg"
              ></motion.span>
            </button>
          </div>
        </div>
      </div>

      {(profileData?.kyc_status !== 'verified' || !profileData?.is_approved) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4 items-center shadow-sm"
        >
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
            <Shield size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-[12px] font-black text-brand leading-tight">Verification Pending</h4>
            <p className="text-[10px] font-bold text-amber-600/70 uppercase mt-0.5">Complete KYC to accept real jobs</p>
          </div>
          <button
            onClick={() => navigate("/tech/verification")}
            className="bg-brand text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-transform"
          >
            Start KYC
          </button>
        </motion.div>
      )}

      <div className="px-5 mt-8 space-y-6 relative">
        {/* Dashboard Content (Visible) */}
        <div>
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
                    <img src={`https://dorcasaid.com/${activeJob.image}`} alt="" />
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
                className="gradient-border-green rounded-[1.5rem] p-4 shadow-md overflow-hidden relative"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-black/[0.02] bg-brand/5 flex items-center justify-center">
                    <img
                      src={availableRequests[0].image}
                      className="w-full h-full object-contain p-2"
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
                    onClick={() => {
                      if (availableRequests[0].is_fake) {
                        navigate("/tech/verification");
                      } else {
                        navigate(`/tech/job/${availableRequests[0].id}`);
                      }
                    }}
                    className="flex-1 bg-brand text-white py-2.5 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-transform"
                  >
                    {availableRequests[0].is_fake ? "Verify to Accept" : t('view_accept')}
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
                {(() => {
                  const defaultMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
                  const monthlyData = techStats?.monthly && techStats.monthly.length > 0
                    ? techStats.monthly.map(m => ({
                      month: m.month ? String(m.month).substring(0, 3) : "N/A",
                      accepted: parseInt(m.accepted || 0) || 0,
                      missed: parseInt(m.missed || m.rejected || 0) || 0
                    }))
                    : defaultMonths.map(m => ({ month: m, accepted: 0, missed: 0 }));

                  const maxVal = Math.max(...monthlyData.map(m => Math.max(m.accepted, m.missed, 1)), 15);

                  return monthlyData.map((m, i) => (
                    <div key={i}
                      onClick={() => setSelectedMonth(selectedMonth === i ? null : i)}
                      className="flex-1 h-full flex flex-col items-center justify-end gap-2 group relative cursor-pointer"
                    >
                      {selectedMonth === i && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-10 bg-white border border-brand/10 shadow-[0_4px_12px_rgba(13,110,253,0.12)] rounded-lg px-2 py-1.5 z-20 flex flex-col items-center min-w-[50px]"
                        >
                          <div className="flex items-center justify-center gap-2 text-[10px] font-black w-full">
                            <span className="text-brand" title="Accepted">{m.accepted}</span>
                            <span className="text-brand/20">|</span>
                            <span className="text-red-400" title="Missed">{m.missed}</span>
                          </div>
                          <div className="absolute -bottom-1 w-2 h-2 bg-white border-b border-r border-brand/10 rotate-45"></div>
                        </motion.div>
                      )}
                      <div className="w-full h-full flex items-end justify-center gap-1">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(m.accepted / maxVal) * 80 + 5}%` }}
                          className="w-2.5 bg-brand rounded-t-full"
                        />
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${(m.missed / maxVal) * 80 + 5}%` }}
                          className="w-2.5 bg-red-400 rounded-t-full"
                        />
                      </div>
                      <span className="text-[9px] font-black text-brand/30 uppercase shrink-0">{m.month}</span>
                    </div>
                  ));
                })()}
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
                  <div
                    key={i}
                    onClick={() => stat.label === t('avg_rating') && navigate("/tech/reviews")}
                    className={`bg-white rounded-[2rem] p-5 border border-brand/5 shadow-sm ${stat.label === t('avg_rating') ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
                  >
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
                {techStats?.top_services && techStats.top_services.length > 0 ? techStats.top_services.map((s, i) => (
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
                {techStats?.recent_completed && techStats.recent_completed.length > 0 ? techStats.recent_completed.map((job, i) => (
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
