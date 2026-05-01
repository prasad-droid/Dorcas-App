import { useState } from "react";
import { motion } from "framer-motion";
import { 
  IndianRupee, TrendingUp, Calendar, ArrowUpRight, 
  ArrowDownLeft, Filter, ChevronRight, AlertCircle,
  Download, Briefcase
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

export function TechEarningsScreen() {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("Weekly");

  const stats = [
    { label: "Today", value: "₹1,250", icon: Calendar },
    { label: "This Week", value: "₹8,450", icon: TrendingUp },
    { label: "This Month", value: "₹32,000", icon: Briefcase },
  ];

  const transactions = [
    { id: "TX-9821", service: "AC Repair", date: "Today, 10:30 AM", amount: "₹450", status: "completed", type: "credit" },
    { id: "TX-9820", service: "Deep Cleaning", date: "Yesterday, 04:15 PM", amount: "₹1,200", status: "completed", type: "credit" },
    { id: "TX-9819", service: "Plumbing", date: "28 Apr, 11:00 AM", amount: "₹350", status: "settled", type: "credit" },
    { id: "TX-9818", service: "Electrical", date: "27 Apr, 02:30 PM", amount: "₹600", status: "settled", type: "credit" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-y-auto pb-24 remove-scrollbar"
    >
      <div className="px-6 pt-12 bg-base sticky top-0 z-30">
        <h2 className="text-3xl font-black tracking-tight text-brand">Your Earnings</h2>
        <p className="text-brand/40 text-[10px] font-bold uppercase tracking-widest mt-1">Financial Overview</p>
      </div>

      <div className="px-5 mt-6 space-y-6">
        
        {/* Main Payout Card (Compact) */}
        <div className="relative bg-brand rounded-2xl p-6 shadow-md overflow-hidden">
           {/* Background Decoration */}
           <div className="absolute top-1/2 -right-6 -translate-y-1/2 opacity-10 select-none pointer-events-none">
              <IndianRupee size={160} strokeWidth={1} className="text-white" />
           </div>
           
           <div className="relative z-10">
              <p className="text-white/60 text-[10px] font-bold uppercase tracking-[2px] mb-1">Total Payout Pending</p>
              <div className="flex items-baseline gap-1.5 text-white mb-6">
                 <span className="text-xl font-black">₹</span>
                 <span className="text-4xl font-black tracking-tighter">12,450</span>
              </div>
              
              <button className="bg-white text-brand px-5 py-3 rounded-2xl flex items-center gap-3 active:scale-95 transition-all shadow-sm group">
                 <span className="text-xs font-bold uppercase tracking-wider">Withdraw to Bank</span>
                 <ArrowUpRight size={14} strokeWidth={3} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
           {stats.map((stat, i) => (
             <div key={i} className="bg-white rounded-2xl p-4 border border-brand/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] text-center">
                <p className="text-[10px] font-bold text-brand/30 uppercase tracking-widest mb-1.5">{stat.label}</p>
                <p className="text-[14px] font-black text-brand">{stat.value}</p>
             </div>
           ))}
        </div>

        {/* Transaction History */}
        <div className="space-y-4">
           <div className="flex justify-between items-center px-1">
              <h3 className="text-[11px] font-bold text-brand/30 uppercase tracking-[2px]">Recent Transactions</h3>
              <button className="text-[10px] font-bold text-brand uppercase tracking-widest flex items-center gap-1">
                 View All <ChevronRight size={12} />
              </button>
           </div>

           <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="bg-white p-4 rounded-2xl border border-brand/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center justify-between active:scale-[0.98] transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-11 h-11 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                         <Briefcase size={20} />
                      </div>
                      <div>
                         <h4 className="text-[14px] font-bold text-brand">{tx.service}</h4>
                         <p className="text-[10px] text-brand/30 font-bold uppercase tracking-wider">{tx.date}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[15px] font-black text-brand">{tx.amount}</p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                         <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'settled' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                         <p className={`text-[9px] font-bold uppercase tracking-widest ${tx.status === 'settled' ? 'text-emerald-600' : 'text-blue-500'}`}>
                           {tx.status}
                         </p>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Incentive Booster */}
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 relative overflow-hidden group shadow-sm">
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
        </div>
      </div>
    </motion.div>
  );
}
