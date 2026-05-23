import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Shield, MapPin, User, Phone,
  Calendar, Clock, IndianRupee, AlertCircle,
  CheckCircle2, Briefcase, Info, MessageSquare, ArrowRight
} from "lucide-react";
import { API_BASE, UPLOAD_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";
import { DetailSkeleton } from "../../ui/SkeletonScreen";

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

        if (data.status) {
          const job = data.data;
          const serviceTitle = job.service_name || job.category_name || "Home Service";

          setJobData({
            id: job.id,
            title: serviceTitle,
            category: job.category_name || "General",
            location: job.city || "Nearby",
            price: `₹${job.service_price || job.price || job.amount || "0"}`,
            time: job.service_date ? `${job.service_date}, ${job.service_time || ""}` : "Flexible",
            customer: job.customer_name || job.name || "Client",
            address: job.address || "No address provided",
            contact: job.customer_phone || job.phone || "No contact",
            notes: job.notes || "No additional notes provided.",
            paymentMode: job.payment_method || "Pay After Service",
            image: "https://dorcasaid.com/" + job.image,
            coords: job.coords || (job.latitude && job.longitude ? `${job.latitude},${job.longitude}` : "19.0760,72.8777"),
            status: job.status,
            vendor_id: job.vendor_id
          });
        }
      } catch (error) {
        console.error("Fetch Job Details Error:", error);
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
    return <DetailSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col w-full h-full bg-[#f8fbff] overflow-y-auto pb-32 remove-scrollbar relative font-sans text-[#242B3A]"
    >
      {/* Header Bar */}
      <div className="px-6 pt-12 pb-4 bg-white border-b border-brand/5 flex items-center justify-between shrink-0 shadow-sm relative z-30">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-[#242B3A] border border-brand/5 active:scale-90 transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-[#242B3A] text-[10px] font-black uppercase tracking-widest">
          Job Details
        </div>
        <button className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-[#242B3A] border border-brand/5 active:scale-90 transition-all">
          <MessageSquare size={20} />
        </button>
      </div>

      {/* Content Container */}
      <div className="px-6 pt-6 relative z-20">

        {/* Service Image Section */}
        <div className="mb-6 rounded-[2rem] overflow-hidden border border-brand/10 shadow-md h-64 relative group">
          <img
            src={jobData?.image}
            alt={jobData?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-4 right-4 text-white z-10">
            <h2 className="text-2xl font-black leading-tight drop-shadow-lg">{jobData?.title}</h2>
          </div>
        </div>

        {/* Service Booking Table Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-md border border-brand/5 mb-6 overflow-hidden">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
            <Briefcase className="text-blue-600" size={18} />
            <h3 className="text-xs font-black text-[#242B3A] uppercase tracking-widest">Service Booking Details</h3>
          </div>

          <div className="overflow-x-auto remove-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-black uppercase tracking-wider text-[9px]">
                  <th className="pb-3">Service</th>
                  <th className="pb-3 text-center">Category</th>
                  <th className="pb-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-bold">
                <tr>
                  <td className="py-4 text-[#242B3A] text-xs font-bold leading-tight pr-2">{jobData.title}</td>
                  <td className="py-4 text-[#242B3A] text-center text-xs">{jobData.category}</td>
                  <td className="py-4 text-blue-600 text-right text-xs font-black">{jobData.price}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule & Price Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-md border border-brand/5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Scheduled Time</p>
              <div className="flex items-center gap-2 text-blue-600">
                <Clock size={12} />
                <span className="text-[10px] font-black uppercase tracking-widest">{jobData.time}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Payout</p>
              <div className="flex items-center justify-end gap-0.5 text-blue-600">
                <IndianRupee size={16} strokeWidth={3} />
                <span className="text-2xl font-black tracking-tight">{jobData.price.replace('₹', '')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <SectionTitle title="Client Information" />
        <div className="bg-white rounded-[2rem] p-6 shadow-md border border-brand/5 mb-6 space-y-5">
          <DetailItem icon={User} label="Client Name" value={jobData.customer} />
          <DetailItem icon={MapPin} label="Service Address" value={jobData.address} />

          {/* Contact Call Bar */}
          <div className="mt-6 flex items-center justify-between bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Customer Number</p>
                <p className="text-[14px] font-bold text-[#242B3A] tracking-wide">{jobData.contact}</p>
              </div>
            </div>
            <a
              href={`tel:${jobData.contact}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/25 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Phone size={12} fill="currentColor" />
              Call Now
            </a>
          </div>

          {/* Real Map iframe */}
          <div className="mt-5 rounded-2xl overflow-hidden border border-brand/5 shadow-inner bg-white h-48 relative group">
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
              >
                <MapPin size={12} /> Open Directions
              </button>
            </div>
          </div>
        </div>

        {/* Schedule & Logistics */}
        <div className="space-y-4">
          <SectionTitle title="Schedule & Logistics" />
          <div className="bg-white border border-brand/5 rounded-[2rem] p-6 shadow-md space-y-5">
            <DetailItem icon={Calendar} label="Service Date" value={jobData.time.split(',')[0]} />
            <DetailItem icon={Clock} label="Requested Time" value={jobData.time.split(',')[1]} />
            <DetailItem icon={IndianRupee} label="Payment Mode" value={jobData.paymentMode} />
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4 pt-6">
          <SectionTitle title="Job Instructions" />
          <div className="bg-white border border-brand/5 rounded-[2rem] p-6 shadow-md">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-blue-500/5 rounded-xl flex items-center justify-center text-blue-600 shrink-0 border border-blue-500/10">
                <MessageSquare size={20} />
              </div>
              <p className="text-[13px] font-medium text-slate-600 leading-relaxed italic">
                "{jobData.notes}"
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-8 flex gap-3">
          {jobData.status?.toLowerCase() === 'pending' || !jobData.vendor_id ? (
            <>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleRejectJob}
                className="flex-1 bg-white border border-slate-200 text-slate-600 py-4.5 rounded-2xl text-sm font-black active:scale-95 transition-all hover:bg-slate-50"
              >
                Reject Job
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAcceptJob}
                className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white py-4.5 rounded-2xl text-sm font-black shadow-[0_10px_25px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                Accept Job
                <Briefcase size={18} />
              </motion.button>
            </>
          ) : jobData.status?.toLowerCase() === 'ongoing' ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCompleteJob}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4.5 rounded-2xl text-sm font-black shadow-[0_10px_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Mark as Completed
              <CheckCircle2 size={18} />
            </motion.button>
          ) : jobData.status?.toLowerCase() === 'completed' ? (
            <div className="w-full space-y-3">
              <div className="w-full bg-emerald-50 text-emerald-600 py-4.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 border border-emerald-500/20">
                Job Completed <CheckCircle2 size={18} />
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/tech/commissions")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4.5 rounded-2xl text-sm font-black shadow-[0_10px_25px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                Pay Commission
                <ArrowRight size={18} />
              </motion.button>
            </div>
          ) : (
            <div className="w-full bg-slate-100 text-slate-500 py-4.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 border border-dashed border-slate-200">
              Job Processing <Clock size={18} />
            </div>
          )}
        </div>

        <p className="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest mt-8 mb-5">
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
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white border border-brand/10 rounded-[2.5rem] p-8 shadow-2xl z-[70] text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/25">
                <AlertCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-[#242B3A] tracking-tight mb-2">KYC Incomplete!</h2>
              <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 px-2">Your profile is not yet verified. Please complete your KYC process to start accepting jobs.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate("/tech/verification")} className="w-full py-4 bg-blue-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-blue-600/20">Complete KYC Now</button>
                <button onClick={() => setShowKycAlert(false)} className="w-full py-4 bg-slate-100 text-slate-600 font-black text-sm rounded-2xl">Maybe Later</button>
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
    <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-1 mb-2.5">{title}</h3>
  );
}

function DetailItem({ icon: Icon, label, value, isSupport }) {
  return (
    <div className="flex gap-4 items-start">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/5 text-blue-600 border border-blue-500/10`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
        <p className={`text-[14px] font-bold leading-snug text-[#242B3A]`}>{value}</p>
      </div>
    </div>
  );
}
