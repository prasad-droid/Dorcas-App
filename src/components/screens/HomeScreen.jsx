import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Search, MapPin, Bell, ArrowRight, Star, Heart, ArrowUpRight,
  MousePointerClick, CalendarCheck, UserCheck, ShieldCheck
} from "lucide-react";
import { mainCategories, categoryDetails } from "../../data/services";

export function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("AC Services");
  const navigate = useNavigate();

  const offers = [
    { title: "Scratch & Win", desc: "Get a scratch card on every completed booking - redeem after 3!" },
    { title: "Referral Bonus", desc: "Earn 100 points when anyone joins via your link - you win!" },
    { title: "Best Value", desc: "Professional Home Services Starting at Just ₹399 - AC &  cleaning" },
  ];

  const trendingServices = [
    { id: 401, name: "Home Deep Cleaning", rating: "4.9", reviews: "3.2k reviews", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop" },
    { id: 201, name: "AC Check-up & Clean", rating: "4.8", reviews: "1.1k reviews", image: "https://images.unsplash.com/photo-1620888200632-475aeb7bc671?q=80&w=400&auto=format&fit=crop" },
    { id: 301, name: "Men's Haircut", rating: "4.7", reviews: "854 reviews", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop" },
    { id: 501, name: "Electrician Visit", rating: "4.8", reviews: "2.1k reviews", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=400&auto=format&fit=crop" }
  ];

  const categories = Object.keys(categoryDetails);

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
              <p className="text-[10px] text-base/80 uppercase font-semibold tracking-wider">Current Location</p>
              <h2 className="text-sm font-semibold flex items-center gap-1">
                Mumbai, Maharashtra
              </h2>
            </div>
          </div>
          <button className="bg-base/20 p-2 rounded-full relative">
            <Bell size={20} className="text-base" />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-brand rounded-full border border-base"></span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-brand/50" />
          </div>
          <input
            type="text"
            className="w-full bg-base text-brand rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-base shadow-sm placeholder:text-brand/40"
            placeholder="Search for services..."
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28 space-y-8">
        
        {/* Animated Video/Image Grid Section */}
        <section className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-base">
          {/* 2x2 Grid Background */}
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] bg-base">
            {/* Top Left: Plumber/Mechanic */}
            <div className="relative overflow-hidden bg-brand/10">
              <img 
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop" 
                alt="Plumbing service"
                className="w-full h-full object-cover animate-[pulse_4s_ease-in-out_infinite]"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Top Right: Appliance/AC */}
            <div className="relative overflow-hidden bg-brand/10">
              <img 
                src="https://images.unsplash.com/photo-1620888200632-475aeb7bc671?q=80&w=400&auto=format&fit=crop" 
                alt="AC Cleaning"
                className="w-full h-full object-cover animate-[pulse_5s_ease-in-out_infinite_reverse]"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Bottom Left: Painting */}
            <div className="relative overflow-hidden bg-brand/10">
              <img 
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&auto=format&fit=crop" 
                alt="Painting service"
                className="w-full h-full object-cover animate-[pulse_6s_ease-in-out_infinite]"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Bottom Right: Bathroom Fitting */}
            <div className="relative overflow-hidden bg-brand/10">
              <img 
                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop" 
                alt="Bathroom fitting"
                className="w-full h-full object-cover animate-[pulse_4.5s_ease-in-out_infinite_reverse]"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Floating Center Circle Button */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-52 sm:h-52 bg-brand rounded-full flex items-center justify-center shadow-[0_12px_32px_rgba(13,110,253,0.5)] z-20"
          >
            {/* Spinning Dashed Yellow Border */}
            <div className="absolute inset-1.5 rounded-full border-[3px] border-dashed border-[#ffb800] animate-[spin_10s_linear_infinite] opacity-90"></div>
            
            {/* Pulsing Text Effect inside Circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
              className="relative z-10 text-center flex flex-col items-center justify-center"
            >
              <span className="text-base font-black italic text-[24px] sm:text-[26px] leading-[1.15] tracking-wide drop-shadow-md text-center">
                Book<br/>Reliable<br/>Home<br/>Services
              </span>
            </motion.div>
          </motion.div>
        </section>

        {/* Combined Popular Services Section: Grid + Slider */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-bold text-brand tracking-tight">Most Popular Services</h3>
          </div>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-4 gap-x-2 gap-y-4">
            {mainCategories.map((service) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.id} 
                  onClick={() => navigate(`/category/${encodeURIComponent(service.name)}`)}
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
            
            {/* 12th explicit See All Grid Button */}
            <div 
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center shadow-md group-hover:bg-brand/90 transition-colors">
                <ArrowRight size={24} strokeWidth={2.5} className="text-base" />
              </div>
              <span className="text-[10px] font-semibold text-brand text-center leading-tight w-full break-words px-1">
                See All
              </span>
            </div>
          </div>

          {/* Cards Slider */}
          <div className="flex gap-4 overflow-x-auto remove-scrollbar pb-2 pt-2 snap-x snap-mandatory w-full">
            {trendingServices.map((svc) => (
              <div 
                key={svc.id} 
                onClick={() => navigate(`/service/${encodeURIComponent(svc.name)}`)}
                className="w-[200px] h-[260px] shrink-0 rounded-[1.5rem] overflow-hidden relative snap-center shadow-[0_4px_12px_rgba(13,110,253,0.15)] bg-brand border border-brand/10 group cursor-pointer"
              >
                <img 
                  src={svc.image} 
                  alt={svc.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Top overlays */}
                <div className="absolute top-3 inset-x-3 flex justify-between items-start z-10 w-auto">
                  <div className="bg-base/90 text-brand px-2 py-1 rounded-full flex items-center gap-1 text-[11px] font-bold shadow-sm backdrop-blur-sm">
                    <Star size={11} className="fill-brand text-brand" />
                    <span>{svc.rating} <span className="opacity-70 font-semibold text-[10px]">({svc.reviews})</span></span>
                  </div>
                  <div className="w-8 h-8 bg-base/90 rounded-full flex items-center justify-center shadow-sm text-brand hover:scale-110 transition-transform backdrop-blur-sm shrink-0 mt-0.5">
                    <Heart size={14} className="fill-brand text-brand font-bold" />
                  </div>
                </div>

                {/* Bottom overlay gradient using pure brand color */}
                <div className="absolute bottom-0 inset-x-0 h-[50%] bg-gradient-to-t from-brand/95 via-brand/70 to-transparent pointer-events-none z-0"></div>
                <div className="absolute bottom-3 inset-x-3 flex justify-between items-end z-10">
                  <h4 className="text-base text-[14px] font-bold leading-tight max-w-[70%] pb-1 drop-shadow-md">
                    {svc.name}
                  </h4>
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
            <h3 className="text-lg font-bold text-brand tracking-tight">Special Offers & Deals</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto remove-scrollbar pb-2 snap-x">
            {offers.map((offer, idx) => (
              <div 
                key={idx} 
                className={`min-w-[260px] bg-brand rounded-2xl p-5 text-base shadow-md snap-start flex flex-col justify-between`}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-base/20 px-2 py-1 rounded-md mb-2 inline-block text-base">
                    {offer.title}
                  </span>
                  <p className="text-sm font-medium mt-1 leading-snug">{offer.desc}</p>
                </div>
                <button className="mt-4 text-xs font-semibold bg-base text-brand px-4 py-2 rounded-xl w-max self-start shadow-sm">
                  Claim Now
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Browse Top Rated Home Services */}
        <section>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-brand tracking-tight">Browse Top Rated Home Services</h3>
          </div>
          
          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 pb-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  activeCategory === cat 
                    ? "bg-brand text-base border-brand shadow-md" 
                    : "bg-base text-brand border-brand/20 hover:border-brand/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Service Cards for Active Category */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(categoryDetails[activeCategory] || []).map((svc) => (
              <div 
                key={svc.id} 
                onClick={() => navigate(`/service/${encodeURIComponent(svc.name)}`)}
                className="relative w-full h-[180px] rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(13,110,253,0.15)] group cursor-pointer border border-brand/10"
              >
                <img 
                  src={svc.image} 
                  alt={svc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/95 via-brand/10 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 w-full p-4 flex justify-between items-end z-10">
                  <h4 className="text-base font-bold text-base leading-tight max-w-[70%] drop-shadow-md">{svc.name}</h4>
                  <span className="bg-brand text-base px-3 py-1 rounded-full text-xs font-bold shadow-md border border-base/20 border-opacity-50">
                     {svc.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </motion.div>
  );
}
