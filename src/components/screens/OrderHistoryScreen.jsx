import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function OrderHistoryScreen() {
  const { myBookings } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  const filteredBookings = activeTab === "All" 
    ? myBookings 
    : myBookings.filter(b => b.status === activeTab);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return "bg-green-100 text-green-700 border-green-200";
      case 'Pending': return "bg-orange-100 text-orange-700 border-orange-200";
      case 'Completed': return "bg-brand/10 text-brand border-brand/20";
      case 'Cancelled': return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-hidden"
    >
      <div className="px-5 pt-12 pb-4 flex items-center gap-3 sticky top-0 bg-base z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="w-11 h-11 bg-base rounded-[16px] shadow-sm flex items-center justify-center border border-brand/5 hover:bg-brand/5 transition-colors"
        >
          <ChevronLeft size={22} className="text-brand pr-0.5" />
        </button>
        <h2 className="text-xl font-bold text-brand tracking-tight">Order History</h2>
      </div>

      {/* Scrollable Tabs */}
      <div className="w-full overflow-x-auto remove-scrollbar px-5 pb-2">
        <div className="flex gap-2 w-max">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all border shadow-sm ${
                activeTab === tab 
                  ? "bg-brand text-base border-brand" 
                  : "bg-base text-brand/70 border-brand/10 hover:border-brand/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={booking.id}
                className="bg-base border border-brand/10 shadow-[0_4px_16px_rgba(13,110,253,0.04)] rounded-2xl p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[15px] font-bold text-brand tracking-tight">{booking.service}</h4>
                    <p className="text-[11px] font-semibold text-brand/50 mt-0.5">Booking ID: <span className="font-mono">{booking.id}</span></p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="bg-brand/5 rounded-xl p-3 flex justify-between items-center text-[12px] font-semibold text-brand/80">
                  <div className="flex flex-col gap-1">
                    <span>📅 {booking.date}</span>
                    <span>⏰ {booking.time}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right">
                    <span className="font-bold text-brand text-[15px] block">{booking.price}</span>
                    <span className="text-[11px] opacity-70 flex items-center gap-1">
                      👤 {booking.provider}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="w-full pt-12 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 bg-brand/5 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-brand/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-brand mb-1">No {activeTab.toLowerCase()} bookings</h3>
              <p className="text-xs font-semibold text-brand/60 max-w-[220px]">You don't have any bookings matching this filter status yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
