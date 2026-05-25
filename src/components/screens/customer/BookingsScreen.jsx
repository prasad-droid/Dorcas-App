import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, SlidersHorizontal, Star, Eye, CalendarCheck, X, LayoutGrid } from "lucide-react";
import { API_BASE, UPLOAD_BASE } from "../../../config";
import { useLanguage } from "../../../context/LanguageContext";

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

export function BookingsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("Popularity");
  const [showFilters, setShowFilters] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/categories/get_categories_with_services.php`);
        const data = await res.json();

        if (data.status) {
          const apiCategories = ["All", ...data.data.map(cat => cat.category_name)];
          setCategories(apiCategories);

          const services = [];
          data.data.forEach(cat => {
            cat.services.forEach(s => {
              services.push({
                id: s.id,
                name: s.service_name,
                price: `₹${parseFloat(s.amount).toFixed(0)}`,
                desc: stripHtml(s.description) || "Professional service at your doorstep",
                image: "https://www.dorcasaid.com/" + s.image,
                categoryName: cat.category_name
              });
            });
          });
          setAllServices(services);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q");
    if (q) setSearchQuery(q);
  }, [location.search]);

  const filteredServices = allServices.filter((svc) => {
    const price = parseInt(svc.price.replace(/[^0-9]/g, "")) || 0;
    const matchesCategory = activeCategory === "All" || svc.categoryName === activeCategory;
    const matchesSearch = svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === "Price: Low to High") {
      return parseInt(a.price.replace(/[^0-9]/g, "")) - parseInt(b.price.replace(/[^0-9]/g, ""));
    }
    if (sortBy === "Price: High to Low") {
      return parseInt(b.price.replace(/[^0-9]/g, "")) - parseInt(a.price.replace(/[^0-9]/g, ""));
    }
    return 0; // Default popularity (no sort)
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
        <h2 className="text-2xl font-bold text-brand tracking-tight">{t('explore_services')}</h2>
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
                className="w-full bg-base border border-gray-00 text-brand rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand shadow-[0_2px_12px_rgba(13,110,253,0.04)] placeholder:text-brand/40"
                placeholder={t('search_placeholder')}
              />
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className={`w-12 h-12 bg-base shadow-[0_2px_12px_rgba(13,110,253,0.04)] border rounded-2xl flex items-center justify-center text-brand shrink-0 transition-colors relative ${sortBy !== 'Popularity' || priceRange[1] < 5000 ? 'border-brand bg-brand/5' : 'border-brand/10'}`}
            >
              <SlidersHorizontal size={20} className="text-brand" />
              {(sortBy !== 'Popularity' || priceRange[1] < 5000) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-brand rounded-full border-2 border-base"></span>
              )}
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto remove-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-[13px] font-bold transition-all shadow-[0_2px_8px_rgba(13,110,253,0.06)] ${activeCategory === cat
                  ? 'bg-brand text-base border border-brand'
                  : 'bg-base text-brand border border-brand/5 hover:bg-brand/5'
                  }`}
              >
                {cat === 'All' ? t('all') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Service Cards */}
        <div className="px-5 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin"></div>
              <p className="text-brand/50 font-bold text-sm">{t('finding_services')}</p>
            </div>
          ) : filteredServices.length > 0 ? (
            filteredServices.map((svc) => (
              <div key={svc.id} className="bg-base border border-gray-300 rounded-3xl p-4 shadow-[0_6px_24px_rgba(13,110,253,0.08)] relative overflow-hidden">

                {/* Details */}
                <div className="flex gap-3 items-start">
                  <img src={svc.image} alt={svc.name} className="w-[72px] h-[72px] rounded-2xl object-cover shrink-0 border border-brand/5 bg-brand/5" />
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[14px] font-bold text-brand leading-tight truncate pr-2">{svc.name}</h3>
                      <span className="bg-brand/10 text-brand px-2 py-1 rounded-lg text-[9px] uppercase tracking-wider font-bold shrink-0 line-clamp-1 max-w-[80px] text-center">{svc.categoryName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mb-2">
                      <Star size={14} className="fill-brand text-brand" />
                      <span className="text-[12px] font-bold text-brand/80">4.8 <span className="font-medium opacity-60">(1.2k)</span></span>
                    </div>

                    <div className="text-[13px] font-bold text-brand">{svc.price} <span className="opacity-60 text-[11px] font-semibold">onwards</span></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => navigate(`/book/${svc.id}/0?name=${encodeURIComponent(svc.name)}`)} className="flex items-center justify-center gap-2 brand-gradient text-white py-[12px] rounded-2xl text-[13px] font-bold shadow-md shadow-brand/20 hover:opacity-90 transition-opacity">
                    <CalendarCheck size={16} />
                    {t('book_now')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="pt-10 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-brand/30" />
              </div>
              <h3 className="text-[16px] font-bold text-brand mb-1">{t('no_bookings')}</h3>
              <p className="text-[13px] font-semibold text-brand/60">Try searching for a different keyword.</p>
            </div>
          )}
        </div>
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-brand/40 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full rounded-t-[3rem] p-8 pb-10 shadow-2xl space-y-8 relative z-[201]"
              onClick={e => e.stopPropagation()}
            >

              <div className="w-12 h-1.5 bg-brand/10 rounded-full mx-auto mb-8"></div>
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-brand">{t('filter_sort')}</h3>
                <button onClick={() => setShowFilters(false)} className="w-10 h-10 bg-brand/5 rounded-full flex items-center justify-center text-brand">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-brand/40 uppercase tracking-widest">Sort By</h4>
                <div className="flex flex-wrap gap-2">
                  {["Popularity", "Price: Low to High", "Price: High to Low"].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSortBy(opt)}
                      className={`px-5 py-3 rounded-2xl text-[13px] font-bold transition-all ${sortBy === opt ? 'bg-brand text-white shadow-lg' : 'bg-brand/5 text-brand'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <h4 className="text-xs font-black text-brand/40 uppercase tracking-widest">Price Range</h4>
                  <span className="text-xs font-bold text-brand">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-brand/10 rounded-lg appearance-none cursor-pointer accent-brand"
                />
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="w-full bg-brand text-white py-4 rounded-[1.5rem] font-black text-sm shadow-xl shadow-brand/20 active:scale-[0.98] transition-transform"
              >
                {t('apply_filters')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
