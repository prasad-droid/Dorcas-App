import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { 
  ChevronLeft, Bell, MapPin, Star, MessageSquare, Phone, User, Calendar, Clock, Map, AlignLeft, Info, Check, Shield, Wallet, Gift, Trophy
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function BookingFormScreen() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { setMyBookings, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState("form"); // "form" or "success"
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    pincode: "",
    date: "",
    time: "",
    instructions: "",
    paymentType: "Pay After Service"
  });

  const serviceName = serviceId ? decodeURIComponent(serviceId) : "Home Cleaning";
  const providerName = "Mr. James Wilson";
  const providerPrice = "₹1,499";

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const newBooking = {
      id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
      service: serviceName,
      date: formData.date || "Tomorrow",
      time: formData.time || "10:00 AM",
      status: "Confirmed",
      price: providerPrice,
      provider: providerName,
      address: `${formData.address}, ${formData.city} - ${formData.pincode}`
    };

    setMyBookings(prev => [newBooking, ...prev]);
    setStep("success");
  };

  if (step === "success") {
    return (
      <BookingSuccessView 
        details={{ ...formData, service: serviceName, price: providerPrice }} 
        onClose={() => navigate("/")} 
      />
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col w-full h-full bg-[#f8fbff] overflow-y-auto remove-scrollbar relative"
    >
      {/* Background Graphic */}
      <div className="absolute top-0 w-full h-64 bg-brand/5 -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4 z-30 sticky top-0 bg-[#f8fbff]/80 backdrop-blur-md">
        <button 
          onClick={() => navigate(-1)} 
          className="w-11 h-11 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-brand/5 text-brand"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-lg font-black text-brand">Booking Details</h1>
        <div className="w-11" />
      </div>

      <div className="px-6 pb-30">
        {/* Service Summary Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand/5 mb-8 mt-4">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center text-brand">
                <Shield size={28} />
             </div>
             <div>
                <h2 className="text-xl font-black text-brand leading-tight">{serviceName}</h2>
                <p className="text-xs font-bold text-brand/40 uppercase tracking-widest mt-1">Premium Home Service</p>
             </div>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleConfirm} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-brand/40 uppercase tracking-[2px] px-1">Personal & Contact Info</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <FormInput icon={User} placeholder="Full Name" value={formData.fullName} onChange={(val) => setFormData({...formData, fullName: val})} />
              <FormInput icon={Phone} placeholder="Mobile Number" type="tel" value={formData.phoneNumber} onChange={(val) => setFormData({...formData, phoneNumber: val})} />
            </div>

            <h3 className="text-[11px] font-black text-brand/40 uppercase tracking-[2px] px-1 mt-6">Service Location</h3>
            <div className="grid grid-cols-1 gap-4">
               <div className="relative group">
                 <div className="absolute left-5 top-6 text-brand/20 group-focus-within:text-brand transition-colors">
                   <Map size={18} />
                 </div>
                 <textarea 
                  placeholder="Full Address" 
                  rows={3} 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  className="w-full bg-white border border-brand/5 text-brand rounded-2xl pt-5.5 pb-4 pl-14 pr-6 text-[15px] font-bold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/20 transition-all placeholder:text-brand/20 shadow-sm resize-none" 
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <FormInput icon={MapPin} placeholder="City" value={formData.city} onChange={(val) => setFormData({...formData, city: val})} />
                  <FormInput icon={MapPin} placeholder="Pincode" maxLength={6} value={formData.pincode} onChange={(val) => setFormData({...formData, pincode: val})} />
               </div>
            </div>

            <h3 className="text-[11px] font-black text-brand/40 uppercase tracking-[2px] px-1 mt-6">Schedule Preference</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormInput icon={Calendar} placeholder="Service Date" type="date" value={formData.date} onChange={(val) => setFormData({...formData, date: val})} />
              <FormInput icon={Clock} placeholder="Preferred Time" type="time" value={formData.time} onChange={(val) => setFormData({...formData, time: val})} />
            </div>

            <h3 className="text-[11px] font-black text-brand/40 uppercase tracking-[2px] px-1 mt-6">Additional Info</h3>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand/20 group-focus-within:text-brand transition-colors">
                <AlignLeft size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Special Instructions" 
                value={formData.instructions}
                onChange={(e) => setFormData({...formData, instructions: e.target.value})}
                className="w-full bg-white border border-brand/5 text-brand rounded-2xl py-4.5 pl-14 pr-6 text-[15px] font-bold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/20 transition-all placeholder:text-brand/20 shadow-sm" 
              />
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-brand/[0.03] border border-brand/5 rounded-3xl p-6 mt-8">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand font-black">
                   <Wallet size={20} />
                </div>
                <h4 className="text-sm font-black text-brand">Payment Mode</h4>
             </div>
             
             <div className="bg-white border-2 border-brand rounded-2xl p-4 flex items-center justify-between mb-4">
                <span className="font-bold text-brand">Pay After Service</span>
                <div className="w-5 h-5 bg-brand rounded-full flex items-center justify-center">
                   <Check size={12} className="text-white" strokeWidth={4} />
                </div>
             </div>

             <div className="flex gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                   <Info size={20} className="text-emerald-700" />
                </div>
                <p className="text-[11px] font-bold text-emerald-800 leading-relaxed">
                  No payment needed now. Our professional will collect payment (cash or your preferred mode) after completing the service.
                </p>
             </div>
          </div>

          {/* Scratch Card Promo */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl mt-8">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
             <div className="relative z-10 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                   <Gift size={28} className="animate-bounce" />
                </div>
                <div>
                   <h5 className="font-black text-lg leading-tight">You'll get a Scratch Card!</h5>
                   <p className="text-[11px] font-bold text-white/70">Win up to <span className="text-white font-black">₹499 reward points</span> added to your wallet after booking.</p>
                </div>
             </div>
          </div>

          {/* Service Amount and Confirm Booking at the end */}
          <div className="mt-8 pt-8 border-t border-brand/5 space-y-6">
            <div className="flex items-center justify-between px-1">
              <div>
                <span className="text-[11px] font-black text-brand/30 uppercase tracking-[2px] block mb-1">Service Amount</span>
                <span className="text-2xl font-black text-brand tracking-tighter">{providerPrice}</span>
              </div>
              <button type="button" className="flex items-center gap-1.5 text-[11px] font-black text-brand bg-brand/5 px-3 py-1.5 rounded-xl border border-brand/10">
                 <Star size={12} className="fill-brand" /> 5.0 Rating
              </button>
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-brand text-white py-5 rounded-[2rem] text-[17px] font-black shadow-[0_15px_35px_rgba(13,110,253,0.3)] hover:opacity-90 transition-all flex items-center justify-center gap-3"
            >
              Confirm Booking
              <Shield size={20} />
            </motion.button>
          </div>


        </form>
      </div>
    </motion.div>
  );
}

function FormInput({ icon: Icon, placeholder, type = "text", value, onChange, maxLength }) {
  return (
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-brand/20 group-focus-within:text-brand transition-colors">
        <Icon size={18} />
      </div>
      <input 
        type={type} 
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        required
        className="w-full bg-white border border-brand/5 text-brand rounded-2xl py-4.5 pl-14 pr-6 text-[15px] font-bold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/20 transition-all placeholder:text-brand/20 shadow-sm" 
      />
    </div>
  );
}

function BookingSuccessView({ details, onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col w-full h-full bg-[#f0f4f8] overflow-y-auto remove-scrollbar relative p-6 pt-16"
    >
      <div className="text-center mb-8">
         <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/20">
            <Check size={40} className="text-white" strokeWidth={4} />
         </div>
         <h2 className="text-3xl font-black text-brand tracking-tighter">Booking Confirmed!</h2>
         <p className="text-brand/50 font-bold mt-1 uppercase text-[10px] tracking-widest">Job ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-brand/5 mb-8">
         <h3 className="text-sm font-black text-brand/30 uppercase tracking-widest mb-6">Booking Details</h3>
         <div className="space-y-4">
            <DetailRow label="Service" value={details.service} />
            <DetailRow label="Date" value={details.date || "Tomorrow"} />
            <DetailRow label="Time" value={details.time || "10:00 AM"} />
            <DetailRow label="Address" value={`${details.address}, ${details.city}`} />
            <DetailRow label="Payment" value={details.paymentType} />
            <div className="pt-4 border-t border-brand/5 flex items-center justify-between">
               <span className="font-black text-brand text-lg">Total Amount</span>
               <span className="font-black text-brand text-xl">{details.price}</span>
            </div>
         </div>
      </div>

      {/* Interactive Scratch Card */}
      <h3 className="text-center text-[11px] font-black text-brand/40 uppercase tracking-[2px] mb-4">Scratch to reveal your reward</h3>
      <ScratchCardCanvas cashback={Math.floor(Math.random() * 450) + 49} />

      <div className="mt-auto pt-10 pb-6">
        <motion.button 
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full bg-brand text-white py-5 rounded-[2rem] text-[17px] font-black shadow-lg hover:shadow-brand/20 transition-all flex items-center justify-center gap-2"
        >
          Go to My Dashboard
        </motion.button>
      </div>
    </motion.div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4">
       <span className="text-[12px] font-bold text-brand/40 uppercase tracking-wider shrink-0 mt-0.5">{label}</span>
       <span className="text-[14px] font-black text-brand text-right leading-tight">{value || "Not Specified"}</span>
    </div>
  );
}

function ScratchCardCanvas({ cashback }) {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Fill with pattern/silver
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, width, height);
    
    // Add some noise/pattern to looks like scratch
    ctx.fillStyle = '#A0A0A0';
    for (let i = 0; i < 200; i++) {
       ctx.beginPath();
       ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
       ctx.fill();
    }
    
    // Text on scratch area
    ctx.font = "bold 16px Inter";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH HERE", width/2, height/2 + 6);

    const scratch = (x, y) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      checkReveal();
    };

    const checkReveal = () => {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      let count = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] === 0) count++;
      }
      const p = (count / (width * height)) * 100;
      setPercent(p);
      if (p > 75 && !isRevealed) {
        setIsRevealed(true);
        ctx.clearRect(0,0,width,height); // Full reveal
      }
    };

    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches[0].clientX) - rect.left;
      const y = (e.clientY || e.touches[0].clientY) - rect.top;
      scratch(x, y);
    };

    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('touchmove', handleMove);
    
    return () => {
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('touchmove', handleMove);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[280px] h-[180px] mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden group">
       {/* Prize Underneath */}
       <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-brand/5 to-brand/10 p-4">
          <Trophy size={48} className="text-amber-500 mb-2 drop-shadow-lg" />
          <p className="text-[10px] font-black text-brand/40 uppercase tracking-widest">You Won</p>
          <h4 className="text-4xl font-black text-brand tracking-tighter">₹{cashback}</h4>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-1">Added to Wallet</p>
       </div>

       {/* Scratch Layer */}
       <canvas 
        ref={canvasRef} 
        width={300} 
        height={200} 
        className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-500 ${isRevealed ? 'opacity-0' : 'opacity-100'}`}
       />
       
       {isRevealed && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-2 right-2 p-1.5 bg-emerald-500 rounded-full text-white shadow-lg z-20"
          >
             <Check size={14} strokeWidth={4} />
          </motion.div>
       )}
    </div>
  );
}
