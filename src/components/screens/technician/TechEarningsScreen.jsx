import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  IndianRupee, ArrowUpRight, Briefcase, ChevronLeft,
  TrendingUp, ChevronRight, Wallet
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { API_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";
import { TechEarningsSkeleton } from "../../ui/SkeletonScreen";

export function TechEarningsScreen() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("Weekly");
  const [isLoading, setIsLoading] = useState(true);
  const [earningsData, setEarningsData] = useState({
    pendingPayout: "0",
    today: "0",
    thisWeek: "0",
    thisMonth: "0",
    commissionDue: 0,
    transactions: []
  });
  const [upiId, setUpiId] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Role": role,
          "Content-Type": "application/json"
        };

        // 1. Fetch Profile for basic info
        const profileRes = await fetch(`${API_BASE}/profile/get_profile.php`, { headers });
        const profileJson = await profileRes.json();

        // 2. Fetch specific transactions (completed)
        const txRes = await fetch(`${API_BASE}/bookings/get_technician_bookings.php?status=completed`, { headers });
        const txJson = await txRes.json();

        // 3. Fetch Tech Stats for accurate commission and activity
        const statsRes = await fetch(`${API_BASE}/vendors/get_tech_stats.php`, { headers });
        const statsJson = await statsRes.json();

        if (profileJson.status) {
          const stats = profileJson.data.stats || {};

          setEarningsData(prev => ({
            ...prev,
            pendingPayout: stats.pending_payout || "0",
            today: `${stats.today_earnings || "0"}`,
            thisWeek: `${stats.weekly_earnings || "0"}`,
            thisMonth: `${stats.monthly_earnings || "0"}`,
          }));
        }


        if (statsJson.status) {
          setEarningsData(prev => ({
            ...prev,
            commissionDue: statsJson.data?.activity?.total_commission_due || 0
          }));
        }

        if (txJson.status) {
          const completedTransactions = txJson.data.map(tx => ({
            id: `TX-${tx.id}`,
            service: tx.service_name || tx.subcategory_name || "Home Service",
            customer: tx.customer_name || "Guest Client",
            date: tx.service_date || "Recent",
            amount: `₹${tx.amount_paid && tx.amount_paid !== "0" ? tx.amount_paid : (tx.service_price || "0")}`,
            status: tx.status || "completed",
            type: "credit",
            commission: parseFloat(tx.commission_amount || 0)
          }));

          const totalCommission = txJson.data
            .filter(tx => tx.commission_status === 'pending')
            .reduce((sum, tx) => sum + parseFloat(tx.commission_amount || 0), 0);

          setEarningsData(prev => ({
            ...prev,
            transactions: completedTransactions,
            commissionDue: totalCommission
          }));
        }
      } catch (error) {
        console.error("Earnings Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const handleRequestPayout = async () => {
    if (!upiId.trim()) {
      showToast(t('upi_required') || "Please enter UPI ID", "error");
      return;
    }

    try {
      setIsRedeeming(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const response = await fetch(`${API_BASE}/rewards/redeem_points.php`, { // Using same endpoint for simplicity or a tech specific one
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${token}`,
          "Role": role
        },
        body: `points=${earningsData.pendingPayout}&upi_id=${encodeURIComponent(upiId)}&type=tech_payout`
      });

      const data = await response.json();
      if (data.status) {
        setEarningsData(prev => ({ ...prev, pendingPayout: "0" }));
        setUpiId("");
        showToast(t('payout_requested') || "Payout request sent to admin!", "success");
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("Failed to send payout request", "error");
    } finally {
      setIsRedeeming(false);
    }
  };

  if (isLoading) {
    return <TechEarningsSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-[#f8fafc] overflow-y-auto pb-24 remove-scrollbar"
    >
      {/* Brand Gradient Header */}
      <div className="brand-gradient pt-12 pb-5 px-6 rounded-b-[2.5rem] shadow-lg relative text-white shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black tracking-tight">Earnings</h2>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[2px]">Financial Overview</p>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-5 mt-6 space-y-6">

          {/* Main Payout Card (Compact) */}
          <div className="relative bg-brand rounded-2xl p-6 shadow-md overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 opacity-10 select-none pointer-events-none">
              <IndianRupee size={160} strokeWidth={1} className="text-white" />
            </div>

            <div className="relative z-10 text-center">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[2px] mb-2">Total Payout Pending</p>
              <div className="flex items-baseline justify-center gap-1.5 text-white mb-6">
                <span className="text-xl font-black opacity-50">₹</span>
                <span className="text-5xl font-black tracking-tighter">{earningsData.pendingPayout}</span>
              </div>

              {Number(earningsData.pendingPayout) > 0 && (
                <div className="space-y-4 pt-4 border-t border-white/10 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest px-1">UPI ID for Payment</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="example@upi"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-sm font-bold text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/30 outline-none transition-all"
                    />
                  </div>
                  <button
                    onClick={handleRequestPayout}
                    disabled={isRedeeming}
                    className="w-full bg-white text-brand py-3.5 rounded-2xl text-[13px] font-black shadow-xl shadow-black/10 active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isRedeeming ? "Processing..." : "Request Payout Now"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Pending Commissions Card (New) */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-600">
                <Wallet size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-amber-900/40 uppercase tracking-widest mb-0.5">Commission Dues</p>
                <p className="text-lg font-black text-amber-900 tracking-tight">₹{parseFloat(earningsData.commissionDue || 0).toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/tech/commissions")}
              className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
            >
              Pay Now
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Today", value: `₹${earningsData.today}` },
              { label: "This Week", value: `₹${earningsData.thisWeek}` },
              { label: "This Month", value: `₹${earningsData.thisMonth}` },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-3.5 border border-brand/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center flex flex-col justify-center min-h-[80px]">
                <p className="text-[9px] font-bold text-brand/30 uppercase tracking-widest mb-1.5 leading-tight px-1">{stat.label}</p>
                <p className="text-[15px] font-black text-brand leading-none">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Transaction History */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="text-[11px] font-bold text-brand/30 uppercase tracking-[2px]">Recent Transactions</h3>
              <button
                onClick={() => navigate("/tech/dashboard")}
                className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-1"
              >
                View All <ChevronRight size={12} />
              </button>
            </div>

            <div className="space-y-3">
              {earningsData.transactions.length > 0 ? (
                earningsData.transactions.map((tx) => (
                  <div key={tx.id} className="bg-white p-4 rounded-2xl border border-brand/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between active:scale-[0.98] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-brand leading-none mb-1">{tx.service}</h4>
                        <p className="text-[10px] text-brand/30 font-bold uppercase tracking-wider">
                          {tx.customer} • {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[15px] font-black text-brand">{tx.amount}</p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'settled' || tx.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                        <p className={`text-[9px] font-bold uppercase tracking-widest ${tx.status === 'settled' || tx.status === 'completed' ? 'text-emerald-600' : 'text-blue-500'}`}>
                          {tx.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <p className="text-xs font-bold text-brand/30 uppercase tracking-widest">No recent transactions</p>
                </div>
              )}
            </div>
          </div>

          {/* Incentive Booster */}
          {/* <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 relative overflow-hidden group shadow-sm">
           <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-12 translate-x-12 transition-transform group-hover:scale-150" />
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600">
                    <TrendingUp size={18} />
                 </div>
                 <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-widest">Bonus Goal</h4>
              </div>
              <p className="text-[11px] font-bold text-emerald-800/60 leading-relaxed mb-6">
                 Complete 5 more high-rated jobs this week to unlock a <span className="text-emerald-600 font-black">₹500 Performance Bonus</span>.
              </p>
              <div className="w-full bg-emerald-200/30 h-2.5 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   whileInView={{ width: '60%' }}
                   className="bg-emerald-500 h-full rounded-full" 
                 />
              </div>
              <div className="flex justify-between mt-3">
                 <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-800/40">Progress</p>
                 <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">3/5 Jobs</p>
              </div>
           </div>
        </div> */}
        </div>
    </motion.div>
  );
}
