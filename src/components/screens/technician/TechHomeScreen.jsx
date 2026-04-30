import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, IndianRupee, MapPin, PhoneCall, CheckCircle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const API_BASE = "http://localhost/dorcasApi/api";

export function TechHomeScreen() {
  const { isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="bg-brand pt-14 pb-14 px-5 rounded-b-[2.5rem] shadow-sm relative overflow-hidden text-base">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10">
          <p className="text-white/80 text-[13px] font-semibold tracking-widest uppercase mb-1">Technician Portal</p>
          <h2 className="text-2xl font-black tracking-tight text-white">Today's Overview</h2>
        </div>
      </div>

      <div className="relative z-20 px-5 -mt-8 mb-6">
        <div className="bg-white shadow-[0_8px_24px_rgba(13,110,253,0.12)] border border-brand/5 rounded-3xl p-5 flex gap-4">
           <div className="flex-[1.5] bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 flex flex-col justify-center text-white shadow-inner overflow-hidden relative">
            <div className="absolute top-2 right-2 opacity-20"><IndianRupee size={48} /></div>
            <div className="relative z-10">
              <span className="text-[11px] font-semibold text-white/80 uppercase tracking-widest mb-1 block">Active Earnings</span>
              <span className="text-3xl font-black">{profileData?.stats?.value2 || "₹0"}</span>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full mt-1 inline-block">Current Balance</span>
            </div>
          </div>
          <div className="flex-1 bg-brand/5 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-brand/10">
            <span className="text-[11px] font-bold text-brand/60 uppercase tracking-widest mb-1">Done</span>
            <span className="text-3xl font-black text-brand">{profileData?.stats?.value1 || 0}</span>
            <span className="text-[10px] text-brand/50 mt-1">Completed</span>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[15px] font-black text-brand tracking-tight">Recent Tasks</h3>
            <span className="text-[10px] font-bold text-brand/40 uppercase tracking-widest">Waiting for jobs</span>
          </div>
          
          <div className="bg-white border border-brand/10 shadow-[0_4px_16px_rgba(13,110,253,0.04)] rounded-3xl p-10 flex flex-col items-center justify-center text-center opacity-60">
             <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mb-4">
                <Briefcase size={32} className="text-brand/20" />
             </div>
             <p className="text-xs font-bold text-brand/40 uppercase tracking-widest">No active jobs assigned</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
