import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, Shield, MapPin, User, Phone, 
  Calendar, Clock, IndianRupee, AlertCircle, 
  CheckCircle2, Briefcase, Info, MessageSquare, ArrowRight
} from "lucide-react";
import { API_BASE, UPLOAD_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";

export function TechJobDetailScreen() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [jobData, setJobData] = useState(null);
  const [showKycAlert, setShowKycAlert] = useState(false);
  
  const [isKycComplete, setIsKycComplete] = useState(false);
  const [isKycLoading, setIsKycLoading] = useState(true);

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const headers = { "Authorization": `Bearer ${token}`, "Role": role };

        const response = await fetch(`${API_BASE}/profile/get_profile.php`, { headers });
        const data = await response.json();
        
        if (data.status) {
          // Use is_approved which we updated in the backend
          setIsKycComplete(data.data.is_approved);
        }
      } catch (error) {
        console.error("KYC Fetch Error:", error);
      } finally {
        setIsKycLoading(false);
      }
    };

    fetchKycStatus();
  }, []);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const headers = { "Authorization": `Bearer ${token}`, "Role": role };

        const response = await fetch(`${API_BASE}/bookings/get_job_details.php?id=${jobId}`, { headers });
        const data = await response.json();
        
        console.log(data);
        if (data.status) {
          
          const job = data.data;
          setJobData({
            id: job.id,
            title: job.service_name || job.category_name || "Home Service",
            category: job.category_name || "General",
            location: job.city || "Nearby",
            price: `₹${job.service_price || job.price || job.amount || "0"}`,
            time: job.service_date ? `${job.service_date}, ${job.service_time || ""}` : "Flexible",
            customer: job.customer_name || job.name || "Client",
            address: job.address || "No address provided",
            contact: job.phone || "No contact",
            notes: job.notes || "No additional notes provided.",
            paymentMode: job.payment_method || "Pay After Service",
            image: job.image ? (job.image.startsWith('http') ? job.image : `${UPLOAD_BASE}/${job.image}`) : "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
            coords: job.coords || (job.latitude && job.longitude ? `${job.latitude},${job.longitude}` : "19.0760,72.8777"),
            status: job.status,
            vendor_id: job.vendor_id
          });
        }
      } catch (error) {
        // console.error("Fetch Job Details Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) fetchJobDetails();
  }, [jobId]);

  const handleCompleteJob = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const response = await fetch(`${API_BASE}/bookings/complete_job.php`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Role": role,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ job_id: jobData.id })
      });

      const data = await response.json();
      if (data.status) {
        showToast(data.message || "Job completed successfully!", "success");
        navigate("/tech");
      } else {
        showToast(data.message || "Failed to complete job", "error");
      }
    } catch (error) {
      console.error("Complete Job Error:", error);
      showToast("Something went wrong. Please try again.", "error");
    }
  };

  const handleAcceptJob = async () => {
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
        body: JSON.stringify({ job_id: jobData.id })
      });

      const data = await response.json();
      if (data.status) {
        showToast(data.message || `Job accepted! Notification sent to customer.`, "success");
        navigate("/tech");
      } else {
        showToast(data.message || "Failed to accept job", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };

  const handleRejectJob = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const response = await fetch(`${API_BASE}/bookings/reject_job.php`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Role": role,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ job_id: jobData.id })
      });

      const data = await response.json();
      if (data.status) {
        showToast("Job rejected. Customer will be notified.", "info");
        navigate("/tech");
      } else {
        showToast(data.message || "Failed to reject job", "error");
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${jobData.coords}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col w-full h-full bg-[#f8fbff] overflow-y-auto pb-10 remove-scrollbar relative"
    >
      {/* Hero Image Section */}
      <div className="relative w-full h-80 shrink-0">
        <img 
          src={jobData.image} 
          className="w-full h-full object-cover"
          alt="service"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fbff] via-transparent to-black/30" />
        
        {/* Floating Header */}
        <div className="absolute top-12 left-0 w-full px-6 flex items-center justify-between z-20">
           <button 
             onClick={() => navigate(-1)}
             className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center border border-brand/5 text-brand active:scale-90 transition-all shadow-md"
           >
             <ChevronLeft size={24} />
           </button>
           <div className="bg-white px-4 py-2 rounded-2xl border border-brand/5 text-brand text-[10px] font-black uppercase tracking-widest shadow-md">
             Job Details
           </div>
           <button className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center border border-brand/5 text-brand active:scale-90 transition-all shadow-md">
             <MessageSquare size={20} />
           </button>
        </div>

        {/* Category Badge removed per request */}
      </div>

      {/* Content Container */}
      <div className="px-6 -mt-4 relative z-20">
        
        {/* Title & Price Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_15px_45px_rgba(13,110,253,0.08)] border border-brand/5 mb-8">
           <div className="flex justify-between items-start">
              <div className="flex-1 pr-4">
                 <h1 className="text-2xl font-black text-brand leading-tight mb-2">{jobData.title}</h1>
                 <div className="flex items-center gap-2 text-brand/40">
                    <Clock size={14} />
                    <span className="text-[12px] font-bold uppercase tracking-wider">{jobData.time}</span>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-brand/30 uppercase tracking-widest mb-1">Payout</p>
                 <div className="flex items-center justify-end gap-1 text-brand">
                  <IndianRupee size={20} strokeWidth={3} />
                    <span className="text-3xl font-black tracking-tighter">{jobData.price.replace('₹', '')}</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Customer Details */}
        <SectionTitle title="Client Information" />
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-brand/5 mb-6 space-y-6">
           <DetailItem icon={User} label="Client Name" value={jobData.customer} />
           <div className="pt-2">
              <DetailItem icon={MapPin} label="Service Address" value={jobData.address} />
              
              {/* Real Map iframe */}
              <div className="mt-6 rounded-2xl overflow-hidden border border-brand/5 shadow-inner bg-brand/5 h-48 relative group">
                 <iframe 
                   title="Job Location"
                   width="100%" 
                   height="100%" 
                   frameBorder="0" 
                   style={{ border: 0 }}
                   src={`https://maps.google.com/maps?q=${jobData.coords}&z=15&output=embed`}
                   allowFullScreen
                 />
                 <div className="absolute top-3 right-3">
                    <button 
                      onClick={openDirections}
                      className="bg-brand text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                       <MapPin size={12} /> Open Directions
                    </button>
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-4">
          <SectionTitle title="Schedule & Logistics" />
          <div className="bg-white border border-brand/5 rounded-[2rem] p-6 shadow-sm space-y-5">
             <DetailItem icon={Calendar} label="Service Date" value={jobData.time.split(',')[0]} />
             <DetailItem icon={Clock} label="Requested Time" value={jobData.time.split(',')[1]} />
             <DetailItem icon={IndianRupee} label="Payment Mode" value={jobData.paymentMode} />
          </div>
        </div>

        <div className="space-y-4 pt-6">
          <SectionTitle title="Job Instructions" />
          <div className="bg-white border border-brand/5 rounded-[2rem] p-6 shadow-sm">
             <div className="flex gap-4">
                <div className="w-10 h-10 bg-brand/5 rounded-xl flex items-center justify-center text-brand shrink-0">
                   <MessageSquare size={20} />
                </div>
                <p className="text-[13px] font-medium text-brand/70 leading-relaxed italic">
                   "{jobData.notes}"
                </p>
             </div>
          </div>
        </div>

        {/* Action Buttons - Now Inline */}
        <div className="pt-10 flex gap-3">
           {jobData.status?.toLowerCase() === 'pending' || !jobData.vendor_id ? (
             <>
               <motion.button
                 whileTap={{ scale: 0.98 }}
                 onClick={handleRejectJob}
                 className="flex-1 bg-white border border-brand/5 text-brand py-5 rounded-[2rem] text-[15px] font-black active:scale-95 transition-all shadow-sm"
               >
                 Reject Job
               </motion.button>
               <motion.button
                 whileTap={{ scale: 0.98 }}
                 onClick={handleAcceptJob}
                 className="flex-[2] bg-brand text-white py-5 rounded-[2rem] text-[15px] font-black shadow-[0_15px_35px_rgba(13,110,253,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all"
               >
                 Accept Job
                 <Briefcase size={18} />
               </motion.button>
             </>
           ) : jobData.status?.toLowerCase() === 'ongoing' ? (
             <motion.button
               whileTap={{ scale: 0.98 }}
               onClick={handleCompleteJob}
               className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] text-[15px] font-black shadow-[0_15px_35px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all"
             >
               Mark as Completed
               <CheckCircle2 size={18} />
             </motion.button>
           ) : jobData.status?.toLowerCase() === 'completed' ? (
             <div className="w-full space-y-3">
               <div className="w-full bg-emerald-50 text-emerald-600 py-5 rounded-[2rem] text-[15px] font-black flex items-center justify-center gap-2 border border-emerald-100">
                 Job Completed <CheckCircle2 size={18} />
               </div>
               <motion.button
                 whileTap={{ scale: 0.98 }}
                 onClick={() => navigate("/tech/commissions")}
                 className="w-full bg-brand text-white py-5 rounded-[2rem] text-[15px] font-black shadow-[0_15px_35px_rgba(13,110,253,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all"
               >
                 Pay Commission (10%)
                 <ArrowRight size={18} />
               </motion.button>
             </div>
           ) : (
             <div className="w-full bg-brand/5 text-brand/40 py-5 rounded-[2rem] text-[15px] font-black flex items-center justify-center gap-2 border border-dashed border-brand/10">
               Job Processing <Clock size={18} />
             </div>
           )}
        </div>
        
        <p className="text-center text-[10px] font-bold text-brand/30 uppercase tracking-[2px] mt-8 mb-10">
          Job code: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>

      {/* KYC Alert Modal */}
      <AnimatePresence>
        {showKycAlert && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKycAlert(false)}
              className="absolute inset-0 bg-brand/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl z-[70] text-center"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-brand tracking-tighter mb-2">KYC Incomplete!</h2>
              <p className="text-sm font-medium text-brand/50 leading-relaxed mb-8 px-2">Your profile is not yet verified. Please complete your KYC process to start accepting jobs.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate("/tech/verification")} className="w-full py-4.5 bg-brand text-white font-black text-sm rounded-2xl shadow-lg shadow-brand/20">Complete KYC Now</button>
                <button onClick={() => setShowKycAlert(false)} className="w-full py-4.5 bg-gray-50 text-brand font-black text-sm rounded-2xl">Maybe Later</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


function SectionTitle({ title }) {
  return (
    <h3 className="text-[11px] font-black text-brand/30 uppercase tracking-[2px] px-1">{title}</h3>
  );
}

function DetailItem({ icon: Icon, label, value, isSupport }) {
  return (
    <div className="flex gap-4 items-start">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSupport ? 'bg-blue-50 text-blue-600' : 'bg-brand/5 text-brand'}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[10px] font-black text-brand/30 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className={`text-[15px] font-bold leading-tight ${isSupport ? 'text-blue-600' : 'text-brand'}`}>{value}</p>
      </div>
    </div>
  );
}
