import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, User, MapPin, CreditCard, Bell, 
  Globe, Shield, Trash2, ChevronRight,
  LogOut, Camera, Check, Info, FileText, Plus, X, Briefcase
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";

import { API_BASE } from "../../../config";

export function SettingsScreen() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localImage, setLocalImage] = useState(null);
  
  // App states
  const [notifSettings, setNotifSettings] = useState({
    bookings: true,
    offers: false,
    updates: true
  });
  
  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'profile', 'address', 'payment', 'delete', 'language', 'notifications'

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const response = await fetch(`${API_BASE}/profile/get_profile.php`, {
          headers: { "Authorization": `Bearer ${token}`, "Role": role }
        });
        const data = await response.json();
        if (data.status) setProfileData(data.data);
      } catch (error) {
        console.error("Settings fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          
          try {
            setLocalImage(compressedBase64);
            const role = localStorage.getItem("role");
            localStorage.setItem(`profile_image_${role}_${profileData.id}`, compressedBase64);
          } catch (err) {
            console.error("Storage error:", err);
            alert("Storage limit reached. Try a smaller image.");
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const SettingItem = ({ icon: Icon, label, value, onClick, type = "link", color = "brand" }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-brand/5 active:bg-brand/10 transition-colors border-b border-brand/5 last:border-0"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === 'red' ? 'bg-red-50 text-red-500' : 'bg-brand/5 text-brand'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 text-left">
        <p className={`text-[14px] font-black ${color === 'red' ? 'text-red-600' : 'text-brand'}`}>{label}</p>
        {value && <p className="text-[11px] font-bold text-brand/40 uppercase tracking-widest">{value}</p>}
      </div>
      {type === "link" && <ChevronRight size={18} className="text-brand/20" />}
    </button>
  );

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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-[#f8fbff] overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white pt-14 pb-6 px-5 border-b border-brand/5 flex items-center justify-between sticky top-0 z-30">
        <button 
          onClick={() => navigate(-1)}
          className="w-11 h-11 bg-brand/5 text-brand rounded-2xl flex items-center justify-center hover:bg-brand/10 transition-colors shadow-sm"
        >
          <ChevronLeft size={22} />
        </button>
        <h2 className="text-lg font-black text-brand tracking-tight">{t('settings')}</h2>
        <div className="w-11"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8 remove-scrollbar">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-brand to-brand/80 rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl shadow-brand/20">
           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
           <div className="relative z-10 flex items-center gap-5">
              <div className="relative">
                 <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md p-1 border-2 border-white/30 flex items-center justify-center overflow-hidden">
                    {localImage || profileData?.profile_img ? (
                      <img 
                        src={localImage || profileData?.profile_img} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-black text-white">{getInitials(profileData?.name)}</span>
                    )}
                 </div>
                 <label htmlFor="profile-upload" className="absolute -bottom-1 -right-1 w-8 h-8 bg-white text-brand rounded-full flex items-center justify-center shadow-lg border-2 border-brand cursor-pointer hover:bg-slate-50 transition-colors">
                    <Camera size={14} />
                    <input 
                      id="profile-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                 </label>
              </div>
              <div className="flex-1">
                 <h3 className="text-xl font-black leading-tight">{profileData?.name || "Guest User"}</h3>
                 <p className="text-white/70 text-xs font-bold mt-1 uppercase tracking-widest">{profileData?.phone || "No phone linked"}</p>
                 <button 
                   onClick={() => setActiveModal('profile')}
                   className="mt-3 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors border border-white/10"
                 >
                    {t('edit_profile')}
                 </button>
              </div>
           </div>
        </div>

        {/* Account Settings Group */}
        <div className="space-y-3">
           <h4 className="text-[11px] font-black text-brand/30 uppercase tracking-[0.2em] px-1">{t('identity')}</h4>
           <div className="bg-white rounded-[2rem] border border-brand/5 shadow-sm overflow-hidden">
              <SettingItem icon={User} label={t('personal_info')} value="Name, Email, Phone" onClick={() => setActiveModal('profile')} />
              <SettingItem icon={MapPin} label={t('saved_addresses')} value={profileData?.city || "Manage Addresses"} onClick={() => setActiveModal('address')} />
              <SettingItem icon={CreditCard} label={t('payment_methods')} value={t('cod')} onClick={() => setActiveModal('payment')} />
           </div>
        </div>

        {/* Preferences Group */}
        <div className="space-y-3">
           <h4 className="text-[11px] font-black text-brand/30 uppercase tracking-[0.2em] px-1">{t('preferences')}</h4>
           <div className="bg-white rounded-[2rem] border border-brand/5 shadow-sm overflow-hidden">
              <SettingItem 
                icon={Bell} 
                label={t('notifications')} 
                value={notifSettings.bookings ? "Active" : "Managed"} 
                onClick={() => setActiveModal('notifications')} 
              />
              <SettingItem 
                icon={Globe} 
                label={t('app_language')} 
                value={language} 
                onClick={() => setActiveModal('language')} 
              />
              <SettingItem icon={Shield} label={t('privacy_permissions')} value="Policies & Data" onClick={() => navigate("/terms-policy")} />
           </div>
        </div>

        {/* Support & About Group */}
        <div className="space-y-3">
           <h4 className="text-[11px] font-black text-brand/30 uppercase tracking-[0.2em] px-1">{t('support')}</h4>
           <div className="bg-white rounded-[2rem] border border-brand/5 shadow-sm overflow-hidden">
              <SettingItem icon={Info} label={t('help_support')} onClick={() => navigate("/support")} />
              <SettingItem icon={FileText} label={t('terms_policies')} onClick={() => navigate("/terms-policy")} />
           </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-3 pt-4">
           <h4 className="text-[11px] font-black text-red-300 uppercase tracking-[0.2em] px-1">{t('danger_zone')}</h4>
           <div className="bg-red-50 rounded-[2rem] border border-red-100 overflow-hidden">
              <SettingItem icon={LogOut} label={t('sign_out')} color="red" onClick={logout} />
              <SettingItem icon={Trash2} label={t('delete_account')} color="red" onClick={() => setActiveModal('delete')} />
           </div>
        </div>

        <div className="text-center pb-24">
           <p className="text-[10px] font-black text-brand/20 uppercase tracking-[0.3em]">Dorcasaid Premium App v2.4.0</p>
        </div>
      </div>

      {/* Modals Overlay */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[200] bg-brand/20 backdrop-blur-sm flex items-end justify-center"
            onClick={() => setActiveModal(null)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full bg-white rounded-t-[3rem] p-8 pb-16 shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
               <div className="w-12 h-1.5 bg-brand/10 rounded-full mx-auto mb-8"></div>
               
               {activeModal === 'profile' && (
                 <div className="space-y-6">
                    <h3 className="text-xl font-black text-brand">{t('edit_profile')}</h3>
                    
                    <div className="flex flex-col items-center gap-4 py-4">
                       <div className="relative">
                          <div className="w-24 h-24 rounded-3xl bg-brand/5 border-2 border-brand/10 p-1 flex items-center justify-center overflow-hidden">
                             {localImage || profileData?.profile_img ? (
                               <img 
                                 src={localImage || profileData?.profile_img} 
                                 alt="Profile" 
                                 className="w-full h-full rounded-[1.25rem] object-cover"
                               />
                             ) : (
                               <span className="text-3xl font-black text-brand/30">{getInitials(profileData?.name)}</span>
                             )}
                          </div>
                          <label htmlFor="profile-upload-modal" className="absolute -bottom-2 -right-2 w-9 h-9 bg-brand text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white cursor-pointer">
                             <Camera size={16} />
                             <input 
                               id="profile-upload-modal" 
                               type="file" 
                               accept="image/*" 
                               className="hidden" 
                               onChange={handleImageUpload} 
                             />
                          </label>
                       </div>
                       <p className="text-[10px] font-black text-brand/30 uppercase tracking-widest">Tap to change photo</p>
                    </div>

                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-brand/40 uppercase px-1">Full Name</label>
                          <input type="text" defaultValue={profileData?.name} className="w-full bg-brand/5 border border-brand/10 rounded-2xl py-4 px-5 text-sm font-bold text-brand focus:ring-4 focus:ring-brand/5 outline-none" />
                       </div>
                       <div className="space-y-1">
                          <label className="text-[10px] font-black text-brand/40 uppercase px-1">Email Address</label>
                          <input type="email" defaultValue={profileData?.email || "user@example.com"} className="w-full bg-brand/5 border border-brand/10 rounded-2xl py-4 px-5 text-sm font-bold text-brand focus:ring-4 focus:ring-brand/5 outline-none" />
                       </div>
                    </div>
                    <button className="w-full bg-brand text-white py-4 rounded-2xl font-black shadow-lg shadow-brand/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                       <Check size={18} />
                       {t('save')}
                    </button>
                 </div>
               )}

               {activeModal === 'address' && (
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black text-brand">{t('saved_addresses')}</h3>
                       <button className="w-10 h-10 bg-brand text-white rounded-xl flex items-center justify-center shadow-lg shadow-brand/20 active:scale-95 transition-transform">
                          <Plus size={20} />
                       </button>
                    </div>
                    <div className="space-y-3">
                       <div className="p-4 bg-brand/5 border border-brand/10 rounded-2xl flex items-start gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand shrink-0">
                             <MapPin size={20} />
                          </div>
                          <div className="flex-1">
                             <h4 className="text-sm font-black text-brand">{t('primary_address')}</h4>
                             <p className="text-xs font-semibold text-brand/50 mt-1 leading-relaxed">{profileData?.address || "No address provided"}, {profileData?.city || ""}</p>
                          </div>
                       </div>
                       <button className="w-full py-4 border-2 border-dashed border-brand/20 rounded-2xl flex items-center justify-center gap-2 text-brand/40 font-black text-[13px] hover:bg-brand/[0.02] transition-colors">
                          <Plus size={16} />
                          {t('add_new_address')}
                       </button>
                    </div>
                 </div>
               )}

               {activeModal === 'payment' && (
                 <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <h3 className="text-xl font-black text-brand">{t('payment_methods')}</h3>
                    </div>
                    <div className="space-y-3">
                       <div className="p-4 bg-brand/5 border-2 border-brand rounded-2xl flex items-center gap-4">
                          <div className="w-12 h-10 bg-white rounded-xl flex items-center justify-center text-brand font-black italic shadow-sm shrink-0">
                             <Check size={20} />
                          </div>
                          <div className="flex-1">
                             <h4 className="text-sm font-black text-brand">{t('cod')}</h4>
                             <p className="text-[10px] font-bold text-brand/40 uppercase tracking-widest mt-0.5">{t('default_payment')}</p>
                          </div>
                       </div>
                       <button className="w-full py-4 border-2 border-dashed border-brand/20 rounded-2xl flex items-center justify-center gap-2 text-brand/40 font-black text-[13px] hover:bg-brand/[0.02] transition-colors">
                          <Plus size={16} />
                          {t('add_payment')}
                       </button>
                    </div>
                 </div>
               )}

               {activeModal === 'language' && (
                 <div className="space-y-6">
                    <h3 className="text-xl font-black text-brand">{t('select_language')}</h3>
                    <div className="grid grid-cols-1 gap-3">
                       {["English", "Hindi", "Marathi"].map((lang) => (
                         <button 
                           key={lang}
                           onClick={() => { setLanguage(lang); setActiveModal(null); }}
                           className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${language === lang ? 'bg-brand/5 border-brand' : 'bg-white border-brand/5'}`}
                         >
                            <div>
                               <h4 className="font-black text-brand text-left">{lang}</h4>
                               <p className="text-[10px] font-bold text-brand/40 uppercase tracking-widest mt-1">
                                  {lang === 'English' ? 'Standard English' : lang === 'Hindi' ? 'हिन्दी' : 'मराठी'}
                               </p>
                            </div>
                            {language === lang && <Check size={20} className="text-brand" strokeWidth={3} />}
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {activeModal === 'notifications' && (
                 <div className="space-y-6">
                    <h3 className="text-xl font-black text-brand">{t('notification_settings')}</h3>
                    <div className="bg-white rounded-[2rem] border border-brand/5 shadow-sm overflow-hidden">
                       {[
                         { id: 'bookings', label: t('booking_updates'), desc: 'Status, timings, and vendor info' },
                         { id: 'offers', label: t('offers_rewards'), desc: 'Discounts, scratch cards, and points' },
                         { id: 'updates', label: t('system_updates'), desc: 'Important app and policy changes' }
                       ].map((item) => (
                         <div key={item.id} className="p-5 flex items-center justify-between border-b border-brand/5 last:border-0">
                            <div className="flex-1 pr-4">
                               <h4 className="text-sm font-black text-brand">{item.label}</h4>
                               <p className="text-[11px] font-semibold text-brand/40 mt-0.5 leading-tight">{item.desc}</p>
                            </div>
                            <button 
                              onClick={() => setNotifSettings(prev => ({...prev, [item.id]: !prev[item.id]}))}
                              className={`w-12 h-6 rounded-full relative transition-colors ${notifSettings[item.id] ? 'bg-brand' : 'bg-brand/10'}`}
                            >
                               <motion.div 
                                 animate={{ x: notifSettings[item.id] ? 24 : 4 }}
                                 className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm"
                               />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
               )}

               {activeModal === 'delete' && (
                 <div className="space-y-6 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto">
                       <Trash2 size={32} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-brand">{t('delete_account')}?</h3>
                       <p className="text-sm font-semibold text-brand/60 mt-2 leading-relaxed">{t('delete_confirm')}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                       <button className="w-full bg-red-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-red-500/20 active:scale-95 transition-transform">
                          {t('yes_delete')}
                       </button>
                       <button 
                         onClick={() => setActiveModal(null)}
                         className="w-full bg-brand/5 text-brand py-4 rounded-2xl font-black active:scale-95 transition-transform"
                       >
                          {t('no_keep')}
                       </button>
                    </div>
                 </div>
               )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
