import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Search, MapPin, Bell, ArrowRight, Star, Heart, ArrowUpRight, Wallet,
  Tv, Wind, Scissors, Sparkles, Wrench, Package, Laptop, HeartPulse, FileSignature, PartyPopper, LayoutGrid, Gift
} from "lucide-react";
import { mainCategories as fallbackCategories, categoryDetails as fallbackDetails } from "../../../data/services";
import { useLanguage } from "../../../context/LanguageContext";

import { API_BASE, UPLOAD_BASE } from "../../../config";

const IMAGE_BASE = `${UPLOAD_BASE}/categories/`;

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
  const navigate = useNavigate();

  useEffect(() => {
    // Auto Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || data.address.suburb || "Mumbai";
          const area = data.address.suburb || data.address.neighbourhood || "";
          setLocationName(area ? `${area}, ${city}` : city);
        } catch (error) {
          // console.error("Location error:", error);
        }
      });
    }

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
              desc: srv.service_desc || "Expert service at your doorstep",
              image: srv.service_img ? (srv.service_img.startsWith('http') ? srv.service_img : `${UPLOAD_BASE}/services/${srv.service_img}`) : "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop"
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
              image: srv.service_img ? (srv.service_img.startsWith('http') ? srv.service_img : `${UPLOAD_BASE}/services/${srv.service_img}`) : "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop"
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
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-base">
        <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-brand/40 uppercase tracking-widest">{t('loading')}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col w-full h-full bg-base"
    >
      {/* App Bar / Header */}
      <div className="bg-brand px-5 pt-12 pb-5 sm:pt-6 rounded-b-[2rem] shadow-sm text-base">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <div className="bg-base/20 p-2 rounded-full">
              <MapPin size={18} className="text-base" />
            </div>
            <div>
              <p className="text-[10px] text-base/80 uppercase font-semibold tracking-wider">{t('current_location')}</p>
              <h2 className="text-sm font-semibold flex items-center gap-1">
                {locationName}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/rewards")}
              className="bg-base/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-base/10"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs font-bold">{profileData?.stats?.value2 || 0}</span>
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full border-2 border-base/20 p-0.5 overflow-hidden active:scale-95 transition-transform flex items-center justify-center bg-base/10 shadow-sm"
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
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
            className="w-full bg-base text-brand rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-base shadow-sm placeholder:text-brand/40"
            placeholder={t('search_placeholder')}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28 space-y-8 remove-scrollbar">

        {/* Wallet Balance Strip */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => navigate("/rewards")}
          className="bg-white border border-brand/5 rounded-2xl p-4 flex justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-brand" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-brand/40 uppercase tracking-widest">{t('available_balance')}</p>
              <h4 className="text-lg font-black text-brand">{profileData?.stats?.value3 || "₹0"}</h4>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-brand/5 px-3 py-2 rounded-xl">
            <Gift size={16} className="text-brand" />
            <span className="text-xs font-black text-brand">{profileData?.stats?.value2 || 0} pts</span>
            <ArrowRight size={14} className="text-brand/40 ml-1" />
          </div>
        </motion.div>

        {/* Animated Video/Image Grid Section */}
        <section className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-base">
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] bg-base">
            <div className="relative overflow-hidden bg-brand/10">
              <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop" alt="Cleaning" className="w-full h-full object-cover animate-[pulse_4s_ease-in-out_infinite]" />
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
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-52 sm:h-52 bg-brand rounded-full flex items-center justify-center shadow-[0_12px_32px_rgba(13,110,253,0.5)] z-20"
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
            {(categories.length > 0 ? categories : fallbackCategories).slice(0, 11).map((service) => {
              const Icon = service.icon || LayoutGrid;
              return (
                <div
                  key={service.id}
                  onClick={() => navigate(`/category/${service.id}?name=${encodeURIComponent(service.name)}`)}
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-brand/20 transition-colors">
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
              <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center shadow-md group-hover:bg-brand/90 transition-colors">
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
                onClick={() => navigate(`/service/${svc.id}?name=${encodeURIComponent(svc.name)}`)}
                className="w-[200px] h-[260px] shrink-0 rounded-[1.5rem] overflow-hidden relative snap-center shadow-[0_4px_12px_rgba(13,110,253,0.15)] bg-brand border border-brand/10 group cursor-pointer"
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
                <div className="absolute bottom-0 inset-x-0 h-[40%] bg-gradient-to-t from-brand/80 via-brand/40 to-transparent pointer-events-none z-0"></div>
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
                className="min-w-[280px] h-[160px] rounded-2xl overflow-hidden relative shadow-md snap-start flex flex-col justify-end p-5 group cursor-pointer border border-brand/10"
              >
                <img src={offer.image} alt={offer.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-brand/40 to-brand/95 z-10"></div>
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
              <div key={svc.id} onClick={() => navigate(`/service/${svc.id}?name=${encodeURIComponent(svc.name)}`)} className="relative w-full h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(13,110,253,0.15)] group cursor-pointer border border-brand/10">
                <img src={svc.image} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/80 via-brand/10 to-transparent pointer-events-none"></div>
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
