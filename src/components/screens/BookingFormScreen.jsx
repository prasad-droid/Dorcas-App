import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Bell, MapPin, Star, MessageSquare, Phone, User, Calendar, Clock, Map, AlignLeft
} from "lucide-react";
import { useAuth } from "../../App";

export function BookingFormScreen() {
  const { serviceId, providerId } = useParams();
  const navigate = useNavigate();
  const { setMyBookings, isAuthenticated, setShowAuthPopup } = useAuth();
  
  const serviceName = serviceId ? decodeURIComponent(serviceId) : "Home Cleaning";
  // Hardcoded for demo/matching the reference
  const providerName = "Mr James";
  const providerPrice = "$140.00";

  const includeTags = ["Kitchen", "Bathroom", "Living Room", "Bedroom"];

  const inputClass = "w-full bg-base border border-brand/10 text-brand rounded-2xl py-4 px-5 text-[14px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand shadow-[0_2px_12px_rgba(13,110,253,0.03)] placeholder:text-brand/40 mb-4 transition-all";

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }

    const newBooking = {
      id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
      service: serviceName,
      date: "Upcoming",
      time: "Scheduled",
      status: "Confirmed",
      price: providerPrice,
      provider: providerName
    };

    setMyBookings(prev => [newBooking, ...prev]);
    navigate('/order-history', { replace: true });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-hidden relative"
    >
      {/* Top Graphic Section (Absolute behind header) */}
      <div className="absolute top-0 w-full h-[320px] bg-brand/5 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=600&auto=format&fit=crop" 
          alt="Service Provider"
          className="w-full h-full object-cover opacity-90 object-top"
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)'
          }}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Floating Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 z-20 sticky top-0">
        <button 
          onClick={() => navigate(-1)} 
          className="w-11 h-11 bg-base rounded-[16px] shadow-sm flex items-center justify-center border border-brand/5 transition-colors hover:bg-brand/5"
        >
          <ChevronLeft size={22} className="text-brand pr-0.5" />
        </button>
        <button className="w-11 h-11 bg-base rounded-[16px] shadow-sm flex items-center justify-center border border-brand/5 transition-colors hover:bg-brand/5">
          <Bell size={20} className="text-brand" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full remove-scrollbar pb-32 z-10 pt-36">
        
        {/* Core Detail Block */}
        <div className="px-6 relative">
          <h1 className="text-2xl font-bold text-brand leading-tight mb-2">
            {serviceName}
          </h1>
          <div className="flex items-center gap-4 mb-6 text-brand/80 font-semibold text-[13px]">
            <div className="flex items-center gap-1.5">
              <MapPin size={16} />
              <span>New York</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star size={16} className="fill-brand text-brand" />
              <span className="text-brand">5.0 Rating</span>
            </div>
          </div>

          <h3 className="text-base font-bold text-brand mb-3">Services Include</h3>
          <div className="flex gap-2.5 overflow-x-auto remove-scrollbar pb-2 mb-4">
            {includeTags.map(tag => (
              <span key={tag} className="bg-brand/5 text-brand px-5 py-2.5 rounded-2xl text-[13px] font-bold whitespace-nowrap border border-brand/10">
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-base font-bold text-brand mb-2">About Service</h3>
          <p className="text-[13px] text-brand/70 font-semibold leading-relaxed mb-6 pe-2">
            Our {serviceName} is designed to provide a seamless, reliable, and stress-free experience for every household. We offer professional... <span className="text-brand font-bold cursor-pointer">Read More</span>
          </p>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <img 
                src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop" 
                alt="provider" 
                className="w-[52px] h-[52px] rounded-2xl object-cover border border-brand/10"
              />
              <div>
                <h4 className="text-[15px] font-bold text-brand leading-tight mb-0.5">{providerName}</h4>
                <p className="text-[12px] text-brand/60 font-semibold">Service Provider</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-11 h-11 bg-brand/5 rounded-[16px] flex items-center justify-center border border-brand/10 hover:bg-brand/10 transition-colors">
                <MessageSquare size={18} className="text-brand" />
              </button>
              <button className="w-11 h-11 bg-brand/5 rounded-[16px] flex items-center justify-center border border-brand/10 hover:bg-brand/10 transition-colors">
                <Phone size={18} className="text-brand" />
              </button>
            </div>
          </div>

          {/* Form Section */}
          <h3 className="text-lg font-bold text-brand mb-4 border-t border-brand/10 pt-6">Booking Details</h3>
          
          <form className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-brand/50" />
              </div>
              <input type="text" placeholder="Full Name" className="w-full bg-base border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[14px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand shadow-[0_2px_12px_rgba(13,110,253,0.03)] placeholder:text-brand/40 transition-all" />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone size={18} className="text-brand/50" />
              </div>
              <input type="tel" placeholder="Phone Number" className="w-full bg-base border border-brand/10 text-brand rounded-2xl py-4 pl-12 pr-4 text-[14px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand shadow-[0_2px_12px_rgba(13,110,253,0.03)] placeholder:text-brand/40 transition-all" />
            </div>

            <div className="relative">
              <div className="absolute top-4 left-0 pl-4 flex items-center pointer-events-none">
                <Map size={18} className="text-brand/50" />
              </div>
              <textarea placeholder="Complete Address" rows={2} className="w-full bg-base border border-brand/10 text-brand rounded-2xl pt-4 pb-2 pl-12 pr-4 text-[14px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand shadow-[0_2px_12px_rgba(13,110,253,0.03)] placeholder:text-brand/40 resize-none transition-all" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-brand/50" />
                </div>
                <input type="date" className="w-full bg-base border border-brand/10 text-brand/80 rounded-2xl py-4 pl-12 pr-3 text-[13px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand shadow-[0_2px_12px_rgba(13,110,253,0.03)] transition-all" />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Clock size={18} className="text-brand/50" />
                </div>
                <input type="time" className="w-full bg-base border border-brand/10 text-brand/80 rounded-2xl py-4 pl-12 pr-3 text-[13px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand shadow-[0_2px_12px_rgba(13,110,253,0.03)] transition-all" />
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-4 left-0 pl-4 flex items-center pointer-events-none">
                <AlignLeft size={18} className="text-brand/50" />
              </div>
              <textarea 
                placeholder="Special Instructions (optional)" 
                rows={3}
                className="w-full bg-base border border-brand/10 text-brand rounded-2xl pt-4 pb-2 pl-12 pr-4 text-[14px] font-semibold focus:outline-none focus:ring-1 focus:ring-brand shadow-[0_2px_12px_rgba(13,110,253,0.03)] placeholder:text-brand/40 resize-none transition-all"
              />
            </div>
          </form>

        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="absolute bottom-0 w-full bg-base border-t border-brand/10 px-6 py-5 pb-8 sm:pb-6 z-50">
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[15px] font-bold text-brand">Total Service</span>
          <span className="text-[16px] font-bold text-brand">{providerPrice}</span>
        </div>
        <button 
          onClick={handleConfirm}
          className="w-full bg-brand text-base py-4 rounded-[1.25rem] text-[16px] font-bold shadow-lg shadow-brand/20 hover:opacity-90 transition-opacity flex items-center justify-center"
        >
          Confirm Booking
        </button>
      </div>

    </motion.div>
  );
}
