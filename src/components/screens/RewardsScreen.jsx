import { motion } from "framer-motion";
import { Gift, Copy, Share2, Sparkles } from "lucide-react";

export function RewardsScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base pt-12 sm:pt-6 px-5"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-brand tracking-tight">Rewards</h2>
        <div className="flex items-center gap-1.5 bg-brand/10 px-3 py-1.5 rounded-full">
          <Sparkles size={14} className="text-brand" />
          <span className="text-xs font-bold text-brand">120 Points</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-20 space-y-6">
        {/* Scratch Cards Section */}
        <section>
          <h3 className="text-sm font-bold text-brand tracking-tight mb-3">Your Scratch Cards</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[4/5] bg-brand rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
              <Gift size={32} className="text-base/80 mb-2" />
              <span className="text-base font-bold text-sm text-center">Tap to Scratch!</span>
              <span className="text-base/80 text-[10px] mt-1 font-medium bg-black/20 px-2 py-0.5 rounded-full z-10">Unlocked</span>
            </div>
            
            <div className="aspect-[4/5] bg-brand/5 border-2 border-dashed border-brand/20 rounded-2xl p-4 flex flex-col items-center justify-center relative opacity-80">
              <span className="text-brand/60 font-bold text-sm text-center">Locked</span>
              <span className="text-brand/40 text-xs mt-1 font-medium text-center">Complete 2 more bookings</span>
            </div>
          </div>
        </section>

        {/* Refer & Earn */}
        <section className="bg-brand/5 p-5 rounded-2xl shadow-sm border border-brand/10">
          <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center mb-4">
            <Share2 size={24} className="text-brand" />
          </div>
          <h3 className="text-lg font-bold text-brand tracking-tight mb-2">Refer & Earn Points</h3>
          <p className="text-sm text-brand/60 font-medium mb-6 leading-relaxed">
            Invite your friends to Dorcas and earn 100 points when they complete their first booking.
          </p>

          <div className="space-y-3">
            <label className="text-xs font-bold text-brand/80 uppercase tracking-wider">Your Referral Link</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-brand/5 border border-brand/20 rounded-xl px-4 py-3 text-sm font-medium text-brand/60 truncate">
                https://dorcas.app/invite/ref6X9Q
              </div>
              <button className="bg-brand text-base p-3 rounded-xl transition-colors shadow-sm">
                <Copy size={20} />
              </button>
            </div>
            <button className="w-full bg-brand text-base font-bold py-3.5 rounded-xl shadow-md mt-2 flex items-center justify-center gap-2 hover:brightness-110">
              Share via WhatsApp
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
