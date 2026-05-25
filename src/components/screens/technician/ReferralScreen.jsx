import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Share2, Copy, Users, 
  Gift, Wallet, ArrowRight, Zap,
  CheckCircle2, Info
} from "lucide-react";
import { API_BASE, APP_DOMAIN } from "../../../config";
import { useToast } from "../../../context/ToastContext";
import { useAuth } from "../../../context/AuthContext";
import { DashboardSkeleton } from "../../ui/SkeletonScreen";

export function ReferralScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [refData, setRefData] = useState({
    referral_code: "LOADING",
    points: 0,
    balance: 0,
    history: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const response = await fetch(`${API_BASE}/vendors/get_referral_data.php`, {
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Role": role,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (data.status) {
        setRefData(data.data);
      }
    } catch (error) {
      showToast("Failed to load referral data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(APP_DOMAIN + "/register?ref=" + refData.referral_code);
    showToast("Link copied to clipboard!", "success");
  };

  const shareCode = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Dorcas Partner',
        text: `Hey! Use my referral link to join as a Dorcas Partner and start earning!`,
        url: APP_DOMAIN + "/register?ref=" + refData.referral_code,
      });
    } else {
      copyToClipboard();
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#f8fafc] overflow-y-auto pb-24 remove-scrollbar">
      {/* Brand Gradient Header */}
      <div className="brand-gradient pt-12 pb-24 px-6 rounded-b-[3rem] relative shadow-2xl">

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

        <div className="relative z-10 flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/10 shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1">Refer & Earn</h2>
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[2px]">Partner Rewards</p>
          </div>
          <div className="w-11" />
        </div>

        <div className="relative z-10 text-center">
          <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-2xl">
            <Gift size={48} strokeWidth={2.5} className="animate-bounce" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Invite Your Friends</h1>
          <p className="text-white/60 text-sm font-medium px-10">Get <span className="text-white font-black">100 Points (₹10)</span> for every partner that joins using your code!</p>
        </div>
      </div>

      <div className="px-6 -mt-12 space-y-6 relative z-20">
        {/* Code Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-brand/5 border border-gray-900 flex flex-col items-center">
          <p className="text-[10px] font-black text-brand/30 uppercase tracking-[0.2em] mb-4">Your Unique Referral Code</p>
          <div className="w-full flex items-center gap-3 p-2 bg-brand/5 rounded-2xl border border-dashed border-brand/20">
            <div className="flex-1 text-center font-black text-2xl text-brand tracking-[0.1em] py-2">
              {refData.referral_code}
            </div>
            <button
              onClick={copyToClipboard}
              className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand shadow-sm active:scale-90 transition-all"
            >
              <Copy size={20} />
            </button>
          </div>
          <button
            onClick={shareCode}
            className="w-full mt-6 bg-brand text-white py-4.5 rounded-2xl font-black text-[15px] shadow-xl shadow-brand/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            Share Code <Share2 size={18} />
          </button>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-900 shadow-sm">
            <div className="w-10 h-10 bg-brand/5 rounded-xl flex items-center justify-center text-brand mb-4">
              <Users size={20} />
            </div>
            <p className="text-[10px] font-black text-brand/30 uppercase tracking-widest leading-none mb-1">Total Referrals</p>
            <span className="text-2xl font-black text-brand">{refData.history?.length || 0}</span>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-gray-900 shadow-sm">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 mb-4">
              <Zap size={20} />
            </div>
            <p className="text-[10px] font-black text-brand/30 uppercase tracking-widest leading-none mb-1">Total Balance</p>
            <span className="text-2xl font-black text-brand">₹{refData.balance}</span>
          </div>
        </div>

        {/* Recent History */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-brand/30 uppercase tracking-widest px-1">Recent Referrals</h3>
          <div className="space-y-3">
            {refData.history.length > 0 ? refData.history.map((log, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-gray-900 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand/5 rounded-full flex items-center justify-center text-brand font-bold text-xs">
                    {log.referee_name?.[0] || "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand text-sm">{log.referee_name}</h4>
                    <p className="text-[10px] text-brand/40 font-bold uppercase tracking-widest">Successful Join</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">+{log.points_awarded} Pts</p>
                  <p className="text-[10px] text-brand/20 font-bold">{new Date(log.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="bg-brand/5 rounded-3xl p-8 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-brand/20 mb-3 shadow-sm">
                  <Users size={24} />
                </div>
                <p className="text-[12px] font-bold text-brand/40">No referrals yet.<br/>Start sharing to earn rewards!</p>
              </div>
            )}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-900 shadow-sm space-y-8">
          <h3 className="text-sm font-black text-brand uppercase tracking-widest px-1 border-l-4 border-brand">How it works</h3>
          
          {[
            { icon: Share2, title: "Share your code", desc: "Send your unique code to other service providers" },
            { icon: Users, title: "They join Dorcas", desc: "They register as a technician using your code" },
            { icon: CheckCircle2, title: "Get Rewarded", desc: "You get 100 points added to your account instantly!" }
          ].map((item, i) => (
            <div key={i} className="flex gap-5">
              <div className="w-12 h-12 bg-brand/5 rounded-2xl flex items-center justify-center text-brand shrink-0">
                <item.icon size={24} />
              </div>
              <div>
                <h4 className="font-black text-brand text-sm mb-1">{item.title}</h4>
                <p className="text-[12px] text-brand/50 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}

          <div className="pt-4 bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3">
            <Info size={18} className="text-amber-500 shrink-0" />
            <p className="text-[11px] font-medium text-amber-900/70">
              Note: 100 points = ₹10. Points can be redeemed for cash once you reach 1000 points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
