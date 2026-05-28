import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, IndianRupee, Clock, CheckCircle2, 
  AlertCircle, ArrowRight, Shield, Wallet, CreditCard
} from "lucide-react";
import { API_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";
import { TechCommissionSkeleton } from "../../ui/SkeletonScreen";

export function TechCommissionScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' or 'history'
  const [unpaidJobs, setUnpaidJobs] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [totalDue, setTotalDue] = useState(0);
  const [totalCompletedJobs, setTotalCompletedJobs] = useState(0);

  useEffect(() => {
    fetchUnpaidCommissions();
    fetchPaymentHistory();
    fetchProfileStats();
  }, []);

  const fetchProfileStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const headers = { "Authorization": `Bearer ${token}`, "Role": role };
      const res = await fetch(`${API_BASE}/profile/get_profile.php`, { headers });
      const data = await res.json();
      if (data.status) {
        setTotalCompletedJobs(parseInt(data.data.stats?.completed_jobs || 0));
      }
    } catch (e) {}
  };

  const fetchPaymentHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const headers = { "Authorization": `Bearer ${token}`, "Role": role };
      const response = await fetch(`${API_BASE}/payments/get_payment_history.php`, { headers });
      const data = await response.json();
      if (data.status) {
        setPaymentHistory(data.data);
      }
    } catch (error) {
      console.error("Failed to load history", error);
    }
  };

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

      const response = await fetch(`${API_BASE}/bookings/get_technician_bookings.php?status=completed`, { headers });
      const data = await response.json();

      if (data.status) {
        const pending = data.data.filter(job => 
          job.commission_status === 'pending' && 
          parseFloat(job.commission_amount || 0) > 0 // Only show if commission is set by admin (> 0)
        );
        setUnpaidJobs(pending);
        
        const total = pending.reduce((sum, job) => {
          return sum + parseFloat(job.commission_amount || 0);
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
          payment_gateway: "ccavenue",
          return_url: window.location.origin
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

  if (isLoading) {
    return <TechCommissionSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-[#f8fafc] overflow-y-auto pb-24 remove-scrollbar"
    >
      {/* Brand Gradient Header */}
      <div className="brand-gradient pt-12 pb-5 px-6 rounded-b-[2.5rem] shadow-lg relative  text-white sticky top-0 z-30 shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/10 shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black tracking-tight leading-none mb-1">Commissions</h2>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[2px]">Outstanding Dues</p>
          </div>
          <div className="w-11" />
        </div>
      </div>

      <div className="px-6 pt-8 pb-4">

        {/* Summary Card */}
        <div className="bg-brand rounded-[2rem] p-6 text-white shadow-xl shadow-brand/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[2px] mb-1">Total Outstanding</p>
            {totalCompletedJobs < 3 && totalDue <= 0 ? (
              <div className="py-4">
                <p className="text-sm font-bold opacity-80">Commission starts after your first 3 successful jobs.</p>
                <div className="mt-2 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-500" 
                    style={{ width: `${(totalCompletedJobs / 3) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] font-black uppercase mt-2 opacity-60">{totalCompletedJobs}/3 Jobs Completed</p>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mt-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-brand/5 text-brand/40'}`}
          >
            Pending Dues
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-brand text-white shadow-lg shadow-brand/20' : 'bg-brand/5 text-brand/40'}`}
          >
            Paid History
          </button>
        </div>
      </div>

      

      <div className="px-6 py-8 space-y-6">
        {activeTab === 'pending' ? (
            <>
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[11px] font-black text-brand/30 uppercase tracking-[2px]">Outstanding Commissions</h3>
                <span className="text-[10px] font-bold text-brand bg-brand/5 px-2 py-1 rounded-lg">{unpaidJobs.length} Jobs</span>
              </div>

          <div className="space-y-4">
            {unpaidJobs.length > 0 ? (
              unpaidJobs.map((job) => {
                const amount = parseFloat(job.amount_paid || 0);
                const commission = parseFloat(job.commission_amount || 0);
                return (
                  <div key={job.id} className="bg-white rounded-[2rem] p-5 border border-gray-900 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-brand text-[15px] leading-tight">{job.service_name || "Home Service"}</h4>
                          <p className="text-[10px] font-bold text-brand/30 uppercase mt-1">{new Date(job.completed_at || job.service_date).toLocaleDateString()}</p>
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
                          <p className="text-[9px] font-black text-brand/30 uppercase leading-none mb-1">Commission</p>
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

            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[11px] font-black text-brand/30 uppercase tracking-[2px]">Recent Transactions</h3>
                <span className="text-[10px] font-bold text-brand bg-brand/5 px-2 py-1 rounded-lg">{paymentHistory.length} Payments</span>
              </div>
              
              {paymentHistory.length > 0 ? (
                paymentHistory.map((item) => (
                  <div key={item.order_id} className="bg-white rounded-[2rem] p-5 border border-gray-900 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-brand text-[14px] leading-tight">Commission Paid</h4>
                          <p className="text-[9px] font-bold text-brand/30 uppercase mt-1">ID: {item.order_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-black text-brand/30 uppercase tracking-widest mb-0.5">Amount</p>
                        <p className="font-black text-emerald-600">₹{parseFloat(item.amount).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-dashed border-brand/10 flex justify-between items-center">
                      <div className="text-[10px] font-bold text-brand/40">
                        {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full">
                        <Shield size={10} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-emerald-600 uppercase">Verified</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-4 bg-white rounded-[2.5rem] border border-dashed border-brand/10">
                  <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mx-auto text-brand/20">
                    <Clock size={32} />
                  </div>
                  <div>
                    <p className="font-black text-brand tracking-tight">No history found</p>
                    <p className="text-[10px] font-bold text-brand/40 uppercase tracking-widest">Your payment history will appear here</p>
                  </div>
                </div>
              )}
            </div>
          )}
      </div>
    </motion.div> 
  );
}
