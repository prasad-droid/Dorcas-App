import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Star, MessageSquare, Filter } from "lucide-react";
import { API_BASE } from "../../../config";
import { ListTabSkeleton } from "../../ui/SkeletonScreen";

export function TechReviewsScreen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsData, setReviewsData] = useState({ reviews: [], stats: { avg_rating: "0.0", total_reviews: 0 } });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Role": role,
          "Content-Type": "application/json"
        };

        const response = await fetch(`${API_BASE}/vendors/get_vendor_reviews.php`, { headers });
        const json = await response.json();
        if (json.status) {
          setReviewsData(json.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-hidden"
    >
      {/* Header */}
      <div className="brand-gradient pt-12 pb-6 px-6 rounded-b-[2.5rem] shadow-lg relative shrink-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 active:scale-95 transition-transform"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <h1 className="text-xl font-black text-white tracking-tight">Customer Reviews</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24">
        {/* Rating Summary Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-brand/5 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-black text-brand/30 uppercase tracking-widest">Average Rating</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-brand tracking-tighter">{reviewsData.stats.avg_rating}</span>
              <div className="flex flex-col">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(parseFloat(reviewsData.stats.avg_rating)) ? "currentColor" : "none"} />
                  ))}
                </div>
                <p className="text-[11px] font-bold text-brand/50">{reviewsData.stats.total_reviews} Total Reviews</p>
              </div>
            </div>
          </div>
          <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center">
            <MessageSquare size={28} className="text-brand opacity-40" />
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-brand uppercase tracking-tight">Recent Feedback</h3>
            <button className="flex items-center gap-1.5 text-[11px] font-black text-brand/40 uppercase tracking-widest">
              <Filter size={12} />
              Filter
            </button>
          </div>

          {isLoading ? (
            <ListTabSkeleton />
          ) : reviewsData.reviews.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-brand/5 space-y-4">
              <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mx-auto">
                <Star size={32} className="text-brand/20" />
              </div>
              <p className="text-brand/40 font-bold text-sm">No reviews yet. Complete jobs to receive feedback!</p>
            </div>
          ) : (
            reviewsData.reviews.map((review, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-5 shadow-sm border border-brand/5 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand/5 rounded-xl flex items-center justify-center font-black text-brand text-sm">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-brand leading-none">{review.name}</h4>
                      <p className="text-[10px] font-bold text-brand/40 mt-1 uppercase tracking-wider">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    <Star size={10} fill="#f59e0b" className="text-amber-500" />
                    <span className="text-[11px] font-black text-amber-700">{review.rating}</span>
                  </div>
                </div>
                {review.comment && (
                  <p className="text-[13px] font-medium text-brand/70 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
