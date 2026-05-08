import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Calendar, Clock, MapPin, User, Star, MoreVertical, RefreshCw, MessageSquare, X } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";

import { API_BASE } from "../../../config";

export function OrderHistoryScreen() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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
          service: b.service || b.service_name || b.category_name || "Home Service",
          date: b.date || b.service_date,
          time: b.time || b.service_time,
          status: b.status,
          price: b.amount_paid || b.price || "499",
          provider: b.provider || b.vendor_name || "Assigning...",
          provider_phone: b.provider_phone || b.vendor_phone || b.phone || "",
          address: b.address || b.service_address || b.customer_address || b.location || "No address provided",
          city: b.city || b.service_city || "",
          notes: b.notes || b.instructions || "",
          is_reviewed: !!(parseInt(b.is_reviewed))
        }));
        setBookings(mappedBookings);
      }
    } catch (error) {
      // console.error("Fetch Error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchBookings();
  }, [isAuthenticated]);

  const handleReviewSubmit = async () => {
    if (!selectedBooking) return;
    try {
      
      setIsSubmittingReview(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      const response = await fetch(`${API_BASE}/bookings/add_review.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Role": role
        },
        body: JSON.stringify({
          booking_id: selectedBooking.id,
          rating,
          review: reviewText
        })
      });
      
      const data = await response.json();
      console.log("here",data);
      if (data.status) {
        setShowReviewModal(false);
        setReviewText("");
        setRating(5);
        fetchBookings(); // Refresh list to update status if needed
      }
    } catch (error) {
      // console.error("Review Error:", error);
    } finally {
      setIsSubmittingReview(false);
    }
  };

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
        <p className="text-sm font-bold text-brand/40 uppercase tracking-widest">{t('loading')}</p>
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
          <h2 className="text-xl font-black text-brand tracking-tight">{t('booking_history')}</h2>
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
                      <span className="text-[9px] font-bold text-brand/30 uppercase tracking-wider">{t('date')}</span>
                      <span className="text-[12px] font-black text-brand">{formatDate(booking.date)}</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3.5 flex items-center gap-3 border border-slate-100">
                    <div className="text-brand/30"><Clock size={16} /></div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-brand/30 uppercase tracking-wider">{t('time')}</span>
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
                    <span className="text-[9px] font-bold text-brand/40 uppercase tracking-wider block mb-0.5">{t('total_amount')}</span>
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
                  <button 
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowDetailsModal(true);
                    }}
                    className="flex-1 bg-brand text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-brand/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <MoreVertical size={14} />
                    {t('view_details')}
                  </button>
                  {booking.status.toLowerCase() === 'completed' && !booking.is_reviewed && (
                    <button 
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowReviewModal(true);
                      }}
                      className="flex-1 bg-emerald-600 text-white py-3 rounded-2xl text-xs font-black shadow-lg shadow-emerald-600/10 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Star size={14} className="fill-white" />
                      {t('rate_service')}
                    </button>
                  )}
                  {booking.status.toLowerCase() === 'completed' && booking.is_reviewed && (
                    <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                      <Star size={14} className="fill-emerald-600" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Rated</span>
                    </div>
                  )}
                  {(booking.status.toLowerCase() === 'pending' || booking.status.toLowerCase() === 'confirmed') && (
                    <button className="bg-rose-50 text-rose-600 px-4 rounded-2xl text-xs font-black border border-rose-100 active:scale-95 transition-all">
                      {t('cancel_booking')}
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
              <h3 className="text-xl font-black text-brand mb-2">{t('no_bookings')}</h3>
              <p className="text-xs font-bold text-brand/40 max-w-[240px] leading-relaxed uppercase tracking-wider">
                {t('no_bookings_desc')}
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-8 bg-brand text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-brand/20 active:scale-95 transition-transform"
              >
                {t('book_now')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedBooking && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand/90 backdrop-blur-md flex items-end justify-center"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full rounded-t-[3rem] p-8 pb-10 shadow-2xl relative z-[101]"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-brand/10 rounded-full mx-auto mb-8"></div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-brand">{t('view_details')}</h3>
                <button onClick={() => setShowDetailsModal(false)} className="w-10 h-10 bg-brand/5 rounded-full flex items-center justify-center text-brand">
                   <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-brand/5 p-6 rounded-[2rem] border border-brand/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                      <Calendar size={28} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-brand leading-tight">{selectedBooking.service}</h4>
                      <p className="text-xs font-bold text-brand/40 uppercase tracking-widest mt-1">ID: {selectedBooking.id}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand/5">
                    <div>
                      <p className="text-[10px] font-bold text-brand/30 uppercase tracking-widest mb-1">{t('status')}</p>
                      <span className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg border ${getStatusStyles(selectedBooking.status)}`}>
                        {selectedBooking.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-brand/30 uppercase tracking-widest mb-1">{t('total_amount')}</p>
                      <span className="text-lg font-black text-brand">₹{selectedBooking.price}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-brand/40 shrink-0"><MapPin size={20} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-brand/30 uppercase tracking-widest mb-1">{t('service_location')}</p>
                      <p className="text-sm font-bold text-brand leading-relaxed">{selectedBooking.address}, {selectedBooking.city}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-brand/40 shrink-0"><User size={20} /></div>
                    <div>
                      <p className="text-[10px] font-bold text-brand/30 uppercase tracking-widest mb-1">Professional Assigned</p>
                      <p className="text-sm font-bold text-brand">{selectedBooking.provider}</p>
                      {selectedBooking.provider_phone && (
                        <p className="text-xs font-medium text-brand/40 mt-0.5">{selectedBooking.provider_phone}</p>
                      )}
                    </div>
                  </div>
                  {selectedBooking.notes && (
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-brand/40 shrink-0"><MessageSquare size={20} /></div>
                      <div>
                        <p className="text-[10px] font-bold text-brand/30 uppercase tracking-widest mb-1">Instructions</p>
                        <p className="text-sm font-medium text-brand/60 leading-relaxed italic">"{selectedBooking.notes}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedBooking && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand/90 backdrop-blur-md flex items-end justify-center"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full rounded-t-[3rem] p-8 pb-20 shadow-2xl relative z-[101] max-h-[95vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-brand/10 rounded-full mx-auto mb-8"></div>
              <h3 className="text-xl font-black text-brand mb-2">{t('rate_service')}</h3>
              <p className="text-sm text-brand/40 font-bold mb-8">Share your experience with {selectedBooking.provider}</p>

              <div className="flex justify-center gap-3 mb-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star 
                      size={42} 
                      className={`${star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-100"} transition-colors`} 
                    />
                  </button>
                ))}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write a quick feedback (optional)..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-brand outline-none transition-all mb-8 min-h-[120px] placeholder:text-slate-300"
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-4 rounded-2xl text-sm font-black text-brand/40 hover:bg-slate-50 transition-colors"
                >
                  {t('cancel')}
                </button>
                <button 
                  onClick={handleReviewSubmit}
                  disabled={isSubmittingReview}
                  className="flex-[2] bg-brand text-white py-4 rounded-2xl text-sm font-black shadow-xl shadow-brand/20 active:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  {isSubmittingReview ? t('loading') : "Submit Review"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

