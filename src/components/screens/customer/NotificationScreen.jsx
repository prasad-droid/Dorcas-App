import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, Calendar, Tag, Info, AlertTriangle } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

import { API_BASE } from "../../../config";

export function NotificationScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/profile/get_notifications.php`, {
          method: 'GET',
          headers: { 
            "Authorization": `Bearer ${token}`, 
            "Role": role,
            "Accept": "application/json"
          }
        });

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        if (data.status) {
          setNotifications(data.data || []);
        }
      } catch (error) {
        console.error("Notifications fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return Calendar;
      case 'offer': return Tag;
      case 'alert': return AlertTriangle;
      default: return Info;
    }
  };

  const getColors = (type) => {
    switch (type) {
      case 'booking': return { color: "text-blue-500", bg: "bg-blue-50" };
      case 'offer': return { color: "text-green-500", bg: "bg-green-50" };
      case 'alert': return { color: "text-amber-500", bg: "bg-amber-50" };
      default: return { color: "text-purple-500", bg: "bg-purple-50" };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex flex-col w-full h-full bg-base"
    >
      <div className="brand-gradient px-5 pt-12 pb-6 rounded-b-[2rem] shadow-sm text-base flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-base/20 backdrop-blur-md rounded-full flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">{t('notifications')}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-brand/40 uppercase tracking-widest">{t('loading')}</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => {
            const Icon = getIcon(notif.type);
            const { color, bg } = getColors(notif.type);
            return (
              <div 
                key={notif.id}
                className="bg-white border border-brand/5 p-4 rounded-2xl flex gap-4 shadow-sm"
              >
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon size={24} className={color} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-brand text-sm">{notif.title}</h4>
                    <span className="text-[10px] font-semibold text-brand/40 uppercase">{notif.time_ago || "Just now"}</span>
                  </div>
                  <p className="text-xs text-brand/60 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-brand/5 rounded-full flex items-center justify-center text-brand/20 mb-6">
              <Bell size={40} />
            </div>
            <h3 className="text-lg font-black text-brand tracking-tight">No notifications yet</h3>
            <p className="text-[11px] font-bold text-brand/40 uppercase tracking-widest mt-1 px-10 leading-relaxed">
              We'll notify you when there's an update on your bookings or special offers.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
