import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Star, Eye, CalendarCheck } from "lucide-react";
import { categoryDetails } from "../../data/services";

export function BookingsScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Object.keys(categoryDetails)];

  const allServices = Object.entries(categoryDetails).flatMap(([cat, svcs]) =>
    svcs.map(svc => ({ ...svc, categoryName: cat }))
  );

  const filteredServices = allServices.filter((svc) => {
    const matchesCategory = activeCategory === "All" || svc.categoryName === activeCategory;
    const matchesSearch = svc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          svc.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-4 bg-base sticky top-0 z-20">
        <h2 className="text-2xl font-bold text-brand tracking-tight">Explore Services</h2>
      </div>

      <div className="flex-1 overflow-y-auto w-full remove-scrollbar pb-28 pt-2">
        
        {/* Search */}
        <div className="px-5 space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-brand/80" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-base border border-brand/10 text-brand rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand shadow-[0_2px_12px_rgba(13,110,253,0.04)] placeholder:text-brand/40"
                placeholder="Search for any service..."
              />
            </div>
            <button className="w-12 h-12 bg-base shadow-[0_2px_12px_rgba(13,110,253,0.04)] border border-brand/10 rounded-2xl flex items-center justify-center text-brand shrink-0 hover:bg-brand/5 relative">
              <SlidersHorizontal size={20} className="text-brand" />
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto remove-scrollbar pb-1">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-[13px] font-bold transition-all shadow-[0_2px_8px_rgba(13,110,253,0.06)] ${
                  activeCategory === cat 
                    ? 'bg-brand text-base border border-brand' 
                    : 'bg-base text-brand border border-brand/5 hover:bg-brand/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards */}
        <div className="px-5 flex flex-col gap-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((svc) => (
              <div key={svc.id} className="bg-base border border-brand/5 rounded-3xl p-4 shadow-[0_6px_24px_rgba(13,110,253,0.08)] relative overflow-hidden">
                
                {/* Details */}
                <div className="flex gap-3 items-start">
                  <img 
                    src={svc.image} 
                    alt={svc.name} 
                    referrerPolicy="no-referrer"
                    className="w-[72px] h-[72px] rounded-2xl object-cover shrink-0 border border-brand/5 bg-brand/5"
                  />
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[14px] font-bold text-brand leading-tight truncate pr-2">
                        {svc.name}
                      </h3>
                      <span className="bg-brand/10 text-brand px-2 py-1 rounded-lg text-[9px] uppercase tracking-wider font-bold shrink-0 line-clamp-1 max-w-[80px] text-center">
                         {svc.categoryName}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mb-2">
                      <Star size={14} className="fill-brand text-brand" />
                      <span className="text-[12px] font-bold text-brand/80">
                        4.8 <span className="font-medium opacity-60">(1.2k)</span>
                      </span>
                    </div>

                    <div className="text-[13px] font-bold text-brand">
                      {svc.price} <span className="opacity-60 text-[11px] font-semibold">onwards</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button 
                    onClick={() => navigate(`/book/${encodeURIComponent(svc.name)}/1`)}
                    className="flex items-center justify-center gap-2 bg-base border border-brand/15 text-brand py-[12px] rounded-2xl text-[13px] font-bold hover:bg-brand/5 transition-colors shadow-sm"
                  >
                    <Eye size={16} />
                    Details
                  </button>
                  <button 
                    onClick={() => navigate(`/book/${encodeURIComponent(svc.name)}/1`)}
                    className="flex items-center justify-center gap-2 bg-brand text-base py-[12px] rounded-2xl text-[13px] font-bold shadow-md shadow-brand/20 hover:opacity-90 transition-opacity"
                  >
                    <CalendarCheck size={16} />
                    Book Now
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="pt-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-brand/30" />
              </div>
              <h3 className="text-[16px] font-bold text-brand mb-1">No services found</h3>
              <p className="text-[13px] font-semibold text-brand/60">Try searching for a different keyword.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
