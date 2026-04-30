import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, MapPin, User, Star, MoreVertical, RefreshCw, MessageSquare } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

import { API_BASE } from "../../../config";

export function OrderHistoryScreen() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabs = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  const fetchBookings = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const response = await fetch(`${API_BASE}/bookings/get_customer_bookings.php`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Role": role
        }
      });

      const data = await response.json();
      if (data.status) {
        // Map database fields to UI fields if they differ
        const mappedBookings = data.data.map(b => ({
          id: b.id,
          service: b.category_name || b.service_name || b.service || "Home Service",
          date: b.service_date || b.date,
          time: b.service_time || b.time,
          status: b.status,
          price: b.amount_paid || b.price || "499",
          provider: b.vendor_name || b.provider || "Assigning...",
          address: b.address || "No address provided",
          city: b.city || "",
          notes: b.notes || ""
        }));
        setBookings(mappedBookings);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchBookings();
  }, [isAuthenticated]);

  const filteredBookings = activeTab === "All"
    ? bookings
    : bookings.filter(b => b.status.toLowerCase() === activeTab.toLowerCase());

  const getStatusStyles = (status) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'confirmed': return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case 'pending': return "bg-amber-100 text-amber-700 border-amber-200";
      case 'completed': return "bg-brand/10 text-brand border-brand/20";
      case 'cancelled': return "bg-rose-50 text-rose-600 border-rose-100";
      case 'no_vendor': return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "N/A") return "Date TBD";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-base">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-brand/40 uppercase tracking-widest">Loading your history...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-[#f8fbff] overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 bg-[#f8fbff]/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-brand/5 hover:bg-brand/5 transition-colors"
          >
            <ChevronLeft size={22} className="text-brand pr-0.5" />
          </button>
          <h2 className="text-xl font-black text-brand tracking-tight">Booking History</h2>
        </div>
        <button
          onClick={() => fetchBookings(true)}
          disabled={isRefreshing}
          className={`w-11 h-11 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-brand/5 text-brand ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Scrollable Tabs */}
      <div className="w-full overflow-x-auto remove-scrollbar px-5 py-2">
        <div className="flex gap-2.5 w-max">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-[13px] font-black transition-all border shadow-sm ${activeTab === tab
                  ? "bg-brand text-white border-brand shadow-brand/20"
                  : "bg-white text-brand/50 border-brand/5 hover:border-brand/20"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-28 space-y-5 remove-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={booking.id}
                className="bg-white border border-brand/5 shadow-[0_8px_30px_rgba(13,110,253,0.04)] rounded-[2.5rem] p-6 flex flex-col gap-4 relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand/5 rounded-2xl flex items-center justify-center text-brand">
                      <Calendar size={22} />
                    </div>
                    <div>
                      <h4 className="text-[16px] font-black text-brand tracking-tight leading-tight">{booking.service}</h4>
                      <p className="text-[10px] font-bold text-brand/40 uppercase tracking-widest mt-0.5">ID: {booking.id}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${getStatusStyles(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-2xl p-3.5 flex items-center gap-3 border border-slate-100">
                    <div className="text-brand/30"><Calendar size={16} /></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-brand/30 uppercase tracking-wider">Date</span>
                      <span className="text-[12px] font-black text-brand">{formatDate(booking.date)}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3.5 flex items-center gap-3 border border-slate-100">
                    <div className="text-brand/30"><Clock size={16} /></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-brand/30 uppercase tracking-wider">Time</span>
                      <span className="text-[12px] font-black text-brand">{booking.time}</span>
                    </div>
                  </div>
                </div>

                {/* Provider & Price */}
                <div className="flex items-center justify-between px-1 py-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center text-brand">
                      <User size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-brand/40 uppercase tracking-wider">Professional</span>
                      <span className="text-[13px] font-bold text-brand">{booking.provider}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold text-brand/40 uppercase tracking-wider block mb-0.5">Amount</span>
                    <span className="text-lg font-black text-brand">{booking.price}</span>
                  </div>
                </div>

                {/* Address Snippet */}
                <div className="flex items-start gap-2 px-1 text-brand/60">
                  <MapPin size={14} className="mt-0.5 shrink-0" />
                  <p className="text-[11px] font-medium leading-relaxed line-clamp-1">{booking.address}, {booking.city}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2.5 mt-2">
                  <button className="flex-1 bg-brand text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-brand/10 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <MoreVertical size={14} />
                    View Details
                  </button>
                  {booking.status.toLowerCase() === 'completed' && (
                    <button className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/10 active:scale-95 transition-all flex items-center justify-center gap-2">
                      <Star size={14} className="fill-white" />
                      Rate Service
                    </button>
                  )}
                  {(booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase() === 'confirmed') && (
                    <button className="bg-rose-50 text-rose-600 px-4 rounded-2xl text-xs font-black border border-rose-100 active:scale-95 transition-all">
                      Cancel
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="w-full py-20 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 bg-brand/5 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-brand/10 rounded-full animate-ping opacity-20"></div>
                <MessageSquare size={40} className="text-brand/20" />
              </div>
              <h3 className="text-xl font-black text-brand mb-2">No {activeTab} Bookings</h3>
              <p className="text-xs font-bold text-brand/40 max-w-[240px] leading-relaxed uppercase tracking-wider">
                When you book a service, your history will magically appear here.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-8 bg-brand text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-brand/20 active:scale-95 transition-transform"
              >
                Book a Service Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

