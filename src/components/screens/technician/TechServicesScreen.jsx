import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  MapPin, Clock, IndianRupee, ChevronLeft,
  Search, Filter, Briefcase, Zap, Star,
  Shield, User, Calendar, AlertCircle, Phone
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../context/ToastContext";
import { API_BASE, UPLOAD_BASE } from "../../../config";
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { ListTabSkeleton } from "../../ui/SkeletonScreen";

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

export function TechServicesScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [ongoingJobs, setOngoingJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available"); // available, ongoing, completed
  const [completedJobs, setCompletedJobs] = useState([]);
  const [showKycAlert, setShowKycAlert] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

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

        setAvailableJobs(prev => prev.filter(j => j.id !== job.id));
        setActiveTab("ongoing"); // Switch to ongoing tab

      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Something went wrong. Please try again.", "error");
    }
  };

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

        const profileRes = await fetch(`${API_BASE}/profile/get_profile.php`, { headers });
        const profileJson = await profileRes.json();
        
        if (profileJson.status) setProfileData(profileJson.data);

        if (activeTab === "available") {
          const response = await fetch(`${API_BASE}/bookings/get_available_jobs.php`, { headers });
          const data = await response.json();
          
          if (data.status) {
            setAvailableJobs(data.data.map(job => {
              const dist = calculateDistance(userLocation?.lat, userLocation?.lng, job.latitude, job.longitude);
              return {
                id: job.id,
                title: job.service_name || job.category_name || "Home Service",
                category: job.category_name || "General",
                location: job.address || "Nearby",
                distanceValue: dist,
                distance: dist ? `${dist.toFixed(1)} km` : "Nearby",
                price: `₹${job.price || job.amount || job.service_price || "0"}`,
                time: job.service_date ? `${job.service_date}, ${job.service_time || ""}` : "Flexible",
                image: "https://www.dorcasaid.com/"+job.image  
              };
            }).sort((a, b) => (a.distanceValue || 999) - (b.distanceValue || 999)));
          }
        } else if (activeTab === "ongoing") {
          const response = await fetch(`${API_BASE}/bookings/get_technician_bookings.php`, { headers });
          const data = await response.json();
          if (data.status) {
            setOngoingJobs(data.data.filter(j => j.status?.toLowerCase() === 'ongoing' || j.status?.toLowerCase() === 'pending').map(job => ({
              id: job.id,
              title: job.service_name || job.subcategory_name || "Home Service",
              category: job.subcategory_name || (job.status?.toLowerCase() === 'pending' ? "Assigned" : "Ongoing"),
              location: job.address || "Mumbai",
              price: `₹${job.amount ||job.service_price || "0"}`,
              time: `${job.service_date}, ${job.service_time}`,
              customer: job.customer_name,
              status: job.status,
              image: "https://www.dorcasaid.com/"+job.image
            })));
          } else {
            setOngoingJobs([]);
          }
        } else {
          // Completed Jobs
          const response = await fetch(`${API_BASE}/bookings/get_technician_bookings.php?status=completed`, { headers });
          const data = await response.json();
          if (data.status) {
            setCompletedJobs(data.data.map(job => ({
              id: job.id,
              title: job.service_name || job.subcategory_name || "Home Service",
              category: "Completed",
              location: job.address || "Mumbai",
              price: `₹${job.amount_paid || job.amount || "0"}`,
              time: `${job.service_date || ""}`,
              customer: job.customer_name,
              status: "completed",
              image: "https://dorcasaid.com/" + job.image
            })));
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
  }, [isAuthenticated, userLocation, activeTab]);

  if (isLoading) {
    return <ListTabSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-y-auto pb-24 remove-scrollbar relative"
    >
      {/* Brand Gradient Header */}
      <div className="brand-gradient pt-12 pb-5 px-6 rounded-b-[2.5rem] shadow-lg relative overflow-hidden text-white shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md hover:bg-white/30 transition-all shadow-sm border border-white/10"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black tracking-tight leading-none mb-1">Service Jobs</h2>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[2px]">Work Queue</p>
          </div>
          <div className="w-11" />
        </div>
        
        <div className="relative z-10 flex bg-white/10 backdrop-blur-md p-1 rounded-2xl">
          {["available", "ongoing", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-brand shadow-lg" : "text-white/60"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-6 space-y-4">
        {activeTab === "available" ? (
          availableJobs.length > 0 ? (
            availableJobs.map((job) => (
              <JobCard key={job.id} job={job} onAccept={() => handleAcceptJob(job)} onDetails={() => navigate(`/tech/job/${job.id}`)} />
            ))
          ) : (
            <EmptyState message="No available jobs nearby" />
          )
        ) : activeTab === "ongoing" ? (
          ongoingJobs.length > 0 ? (
            ongoingJobs.map((job) => (
              <JobCard key={job.id} job={job} onDetails={() => navigate(`/tech/job/${job.id}`)} isOngoing />
            ))
          ) : (
            <EmptyState message="No ongoing jobs at the moment" />
          )
        ) : (
          completedJobs.length > 0 ? (
            completedJobs.map((job) => (
              <JobCard key={job.id} job={job} onDetails={() => navigate(`/tech/job/${job.id}`)} isCompleted />
            ))
          ) : (
            <EmptyState message="No completed jobs yet" />
          )
        )}
      </div>

      <KycAlert show={showKycAlert} onClose={() => setShowKycAlert(false)} onVerify={() => navigate("/profile")} />
    </motion.div>
  );
}

function JobCard({ job, onAccept, onDetails, isOngoing, isCompleted }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm"
    >
      <div className="flex gap-3 items-start">
        <img src={job.image} alt="job" className="w-[72px] h-[72px] rounded-2xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-[14px] font-bold text-brand leading-tight truncate">{job.title}</h3>
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase ${isCompleted ? 'bg-emerald-50 text-emerald-500' : 'bg-brand/10 text-brand'}`}>{job.category}</span>
          </div>
          <div className="text-[13px] font-bold text-brand mb-1">{job.price}</div>
          <div className="text-[11px] text-brand/40 font-medium truncate flex items-center gap-1">
            <MapPin size={10} /> {job.location} {job.distance && `• ${job.distance}`}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={onDetails} className="bg-brand/5 text-brand py-3 rounded-xl text-[12px] font-bold">Details</button>
        {!isOngoing && !isCompleted ? (
          <button onClick={onAccept} className="bg-brand text-white py-3 rounded-xl text-[12px] font-bold shadow-md">Accept</button>
        ) : (
          <div className={`flex items-center justify-center text-[10px] font-black uppercase tracking-widest border rounded-xl ${isCompleted ? 'text-emerald-500 border-emerald-100 bg-emerald-50' : 'text-emerald-500 border-emerald-100 bg-emerald-50'}`}>
            {isCompleted ? "Completed" : "Ongoing"}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-20 text-center">
      <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand/20">
        <Briefcase size={32} />
      </div>
      <p className="text-sm font-bold text-brand/30 uppercase tracking-widest">{message}</p>
    </div>
  );
}

function KycAlert({ show, onClose, onVerify }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-brand/60 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl z-[70] text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-black text-brand tracking-tighter mb-2">KYC Incomplete!</h2>
            <p className="text-sm font-medium text-brand/50 leading-relaxed mb-8 px-2">Please complete your KYC to accept jobs.</p>
            <div className="flex flex-col gap-3">
              <button onClick={onVerify} className="w-full py-4 bg-brand text-white font-black text-sm rounded-2xl">Complete KYC Now</button>
              <button onClick={onClose} className="w-full py-4 bg-gray-50 text-brand font-black text-sm rounded-2xl">Maybe Later</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
