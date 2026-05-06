import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, IndianRupee, Clock, CheckCircle2, 
  AlertCircle, ArrowRight, Shield, Wallet, CreditCard
} from "lucide-react";
import { API_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";

export function TechCommissionScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [unpaidJobs, setUnpaidJobs] = useState([]);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    fetchUnpaidCommissions();
  }, []);

  const fetchUnpaidCommissions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const headers = { 
        "Authorization": `Bearer ${token}`, 
        "Role": role,
        "Content-Type": "application/json"
      };

      // We fetch completed jobs and filter for those where commission is not paid
      // In a real scenario, this would be a specific endpoint
      const response = await fetch(`${API_BASE}/bookings/get_technician_bookings.php?status=completed`, { headers });
      const data = await response.json();

      if (data.status) {
        // Filter jobs where commission_status is not 'paid'
        // For now, we simulate this by checking a hypothetical field or just showing all completed ones for demo
        const pending = data.data.filter(job => job.commission_status !== 'paid');
        setUnpaidJobs(pending);
        
        const total = pending.reduce((sum, job) => {
          const amount = parseFloat(job.amount || job.price || 0);
          const commission = amount * 0.10; // Assuming 10% commission
          return sum + commission;
        }, 0);
        setTotalDue(total);
      }
    } catch (error) {
      showToast("Failed to load commissions", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayCommission = async (jobId, amount) => {
    try {
      setIsProcessing(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      // 1. Request CCAvenue encrypted payload from your backend
      const response = await fetch(`${API_BASE}/payments/initiate_commission_payment.php`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Role": role,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          job_id: jobId,
          amount: amount,
          payment_gateway: "ccavenue"
        })
      });

      const data = await response.json();

      if (data.status && data.payment_url) {
        // Redirect to CCAvenue payment page
        // In a real app, you might use a hidden form or a direct redirect if the backend handles it
        window.location.href = data.payment_url;
      } else {
        // Simulated success for demo if endpoint doesn't exist
        showToast("Redirecting to CCAvenue...", "info");
        setTimeout(() => {
          showToast("Payment Gateway integration required on backend", "warning");
          setIsProcessing(false);
        }, 2000);
      }
    } catch (error) {
      showToast("Connection error", "error");
      setIsProcessing(false);
    }
  };

  const handlePayAll = async () => {
    if (totalDue <= 0) return;
    handlePayCommission("all", totalDue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-y-auto pb-24 remove-scrollbar"
    >
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white border-b border-brand/5 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-brand/5 flex items-center justify-center text-brand active:scale-90 transition-transform"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-black text-brand tracking-tight">Commission Dues</h2>
          <div className="w-10" />
        </div>

        {/* Summary Card */}
        <div className="bg-brand rounded-[2rem] p-6 text-white shadow-xl shadow-brand/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[2px] mb-1">Total Outstanding</p>
            <div className="flex items-baseline gap-1.5 mb-6">
              <span className="text-xl font-black">₹</span>
              <span className="text-4xl font-black tracking-tighter">{totalDue.toFixed(2)}</span>
            </div>
            <button 
              onClick={handlePayAll}
              disabled={isProcessing || totalDue <= 0}
              className="w-full bg-white text-brand py-4 rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Pay All Dues via CCAvenue"}
              <CreditCard size={18} />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="px-6 py-8 space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black text-brand/30 uppercase tracking-[2px]">Pending Job Commissions</h3>
            <span className="text-[10px] font-bold text-brand bg-brand/5 px-2 py-1 rounded-lg">{unpaidJobs.length} Jobs</span>
          </div>

          <div className="space-y-4">
            {unpaidJobs.length > 0 ? (
              unpaidJobs.map((job) => {
                const amount = parseFloat(job.amount || job.price || 0);
                const commission = amount * 0.10;
                return (
                  <div key={job.id} className="bg-white rounded-[2rem] p-5 border border-brand/5 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-brand text-[15px] leading-tight">{job.service_name || "Home Service"}</h4>
                          <p className="text-[10px] font-bold text-brand/30 uppercase mt-1">{new Date(job.service_date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-brand/30 uppercase tracking-widest mb-0.5">Job Amount</p>
                        <p className="font-black text-brand">₹{amount}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-dashed border-brand/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                          <IndianRupee size={14} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-brand/30 uppercase leading-none mb-1">Commission (10%)</p>
                          <p className="text-sm font-black text-amber-600">₹{commission.toFixed(2)}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handlePayCommission(job.id, commission)}
                        disabled={isProcessing}
                        className="bg-brand/5 text-brand px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center space-y-4 bg-white rounded-[2.5rem] border border-dashed border-brand/10">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <Shield size={32} />
                </div>
                <div>
                  <p className="font-black text-brand tracking-tight">All caught up!</p>
                  <p className="text-[10px] font-bold text-brand/40 uppercase tracking-widest">No pending commissions found</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-4">
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-amber-900 leading-relaxed">
                As per policy, commission must be paid within 24 hours of job completion to continue receiving new job requests.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
