import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, Clock, IndianRupee, ChevronRight, 
  Search, Filter, Briefcase, Zap, Star,
  Shield, User, Calendar, AlertCircle, Phone
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { API_BASE } from "../../../config";

export function TechServicesScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showKycAlert, setShowKycAlert] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  // Real KYC status from profile
  const isKycComplete = profileData?.is_approved || false;

  const handleAcceptJob = async (job) => {
    if (!isKycComplete) {
      setShowKycAlert(true);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const response = await fetch(`${API_BASE}/bookings/accept_job.php`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Role": role,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ job_id: job.id })
      });
      const data = await response.json();
      
      if (data.status) {
        showToast(data.message, "success");
        // Refresh jobs list
        setAvailableJobs(prev => prev.filter(j => j.id !== job.id));
        navigate("/tech"); // Redirect to home to see ongoing job
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      // console.error("Accept Job Error:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

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

        // 1. Fetch Profile for KYC status
        const profileRes = await fetch(`${API_BASE}/profile/get_profile.php`, { headers });
        const profileJson = await profileRes.json();
        if (profileJson.status) {
          setProfileData(profileJson.data);
        }

        // 2. Fetch Available Jobs
        const response = await fetch(`${API_BASE}/bookings/get_available_jobs.php`, { headers });
        const data = await response.json();
        
        if (data.status) {
          const mappedJobs = data.data.map(job => ({
            id: job.id,
            title: job.service_name || job.category_name || "Home Service",
            category: job.category_name || "General",
            location: job.address || "Nearby",
            city: job.city || "",
            distance: job.distance || "Nearby",
            price: `₹${job.price || job.amount || "0"}`,
            time: job.service_date ? `${job.service_date}, ${job.service_time || ""}` : "Flexible",
            customerRating: job.rating || "4.8",
            urgency: job.urgency || "medium",
            image: job.image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200&auto=format&fit=crop"
          }));
          setAvailableJobs(mappedJobs);
        }
      } catch (error) {
        // console.error("Fetch Data Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchData();
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
      className="flex flex-col w-full h-full bg-base overflow-y-auto pb-24 remove-scrollbar relative"
    >
      <div className="px-6 pt-12 pb-4 bg-base sticky top-0 z-30">
        <h2 className="text-3xl font-black tracking-tight text-brand">Available Jobs</h2>
        <p className="text-brand/40 text-[10px] font-bold uppercase tracking-widest mt-1">Jobs matching your location & skills</p>
      </div>

      <div className="px-5 space-y-6">
        <div className="flex gap-2">
          <div className="flex-1 bg-white rounded-xl p-3 px-4 shadow-sm border border-black/[0.03] flex items-center gap-3">
            <Search size={18} className="text-brand/30" />
            <input 
              type="text" 
              placeholder="Search local jobs..." 
              className="bg-transparent border-none outline-none text-sm font-medium text-brand w-full"
            />
          </div>
          <button className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-black/[0.03] text-brand">
            <Filter size={20} />
          </button>
        </div>

        <div className="px-0 flex flex-col gap-4">
          <AnimatePresence>
            {availableJobs
              .filter(job => activeCategory === "All" || job.category === activeCategory)
              .map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-brand/5 rounded-3xl p-4 shadow-[0_6px_24px_rgba(13,110,253,0.08)] relative overflow-hidden active:scale-[0.98] transition-all"
                >
                  <div className="flex gap-3 items-start">
                    <img
                      src={job.image}
                      alt="job"
                      className="w-[72px] h-[72px] rounded-2xl object-cover shrink-0 border border-brand/5 bg-brand/5"
                    />
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-[14px] font-bold text-brand leading-tight truncate pr-2">
                          {job.title}
                        </h3>
                        <span className="bg-brand/10 text-brand px-3 py-1 rounded-xl text-[10px] font-bold shrink-0">
                          {job.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Star size={14} className="fill-brand text-brand" />
                        <span className="text-[12px] font-bold text-brand/80">
                          {job.customerRating || "4.8"} <span className="font-medium opacity-60">(250 reviews)</span>
                        </span>
                      </div>
                      <div className="text-[13px] font-bold text-brand">
                        {job.price}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button 
                      onClick={() => navigate(`/tech/job/${job.id}`)}
                      className="flex items-center justify-center gap-2 bg-brand/5 text-brand py-[14px] rounded-2xl text-[13px] font-bold hover:bg-brand/10 transition-colors"
                    >
                      <Search size={16} />
                      Details
                    </button>
                    <button 
                      onClick={() => handleAcceptJob(job)}
                      className="flex items-center justify-center gap-2 bg-brand text-white py-[14px] rounded-2xl text-[13px] font-bold shadow-md shadow-brand/20 active:scale-95 transition-transform"
                    >
                      <Briefcase size={16} />
                      Accept Job
                    </button>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showKycAlert && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowKycAlert(false)} className="absolute inset-0 bg-brand/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl z-[70] text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-brand tracking-tighter mb-2">KYC Incomplete!</h2>
              <p className="text-sm font-medium text-brand/50 leading-relaxed mb-8 px-2">Your profile is not yet verified. Please complete your KYC process to start accepting jobs.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate("/profile")} className="w-full py-4.5 bg-brand text-white font-black text-sm rounded-2xl shadow-lg shadow-brand/20 active:scale-95 transition-transform">Complete KYC Now</button>
                <button onClick={() => setShowKycAlert(false)} className="w-full py-4.5 bg-gray-50 text-brand font-black text-sm rounded-2xl active:scale-95 transition-transform">Maybe Later</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
