import { motion } from "framer-motion";
import { ChevronLeft, Wallet, CheckCircle, Users, Copy, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function DashboardScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-y-auto pb-24"
    >
      {/* Header */}
      <div className="bg-brand pt-14 pb-24 px-5 rounded-b-[2.5rem] shadow-sm relative overflow-hidden text-base flex flex-col">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-base/20 rounded-full flex items-center justify-center hover:bg-base/30 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold tracking-tight">My Dashboard</h2>
          <div className="w-10 h-10"></div>
        </div>
      </div>

      {/* Floating Main Stats */}
      <div className="relative z-20 px-5 -mt-12 mb-6">
        <div className="bg-base shadow-[0_8px_24px_rgba(13,110,253,0.12)] border border-brand/5 rounded-3xl p-5 flex gap-4">
          <div className="flex-1 bg-brand/5 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-brand/10">
            <span className="text-[11px] font-bold text-brand/60 uppercase tracking-widest mb-1">Bookings</span>
            <span className="text-3xl font-black text-brand">12</span>
          </div>
          <div className="flex-[1.5] bg-gradient-to-br from-brand to-brand/80 rounded-2xl p-4 flex flex-col justify-center text-base shadow-inner overflow-hidden relative">
            <div className="absolute top-2 right-2 opacity-20"><Wallet size={48} /></div>
            <div className="relative z-10">
              <span className="text-[11px] font-semibold text-base/80 uppercase tracking-widest mb-1 block">Your Wallet</span>
              <span className="text-3xl font-black">₹320</span>
              <button className="mt-2 bg-base text-brand text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm hover:scale-105 transition-transform w-max">
                Redeem Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Reward Meter Cycle */}
        <div className="bg-base rounded-3xl shadow-[0_4px_16px_rgba(13,110,253,0.06)] border border-brand/10 p-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-bl-full pointer-events-none"></div>
          
          <h3 className="text-[15px] font-bold text-brand tracking-tight mb-1">Service Reward Cycle</h3>
          <p className="text-[12px] font-medium text-brand/60 mb-6 leading-snug pr-4">Complete 3 more services to instantly unlock a verified coupon or cash reward.</p>

          <div className="relative flex justify-between items-center mb-2 px-1">
            {/* Background Line */}
            <div className="absolute left-[10%] right-[10%] h-1 bg-brand/10 rounded-full top-1/2 -translate-y-1/2 z-0"></div>
            {/* Active Line */}
            <div className="absolute left-[10%] w-[25%] h-1 bg-brand rounded-full top-1/2 -translate-y-1/2 z-0"></div>

            {[1, 2, 3, 4, 5].map((step) => {
              const isCompleted = step <= 2;
              const isCurrent = step === 3;
              
              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] transition-all shadow-sm ${
                    isCompleted ? "bg-brand text-base scale-110 shadow-brand/30" :
                    isCurrent ? "bg-base border-2 border-brand text-brand scale-125 shadow-md shadow-brand/20" :
                    "bg-base border-2 border-brand/20 text-brand/40"
                  }`}>
                    {isCompleted ? <CheckCircle size={14} className="text-base" /> : step}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Referral System */}
        <div className="bg-[#ffb800]/10 rounded-3xl shadow-[0_4px_16px_rgba(255,184,0,0.1)] border border-[#ffb800]/30 p-6 relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 opacity-10">
            <Users size={120} />
          </div>

          <div className="flex items-center gap-2 mb-2 relative z-10">
            <span className="bg-[#ffb800] text-brand text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-md">Refer & Earn</span>
          </div>
          <h3 className="text-lg font-extrabold text-brand tracking-tight mb-1 relative z-10">Invite Friends. Earn Real Money.</h3>
          
          <div className="mt-4 mb-5 bg-base/60 backdrop-blur-sm border border-[#ffb800]/30 rounded-2xl p-4 relative z-10 text-center flex divide-x divide-brand/10">
             <div className="flex-1 px-2">
                <span className="block text-[11px] font-bold text-brand/60 uppercase mb-1">1 Sign Up</span>
                <span className="block text-xl font-black text-brand">100<span className="text-[12px] opacity-70 ml-0.5">pts</span></span>
             </div>
             <div className="flex-1 px-2">
                <span className="block text-[11px] font-bold text-brand/60 uppercase mb-1">100 Pts =</span>
                <span className="block text-xl font-black text-[#ffb800]">₹10</span>
             </div>
          </div>

          <p className="text-[12px] font-semibold text-brand/70 mb-4 relative z-10 leading-snug">
            Points are instantly redeemable via your secure Wallet.
          </p>

          <div className="flex gap-2 relative z-10">
            <div className="flex-1 bg-base border border-brand/20 rounded-xl px-4 py-3 flex items-center shadow-inner overflow-hidden">
              <span className="text-[13px] font-mono text-brand/80 truncate font-semibold">https://dorcas.app/ref/D9X2Q</span>
            </div>
            <button className="bg-brand text-base w-12 rounded-xl flex items-center justify-center hover:bg-brand/90 transition-colors shadow-md shrink-0">
              <Copy size={18} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
