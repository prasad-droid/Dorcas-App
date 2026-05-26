import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search, MapPin, Bell, ArrowRight, Star, Heart, ArrowUpRight, Wallet,
  Tv, Wind, Scissors, Sparkles, Wrench, Package, Laptop, HeartPulse, FileSignature, PartyPopper, LayoutGrid, Gift
} from "lucide-react";
import { mainCategories as fallbackCategories, categoryDetails as fallbackDetails } from "../../../data/services";
import { useLanguage } from "../../../context/LanguageContext";
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

import { API_BASE, UPLOAD_BASE } from "../../../config";
import { CustomerHomeSkeleton } from "../../ui/SkeletonScreen";

const IMAGE_BASE = `${UPLOAD_BASE}/categories/`;

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

const iconMap = {
  "Appliance": Tv,
  "AC Services": Wind,
  "Salon": Scissors,
  "Cleaning": Sparkles,
  "Home Repair": Wrench,
  "Packing & Movers": Package,
  "IT Service": Laptop,
  "Home Health Care": HeartPulse,
  "Legal & Doc.": FileSignature,
  "Event & Party": PartyPopper,
  "Other Services": LayoutGrid
};

export function HomeScreen() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("AC Services");
  const [locationName, setLocationName] = useState("Mumbai, Maharashtra");
  const [categories, setCategories] = useState([]);
  const [categoryDetails, setCategoryDetails] = useState({});
  const [trendingServices, setTrendingServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto Location
    const requestLocation = async () => {
      try {
        let coordinates;
        if (Capacitor.isNativePlatform()) {
          const perm = await Geolocation.checkPermissions();
          if (perm.location === 'granted') {
            coordinates = await Geolocation.getCurrentPosition({ timeout: 5000 });
          } else if (perm.location === 'prompt') {
            // Only request if we don't have it yet and it's the first time
            const req = await Geolocation.requestPermissions();
            if (req.location === 'granted') {
              coordinates = await Geolocation.getCurrentPosition();
            }
          }
        } else {
          // Web fallback
          coordinates = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
        }

        if (coordinates) {
          const { latitude, longitude } = coordinates.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await res.json();
          setLocationName(data.display_name || "Mumbai, Maharashtra, India");
        }
      } catch (error) {
        // console.error("Location error:", error);
      }
    };

    requestLocation();

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token) {
          const profRes = await fetch(`${API_BASE}/profile/get_profile.php`, {
            headers: { "Authorization": `Bearer ${token}`, "Role": role }
          });
          const profData = await profRes.json();
          if (profData.status) setProfileData(profData.data);
        }

        // Fetch Categories
        const catRes = await fetch(`${API_BASE}/categories/get_categories.php`);
        const catData = await catRes.json();

        // Fetch Services (instead of subcategories to avoid ID mismatch)
        const subRes = await fetch(`${API_BASE}/services/get_services.php`);
        const subData = await subRes.json();

        // Fetch Offers
        try {
          const offerRes = await fetch(`${API_BASE}/categories/get_offers.php`);
          const offerData = await offerRes.json();
          if (offerData.status) {
            setOffers(offerData.data);
          } else {
            setOffers([
              { title: "Scratch & Win", desc: "Get a scratch card on every completed booking - redeem after 3!", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop" },
              { title: "Referral Bonus", desc: "Earn 100 points when anyone joins via your link - you win!", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop" },
              // { title: "Best Value", desc: "Professional Home Services Starting at Just ₹399 - AC & cleaning", image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=800&auto=format&fit=crop" },
            ]);
          }
        } catch (e) {
          // console.warn("Offers fetch failed, using fallback");
          setOffers([
            { title: "Scratch & Win", desc: "Get a scratch card on every completed booking - redeem after 3!", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=800&auto=format&fit=crop" },
            { title: "Referral Bonus", desc: "Earn 100 points when anyone joins via your link - you win!", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop" },
            // { title: "Best Value", desc: "Professional Home Services Starting at Just ₹399 - AC & cleaning", image: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=800&auto=format&fit=crop" },
          ]);
        }

        if (catData.status && subData.status) {
          const apiCats = catData.data.map(cat => ({
            id: cat.id,
            name: cat.category_name,
            icon: iconMap[cat.category_name] || LayoutGrid,
            image: cat.category_img ? (cat.category_img.startsWith('http') ? cat.category_img : `${IMAGE_BASE}${cat.category_img}`) : null
          }));

          setCategories(apiCats);
          if (apiCats.length > 0) setActiveCategory(apiCats[0].name);

          const grouped = {};
          catData.data.forEach(cat => {
            // Find services in this category from the grouped get_services.php response
            const categoryWithServices = subData.data.find(c => parseInt(c.id) === parseInt(cat.id));
            const categoryServices = categoryWithServices ? categoryWithServices.services : [];

            grouped[cat.category_name] = categoryServices.map(srv => ({
              id: srv.id,
              name: srv.service_name,
              price: srv.service_price ? `₹${srv.service_price}` : "₹299",
              desc: stripHtml(srv.service_desc) || "Expert service at your doorstep",
              image: srv.service_img ? (srv.service_img.startsWith('http') ? srv.service_img : `https://dorcasaid.com/${srv.service_img}`) : "services/cleaning.png"
            }));
          });
          setCategoryDetails(grouped);

          // Use all available services for trending instead of subcategories
          const allServices = [];
          subData.data.forEach(c => allServices.push(...c.services));

          const trending = allServices
            .sort(() => 0.5 - Math.random())
            .slice(0, 4)
            .map(srv => ({
              id: srv.id,
              name: srv.service_name,
              rating: (4 + Math.random()).toFixed(1),
              reviews: `${Math.floor(Math.random() * 5000)} reviews`,
              image: srv.service_img ? (srv.service_img.startsWith('http') ? srv.service_img : `https://dorcasaid.com/${srv.service_img}`) : "services/cleaning.png"
            }));
          setTrendingServices(trending);
        } else {
          setCategories(fallbackCategories);
          setCategoryDetails(fallbackDetails);
        }
      } catch (error) {
        // console.error("API Error:", error);
        setCategories(fallbackCategories);
        setCategoryDetails(fallbackDetails);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const allServices = [];
      Object.values(categoryDetails).forEach(services => {
        allServices.push(...services);
      });
      const filtered = allServices.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, categoryDetails]);

  useEffect(() => {
    if (profileData?.id) {
      const role = localStorage.getItem("role");
      const savedImage = localStorage.getItem(`profile_image_${role}_${profileData.id}`);
      if (savedImage) setLocalImage(savedImage);
    }
  }, [profileData]);

  const getInitials = (name) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return <CustomerHomeSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col w-full h-full bg-base"
    >
      {/* App Bar / Header */}
      <div className="brand-gradient px-5 pt-12 pb-5 sm:pt-6 rounded-b-[2rem] shadow-sm text-base">
        <div className="flex justify-between items-start gap-3">
          {/* Left/Center: Avatar + Name & Address */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => navigate("/profile")}
              className="w-12 h-12 rounded-full border-2 border-white/20 p-0.5 overflow-hidden active:scale-95 transition-transform flex items-center justify-center bg-white/10 shadow-sm shrink-0"
            >
              {localImage || profileData?.profile_img ? (
                <img
                  src={localImage || profileData?.profile_img}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-[14px] font-black text-white">{getInitials(profileData?.name)}</span>
              )}
            </button>
            <div className="text-white min-w-0 flex-1">
              <p className="text-white/60 text-[9px] font-black tracking-widest uppercase mb-0.5">Welcome back,</p>
              <h1 className="text-lg font-black text-white leading-tight truncate">{profileData?.name || "Customer"}</h1>

              {/* Address below the name horizontally, wrapped in two lines */}
              <div className="flex items-start gap-1 mt-1 text-white/95">
                <MapPin size={12} className="shrink-0 mt-0.5 text-white" />
                <span
                  className="text-[10px] font-semibold leading-tight text-left"
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {locationName || "Mumbai, MH"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Stacked icon */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <button
              onClick={() => navigate("/notifications")}
              className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center relative backdrop-blur-md border border-white/20 active:scale-95 transition-transform shadow-sm"
            >
              <Bell size={18} className="text-white" />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full shadow-lg"
              ></motion.span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mx-auto mt-5 w-80 ">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none ">
          <Search size={18} className="text-brand/50" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              navigate(`/bookings?q=${encodeURIComponent(searchQuery)}`);
            }
          }}
          className="w-full bg-base text-brand border-2 border-red-400 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-base shadow-sm placeholder:text-brand/40"
          placeholder={t('search_placeholder')}
        />

        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl z-50 overflow-hidden border border-gray-900"
            >
              {suggestions.map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => {
                    setSearchQuery(svc.name);
                    setShowSuggestions(false);
                    navigate(`/book/${svc.id}/0?name=${encodeURIComponent(svc.name)}`);
                  }}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-brand/5 cursor-pointer transition-colors border-b border-brand/5 last:border-0"
                >
                  <Search size={14} className="text-brand/30" />
                  <span className="text-sm font-bold text-brand">{svc.name}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28 space-y-8 remove-scrollbar">

        {/* Wallet Balance Strip */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => navigate("/rewards")}
          className="bg-white rounded-2xl p-4 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer active:scale-[0.98] transition-transform border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center border border-gray-400">
              <Wallet size={20} className="text-brand" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand/80 uppercase tracking-widest">{t('available_balance')}</p>
              <h4 className="text-lg font-black text-brand">{profileData?.stats?.value3 || "₹0"}</h4>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-brand/5 px-3 py-2 rounded-xl border border-gray-200">
            <Gift size={16} className="text-brand" />
            <ArrowRight size={14} className="text-brand/40 ml-1" />
          </div>
        </motion.div>
        

        {/* Animated Video/Image Grid Section */}
        <section className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-emerald-400 p-5">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] bg-base">
            <div className="relative overflow-hidden bg-brand/10">
              <img src="services/cleaning.png" alt="Cleaning" className="w-full h-full object-cover animate-[pulse_4s_ease-in-out_infinite]" />
            </div>
            <div className="relative overflow-hidden bg-brand/10">
              <img src="/services/ac_unit.png" alt="AC" className="w-full h-full object-cover animate-[pulse_5s_ease-in-out_infinite_reverse]" />
            </div>
            <div className="relative overflow-hidden bg-brand/10">
              <img src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop" alt="Painting" className="w-full h-full object-cover animate-[pulse_6s_ease-in-out_infinite]" />
            </div>
            <div className="relative overflow-hidden bg-brand/10">
              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop" alt="Plumbing" className="w-full h-full object-cover animate-[pulse_4.5s_ease-in-out_infinite_reverse]" />
            </div>
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-52 sm:h-52 brand-gradient rounded-full flex items-center justify-center shadow-[0_12px_32px_rgba(21,84,171,0.5)] z-20"
          >
            <div className="absolute inset-1.5 rounded-full border-[3px] border-dashed border-[#ffb800] animate-[spin_10s_linear_infinite] opacity-90"></div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
              className="relative z-10 text-center flex flex-col items-center justify-center"
            >
              <span className="text-base font-black italic text-[22px] sm:text-[24px] leading-[1.1] tracking-tight text-center text-white">
                {t('book_reliable').split(' ').join('\n')}
              </span>
            </motion.div>
          </motion.div>
        </section>

        {/* Combined Popular Services Section */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-bold text-brand tracking-tight">{t('popular_services')}</h3>
          </div>

          <div className="grid grid-cols-4 gap-x-2 gap-y-4">
            {(categories.length > 0 ? categories : fallbackCategories).slice(0, 11).map((service, idx) => {
              const Icon = service.icon || LayoutGrid;
              let borderColor = "border-gray-400";
              if (idx < 4) borderColor = "border-green-400";
              else if (idx < 8) borderColor = "border-yellow-400";
              else borderColor = "border-blue-400";

              return (
                <div
                  key={service.id}
                  onClick={() => navigate(`/category/${service.id}?name=${encodeURIComponent(service.name)}`)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className={`w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-brand/20 transition-colors border-2 ${borderColor}`}>
                    <Icon size={24} strokeWidth={2} className="text-brand" />
                  </div>
                  <span className="text-[10px] font-semibold text-brand text-center leading-tight w-full break-words px-1">
                    {service.name}
                  </span>
                </div>
              );
            })}
            <div
              onClick={() => navigate("/bookings")}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-14 h-14 brand-gradient rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-blue-400">
                <ArrowRight size={24} strokeWidth={2.5} className="text-base" />
              </div>
              <span className="text-[10px] font-semibold text-brand text-center leading-tight w-full break-words px-1">
                {t('see_all')}
              </span>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto remove-scrollbar pb-2 pt-2 snap-x snap-mandatory w-full">
            {(trendingServices.length > 0 ? trendingServices : []).map((svc) => (
              <div
                key={svc.id}
                onClick={() => navigate(`/book/${svc.id}/0?name=${encodeURIComponent(svc.name)}`)}
                className="w-[200px] h-[260px] shrink-0 rounded-[1.5rem] overflow-hidden relative snap-center shadow-[0_4px_12px_rgba(13,110,253,0.15)] bg-brand border border-gray-900 group cursor-pointer"
              >
                <img src={svc.image} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 inset-x-3 flex justify-between items-start z-10 w-auto">
                  <div className="bg-base/90 text-brand px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold shadow-sm backdrop-blur-sm">
                    <Star size={11} className="fill-brand text-brand" />
                    <span>{svc.rating} <span className="opacity-70 font-semibold text-[10px]">({svc.reviews})</span></span>
                  </div>
                  <div className="w-8 h-8 bg-base/90 rounded-full flex items-center justify-center shadow-sm text-brand hover:scale-110 transition-transform backdrop-blur-sm shrink-0 mt-0.5">
                    <Heart size={14} className="fill-brand text-brand font-bold" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none z-0"></div>
                <div className="absolute bottom-3 inset-x-3 flex justify-between items-end z-10">
                  <h4 className="text-white text-[14px] font-bold leading-tight max-w-[70%] pb-1 drop-shadow-md">{svc.name}</h4>
                  <div className="w-8 h-8 bg-base text-brand rounded-[10px] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                    <ArrowUpRight size={18} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Special Offers Carousel */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-lg font-bold text-brand tracking-tight">{t('special_offers')}</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto remove-scrollbar pb-2 snap-x">
            {offers.map((offer, idx) => (
              <div
                key={idx}
                onClick={() => navigate("/deals")}
                className="min-w-[280px] h-[160px] rounded-2xl overflow-hidden relative shadow-md snap-start flex flex-col justify-end p-5 group cursor-pointer border border-gray-900"
              >
                <img src={offer.image} alt={offer.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/20 to-black/80 z-10"></div>
                <div className="relative z-20">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-base/20 backdrop-blur-md px-2 py-1 rounded-md mb-2 inline-block text-white">{offer.title}</span>
                  <p className="text-sm font-bold text-white leading-snug drop-shadow-md">{offer.desc}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate("/deals"); }}
                  className="absolute top-4 right-4 z-20 bg-base text-brand text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-lg transform active:scale-95 transition-transform"
                >
                  {t('claim_now')}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Browse Top Rated Services */}
        <section>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-brand tracking-tight">{t('browse_rated')}</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pb-3">
            {(Object.keys(categoryDetails).length > 0 ? Object.keys(categoryDetails) : Object.keys(fallbackDetails)).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${activeCategory === cat ? "bg-brand text-white border-brand shadow-md" : "bg-base text-brand border-brand/20 hover:border-brand/40"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(categoryDetails[activeCategory] || []).map((svc) => (
              <div key={svc.id} onClick={() => navigate(`/book/${svc.id}/0?name=${encodeURIComponent(svc.name)}&category=${encodeURIComponent(activeCategory)}`)} className="relative w-full h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(13,110,253,0.15)] group cursor-pointer border border-gray-900">
                <img src={svc.image} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 w-full p-4 flex justify-between items-end z-10">
                  <h4 className="text-white font-bold text-base leading-tight max-w-[70%] drop-shadow-md">{svc.name}</h4>
                  <span className="bg-brand text-white px-3 py-1 rounded-full text-xs font-bold shadow-md border border-base/20 border-opacity-50">{svc.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
