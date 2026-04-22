import { motion } from "framer-motion";
import { IndianRupee, TrendingUp } from "lucide-react";

export function TechEarningsScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-y-auto pt-14 pb-24 px-5"
    >
      <h2 className="text-2xl font-bold text-brand tracking-tight mb-6">Earnings</h2>
      
      <div className="bg-brand rounded-3xl p-6 text-base relative overflow-hidden mb-8 shadow-xl shadow-brand/20">
         <div className="absolute -right-6 -bottom-6 opacity-10"><IndianRupee size={150} /></div>
         <p className="text-base/80 text-[12px] font-semibold tracking-widest uppercase mb-1">Total Payout Pending</p>
         <h1 className="text-4xl font-black mb-6">₹12,450</h1>

         <button className="bg-base text-brand font-bold text-[13px] px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform w-max flex items-center gap-2">
            Withdraw to Bank <TrendingUp size={16} />
         </button>
      </div>

      <h3 className="text-[15px] font-bold text-brand tracking-tight mb-4">Recent Transactions</h3>
      <div className="space-y-3">
         {[
           { id: 1, date: "Today, 02:00 PM", name: "AC Deep Cleaning", amt: "+₹450" },
           { id: 2, date: "Yesterday, 11:30 AM", name: "Washing Machine Repair", amt: "+₹250" },
           { id: 3, date: "15 Apr, 2024", name: "Weekly Payout to Bank", amt: "-₹8,200", isWithdraw: true },
         ].map(tx => (
            <div key={tx.id} className="bg-base border border-brand/10 shadow-[0_2px_8px_rgba(13,110,253,0.03)] rounded-2xl p-4 flex justify-between items-center">
               <div>
                  <h4 className="text-[14px] font-bold text-brand">{tx.name}</h4>
                  <p className="text-[11px] font-semibold text-brand/50 mt-0.5">{tx.date}</p>
               </div>
               <span className={`text-[15px] font-black ${tx.isWithdraw ? "text-brand/50" : "text-green-600"}`}>
                  {tx.amt}
               </span>
            </div>
         ))}
      </div>
    </motion.div>
  );
}
