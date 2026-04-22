import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { 
  ChevronLeft, MoreVertical, Search, SlidersHorizontal, 
  Star, Eye, CalendarCheck, X, Check
} from "lucide-react";

export function ServiceProvidersScreen() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const serviceName = serviceId ? decodeURIComponent(serviceId) : "Service";

  const [sortBy, setSortBy] = useState("recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Mock providers offering this specific service matching the UI reference
  // Upgraded price and reviews to integers to support sorting
  const baseProviders = [
    { id: 1, worker: "Ramesh Services", rating: 4.8, reviews: 250, price: 80, image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop" },
    { id: 2, worker: "Elite Care Team", rating: 4.8, reviews: 356, price: 50, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200&auto=format&fit=crop" },
    { id: 3, worker: "Singh Professionals", rating: 4.4, reviews: 180, price: 90, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=200&auto=format&fit=crop" },
    { id: 4, worker: "Quick Fix Pros", rating: 4.9, reviews: 450, price: 100, image: "https://images.unsplash.com/photo-1533621430040-cde4a706be22?q=80&w=200&auto=format&fit=crop" }
  ];

  // Sorting logic
  let providers = [...baseProviders];
  if (sortBy === "price_low") {
    providers.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_high") {
    providers.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    providers.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "reviews") {
    providers.sort((a, b) => b.reviews - a.reviews);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 bg-base sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="w-[42px] h-[42px] bg-base rounded-[14px] shadow-[0_2px_10px_rgba(13,110,253,0.08)] flex items-center justify-center border border-brand/5 transition-colors hover:bg-brand/5"
        >
          <ChevronLeft size={20} className="text-brand pr-0.5" />
        </button>
        <h2 className="text-base font-bold text-brand tracking-tight flex-1 text-center truncate px-2">
          Search Service
        </h2>
        <button className="w-[42px] h-[42px] bg-base rounded-[14px] shadow-[0_2px_10px_rgba(13,110,253,0.08)] flex items-center justify-center border border-brand/5 transition-colors hover:bg-brand/5">
          <MoreVertical size={18} className="text-brand" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full remove-scrollbar pb-28 pt-2">
        
        {/* Search and Filters */}
        <div className="px-5 space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-brand/80" />
              </div>
              <input
                type="text"
                className="w-full bg-base border border-brand/10 text-brand rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand shadow-[0_2px_12px_rgba(13,110,253,0.04)] placeholder:text-brand/40"
                placeholder={`Search in ${serviceName}...`}
              />
            </div>
            <button 
              onClick={() => setIsSortOpen(true)}
              className="w-12 h-12 bg-base shadow-[0_2px_12px_rgba(13,110,253,0.04)] border border-brand/10 rounded-2xl flex items-center justify-center text-brand shrink-0 hover:bg-brand/5 relative"
            >
              <SlidersHorizontal size={20} className="text-brand" />
              {sortBy !== "recommended" && (
                <span className="absolute top-2.5 right-2 w-2.5 h-2.5 bg-brand rounded-full border-2 border-base"></span>
              )}
            </button>
          </div>
        </div>

        {/* Service Provider Cards */}
        <div className="px-5 flex flex-col gap-4">
          {providers.map((p) => (
            <div key={p.id} className="bg-base border border-brand/5 rounded-3xl p-4 shadow-[0_6px_24px_rgba(13,110,253,0.08)] relative overflow-hidden">
              
              {/* Top: Details */}
              <div className="flex gap-3 items-start">
                <img 
                  src={p.image} 
                  alt="provider" 
                  referrerPolicy="no-referrer"
                  className="w-[72px] h-[72px] rounded-2xl object-cover shrink-0 border border-brand/5 bg-brand/5"
                />
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[14px] font-bold text-brand leading-tight truncate pr-2">
                      {serviceName}
                    </h3>
                    <span className="bg-brand/10 text-brand px-3 py-1 rounded-xl text-[10px] font-bold shrink-0">
                       {/* Hardcoding "Cleaning" string similar to reference to show tag concept, but this would be dynamic */}
                       {p.worker.split(" ")[0]}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star size={14} className="fill-brand text-brand" />
                    <span className="text-[12px] font-bold text-brand/80">
                      {p.rating} <span className="font-medium opacity-60">({p.reviews} reviews)</span>
                    </span>
                  </div>

                  <div className="text-[13px] font-bold text-brand">
                    ${p.price}/hour
                  </div>
                </div>
              </div>

              {/* Bottom: Actions */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <button className="flex items-center justify-center gap-2 bg-base border border-brand/15 text-brand py-[14px] rounded-2xl text-[13px] font-bold hover:bg-brand/5 transition-colors shadow-sm">
                  <Eye size={16} />
                  View Details
                </button>
                <button 
                  onClick={() => navigate(`/book/${encodeURIComponent(serviceName)}/${p.id}`)}
                  className="flex items-center justify-center gap-2 bg-brand text-base py-[14px] rounded-2xl text-[13px] font-bold shadow-md shadow-brand/20 hover:opacity-90 transition-opacity"
                >
                  <CalendarCheck size={16} />
                  Book Now
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Slide-out Sort Bottom Sheet */}
      <AnimatePresence>
        {isSortOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-brand/40 backdrop-blur-sm flex flex-col justify-end"
            onClick={() => setIsSortOpen(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-base w-full rounded-t-[2rem] p-6 pb-12 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-brand/10 rounded-full mx-auto mb-6"></div>
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[18px] font-bold text-brand">Sort & Filter</h3>
                <button 
                  onClick={() => setIsSortOpen(false)}
                  className="w-8 h-8 flex items-center justify-center bg-brand/5 rounded-full text-brand/70 hover:text-brand transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { value: "recommended", label: "Recommended First" },
                  { value: "price_low", label: "Price - Low to High" },
                  { value: "price_high", label: "Price - High to Low" },
                  { value: "rating", label: "Highest Rated" },
                  { value: "reviews", label: "Most Reviewed" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      sortBy === option.value 
                        ? "border-brand bg-brand/5 shadow-sm" 
                        : "border-brand/10 bg-base hover:bg-brand/5"
                    }`}
                  >
                    <span className={`text-[14px] font-bold ${sortBy === option.value ? 'text-brand' : 'text-brand/80'}`}>
                      {option.label}
                    </span>
                    {sortBy === option.value && <Check size={18} className="text-brand" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
