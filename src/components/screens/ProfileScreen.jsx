import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, Shield, ChevronRight, LogOut, Settings, HelpCircle, 
  FileText, LayoutDashboard, Calendar, Bell, ChevronLeft,
  CreditCard, MapPin
} from "lucide-react";
import { useAuth } from "../../App";

export function ProfileScreen() {
  const { isAuthenticated, setIsAuthenticated, setShowAuthPopup } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const mainMenuItems = [
    { icon: LayoutDashboard, label: "My Dashboard", desc: "Overview and insights", action: () => navigate("/dashboard") },
    { icon: Calendar, label: "My Bookings", desc: "View past and upcoming services", action: () => navigate("/order-history") },
    { icon: HelpCircle, label: "Help & Support", desc: "FAQs and contact us", action: () => {} },
    { icon: FileText, label: "Terms & Policies", desc: "Privacy policy and terms of service", action: () => {} },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base relative overflow-hidden"
    >
      {/* Redesigned Premium Header Layer */}
      <div className="relative bg-brand pt-14 pb-14 px-5 rounded-b-[2.5rem] shadow-sm text-base flex flex-col items-center">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 overflow-hidden rounded-b-[2.5rem]">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        {/* Header Action Row (Settings Icon) */}
        <div className="absolute top-12 right-6 z-10 w-full flex justify-end">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 bg-base/10 backdrop-blur-md border border-base/20 rounded-full flex items-center justify-center hover:bg-base/20 transition-colors shadow-sm"
          >
            <Settings size={20} className="text-base" />
          </button>
        </div>

        {/* Profile Identity */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-base rounded-full flex items-center justify-center p-1 mb-3 shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-brand shadow-brand/30">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop" alt="Profile" className="w-full h-full rounded-full object-cover" />
          </div>
          <h2 className="text-[22px] font-extrabold tracking-tight drop-shadow-md">John Doe</h2>
          <p className="text-base/80 text-[13px] font-semibold mt-0.5 bg-base/10 px-3 py-1 rounded-full backdrop-blur-sm shadow-inner">+91 98765 43210</p>
        </div>
      </div>

      {/* Floating Stats Bar */}
      <div className="relative z-20 px-6 -mt-8 mb-4">
        <div className="bg-base shadow-[0_8px_20px_rgba(13,110,253,0.08)] border border-brand/5 rounded-2xl p-4 flex justify-between items-center text-center divide-x divide-brand/10">
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand/50 mb-1">Bookings</p>
            <p className="text-xl font-black text-brand">12</p>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand/50 mb-1">Points</p>
            <p className="text-xl font-black text-[#ffb800]">120</p>
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-brand/50 mb-1">Status</p>
            <p className="text-sm font-black text-brand mt-1">PRO</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-2 pb-20 space-y-3 overflow-y-auto">
        <h3 className="text-[13px] font-bold text-brand uppercase tracking-wider mb-3 px-1 mt-2 border-b border-brand/10 pb-2">Account Dashboard</h3>
        
        {mainMenuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              onClick={item.action}
              className="bg-brand/5 p-4 rounded-2xl flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all shadow-[0_2px_10px_rgba(13,110,253,0.03)] border border-brand/5 hover:bg-brand/10"
            >
              <div className="w-12 h-12 bg-base shadow-sm rounded-xl flex items-center justify-center border border-brand/5">
                <Icon size={20} className="text-brand" />
              </div>
              <div className="flex-1">
                <h4 className="text-[14px] font-bold text-brand">{item.label}</h4>
                <p className="text-[12px] font-semibold text-brand/50 mt-0.5 leading-snug">{item.desc}</p>
              </div>
              <div className="w-8 h-8 bg-base shadow-sm rounded-full flex items-center justify-center">
                <ChevronRight size={16} className="text-brand/40" />
              </div>
            </div>
          );
        })}

        <button 
          onClick={() => setIsAuthenticated(false)}
          className="w-full mt-8 bg-red-50 p-4 rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-transform text-red-600 font-bold text-[14px] border border-red-100"
        >
          <LogOut size={18} />
          Sign Out safely
        </button>
      </div>

      {/* Embedded Slide-over Settings & Edit Profile Page */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 bg-base flex flex-col w-full h-full shadow-[-10px_0_30px_rgba(0,0,0,0.1)]"
          >
            {/* Page Header */}
            <div className="pt-14 pb-4 px-5 border-b border-brand/10 bg-base/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="w-10 h-10 bg-brand/5 text-brand rounded-full flex items-center justify-center shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg font-bold text-brand">Settings & Profile</h2>
              <div className="w-10 h-10"></div> {/* Spacer for symmetry */}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-6 bg-brand/[0.02] space-y-8">
              
              {/* Profile Config Group */}
              <div>
                <h3 className="text-[13px] font-bold text-brand/60 uppercase tracking-widest mb-3 px-1">Identity</h3>
                <div className="bg-base rounded-2xl border border-brand/10 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-brand/5 border-b border-brand/10">
                    <User size={20} className="text-brand/50" />
                    <div className="flex-1 text-sm font-bold text-brand">Edit Profile Information</div>
                    <ChevronRight size={16} className="text-brand/30" />
                  </div>
                  <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-brand/5 border-b border-brand/10">
                    <MapPin size={20} className="text-brand/50" />
                    <div className="flex-1 text-sm font-bold text-brand">Saved Addresses</div>
                    <ChevronRight size={16} className="text-brand/30" />
                  </div>
                  <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-brand/5">
                    <CreditCard size={20} className="text-brand/50" />
                    <div className="flex-1 text-sm font-bold text-brand">Payment Methods</div>
                    <ChevronRight size={16} className="text-brand/30" />
                  </div>
                </div>
              </div>

              {/* Settings Configuration Group */}
              <div>
                <h3 className="text-[13px] font-bold text-brand/60 uppercase tracking-widest mb-3 px-1">App Configuration</h3>
                <div className="bg-base rounded-2xl border border-brand/10 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-4 flex items-center justify-between cursor-pointer border-b border-brand/10 hover:bg-brand/5">
                    <div className="flex items-center gap-4">
                      <Bell size={20} className="text-brand/50" />
                      <div className="text-sm font-bold text-brand">Push Notifications</div>
                    </div>
                    {/* Toggle mock */}
                    <div className="w-10 h-6 bg-brand rounded-full relative cursor-pointer shadow-inner">
                      <div className="w-5 h-5 bg-base rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between cursor-pointer border-b border-brand/10 hover:bg-brand/5">
                    <div className="flex items-center gap-4">
                      <MapPin size={20} className="text-brand/50" />
                      <div className="text-sm font-bold text-brand">Location Services</div>
                    </div>
                    {/* Toggle mock */}
                    <div className="w-10 h-6 bg-brand rounded-full relative cursor-pointer shadow-inner">
                      <div className="w-5 h-5 bg-base rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                    </div>
                  </div>
                  <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-brand/5">
                    <Shield size={20} className="text-brand/50" />
                    <div className="flex-1 text-sm font-bold text-brand">Privacy Settings</div>
                    <ChevronRight size={16} className="text-brand/30" />
                  </div>
                </div>
              </div>

              <div className="pt-6 pb-12 flex justify-center">
                <p className="text-[11px] font-semibold text-brand/40 uppercase tracking-wider">Dorcas App Version 2.0.1 (Build 42)</p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
