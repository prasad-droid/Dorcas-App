import { motion } from "framer-motion";
import { Briefcase, IndianRupee, MapPin, PhoneCall, CheckCircle } from "lucide-react";

export function TechHomeScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-y-auto pb-24"
    >
      <div className="bg-brand pt-14 pb-14 px-5 rounded-b-[2.5rem] shadow-sm relative overflow-hidden text-base">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10">
          <p className="text-base/80 text-[13px] font-semibold tracking-widest uppercase mb-1">Technician Portal</p>
          <h2 className="text-2xl font-bold tracking-tight">Today's Overview</h2>
        </div>
      </div>

      <div className="relative z-20 px-5 -mt-8 mb-6">
        <div className="bg-base shadow-[0_8px_24px_rgba(13,110,253,0.12)] border border-brand/5 rounded-3xl p-5 flex gap-4">
           <div className="flex-[1.5] bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 flex flex-col justify-center text-base shadow-inner overflow-hidden relative">
            <div className="absolute top-2 right-2 opacity-20"><IndianRupee size={48} /></div>
            <div className="relative z-10">
              <span className="text-[11px] font-semibold text-base/80 uppercase tracking-widest mb-1 block">Active Earnings</span>
              <span className="text-3xl font-black">₹4,500</span>
              <span className="text-[10px] bg-black/20 px-2 py-0.5 rounded-full mt-1 inline-block">This Week</span>
            </div>
          </div>
          <div className="flex-1 bg-brand/5 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-brand/10">
            <span className="text-[11px] font-bold text-brand/60 uppercase tracking-widest mb-1">Active</span>
            <span className="text-3xl font-black text-brand">2</span>
            <span className="text-[10px] text-brand/50 mt-1">Jobs Left</span>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-6">
        <div>
          <h3 className="text-[15px] font-bold text-brand tracking-tight mb-3">Next Appointment</h3>
          <div className="bg-base border border-brand/10 shadow-[0_4px_16px_rgba(13,110,253,0.04)] rounded-3xl p-5">
             <div className="flex justify-between items-start mb-4">
                <div>
                   <h4 className="text-[16px] font-bold text-brand tracking-tight">AC Deep Cleaning</h4>
                   <p className="text-[12px] font-bold text-brand/50 mt-0.5">Booking ID: <span className="font-mono">B-8472</span></p>
                </div>
                <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-1 rounded-md font-bold border border-orange-200">IN 45 MINS</span>
             </div>

             <div className="bg-brand/5 rounded-2xl p-4 mb-4 space-y-3">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-base shadow-sm flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-brand/60" />
                   </div>
                   <p className="text-[12px] font-semibold text-brand/80 leading-snug">
                     102, Blue Ridge Apartments, Phase 1, Hinjewadi
                   </p>
                </div>
             </div>

             <div className="flex gap-2">
                <button className="flex-1 bg-brand text-base py-3.5 rounded-xl font-bold text-[13px] shadow-md shadow-brand/20 transition-transform active:scale-95 flex items-center justify-center gap-2">
                   <CheckCircle size={16} /> Start Job
                </button>
                <button className="w-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shadow-sm transition-transform active:scale-95 border border-green-200">
                   <PhoneCall size={18} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
