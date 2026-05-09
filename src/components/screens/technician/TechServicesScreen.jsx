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

export function TechServicesScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [availableJobs, setAvailableJobs] = useState([]);
  const [ongoingJobs, setOngoingJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("available"); // available, ongoing
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
                price: `₹${job.price || job.amount || "0"}`,
                time: job.service_date ? `${job.service_date}, ${job.service_time || ""}` : "Flexible",
                image: job.image ? (job.image.startsWith('http') ? job.image : `${UPLOAD_BASE}/${job.image}`) : "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200&auto=format&fit=crop"
              };
            }).sort((a, b) => (a.distanceValue || 999) - (b.distanceValue || 999)));
          }
        } else {
          const response = await fetch(`${API_BASE}/bookings/get_technician_bookings.php`, { headers });
          const data = await response.json();
          if (data.status) {
            setOngoingJobs(data.data.filter(j => j.status?.toLowerCase() === 'ongoing' || j.status?.toLowerCase() === 'pending').map(job => ({
              id: job.id,
              title: job.service_name || job.subcategory_name || "Home Service",
              category: job.subcategory_name || (job.status?.toLowerCase() === 'pending' ? "Assigned" : "Ongoing"),
              location: job.address || "Mumbai",
              price: `₹${job.amount || "0"}`,
              time: `${job.service_date}, ${job.service_time}`,
              customer: job.customer_name,
              status: job.status,
              image: job.image ? (job.image.startsWith('http') ? job.image : `${UPLOAD_BASE}/${job.image}`) : "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200&auto=format&fit=crop"
            })));
          } else {
              setOngoingJobs([]);
          }
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, userLocation, activeTab]);

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
        <h2 className="text-3xl font-black tracking-tight text-brand">My Jobs</h2>
        <div className="flex bg-brand/5 p-1.5 rounded-2xl mt-4 mb-2">
          {["available", "ongoing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-brand/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-4">
        {activeTab === "available" ? (
          availableJobs.length > 0 ? (
            availableJobs.map((job) => (
              <JobCard key={job.id} job={job} onAccept={() => handleAcceptJob(job)} onDetails={() => navigate(`/tech/job/${job.id}`)} />
            ))
          ) : (
            <EmptyState message="No available jobs nearby" />
          )
        ) : (
          ongoingJobs.length > 0 ? (
            ongoingJobs.map((job) => (
              <JobCard key={job.id} job={job} onDetails={() => navigate(`/tech/job/${job.id}`)} isOngoing />
            ))
          ) : (
            <EmptyState message="No ongoing jobs at the moment" />
          )
        )}
      </div>

      <KycAlert show={showKycAlert} onClose={() => setShowKycAlert(false)} onVerify={() => navigate("/profile")} />
    </motion.div>
  );
}

function JobCard({ job, onAccept, onDetails, isOngoing }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-brand/5 rounded-3xl p-4 shadow-sm"
    >
      <div className="flex gap-3 items-start">
        <img src={job.image} alt="job" className="w-[72px] h-[72px] rounded-2xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-[14px] font-bold text-brand leading-tight truncate">{job.title}</h3>
            <span className="bg-brand/10 text-brand px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase">{job.category}</span>
          </div>
          <div className="text-[13px] font-bold text-brand mb-1">{job.price}</div>
          <div className="text-[11px] text-brand/40 font-medium truncate flex items-center gap-1">
             <MapPin size={10} /> {job.location} {job.distance && `• ${job.distance}`}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button onClick={onDetails} className="bg-brand/5 text-brand py-3 rounded-xl text-[12px] font-bold">Details</button>
        {!isOngoing ? (
          <button onClick={onAccept} className="bg-brand text-white py-3 rounded-xl text-[12px] font-bold shadow-md">Accept</button>
        ) : (
          <div className="flex items-center justify-center text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-100 bg-emerald-50 rounded-xl">Ongoing</div>
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
