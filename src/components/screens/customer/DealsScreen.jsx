import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Gift, Users, Share2, Copy, Sparkles } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

import { API_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";
import { ListTabSkeleton } from "../../ui/SkeletonScreen";

export function DealsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const response = await fetch(`${API_BASE}/profile/get_profile.php`, {
          headers: { "Authorization": `Bearer ${token}`, "Role": role }
        });
        const data = await response.json();
        if (data.status) {
          setProfileData(data.data);
        }
      } catch (error) {
        // console.error("Profile fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleShare = () => {
    const refCode = profileData?.referral_code || "REF123";
    const shareUrl = `https://dorcasaid.com/invite/${refCode}`;

    if (navigator.share) {
      navigator.share({
        title: 'Join Dorcas',
        text: `Hey! Join me on Dorcas and get professional home services. Use my referral code ${refCode} to earn points!`,
        url: shareUrl
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(shareUrl);
      showToast("Referral link copied to clipboard!", "success");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base"
    >
      <div className="brand-gradient px-5 pt-12 pb-6 rounded-b-[2rem] shadow-sm text-base flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-base/20 backdrop-blur-md rounded-full flex items-center justify-center"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-bold">{t('special_offers')}</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-8 space-y-8">
        {isLoading ? <ListTabSkeleton /> : (
          <>
            <div className="relative h-[300px] rounded-[2.5rem] overflow-hidden shadow-2xl group border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop"
                alt="Refer & Earn"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/40 to-transparent" />

              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border border-white/30">
                  <Users size={32} className="text-white" />
                </div>
                <h3 className="text-3xl font-black text-white leading-tight mb-2 drop-shadow-lg">
                  Refer Friends &<br />Earn 500 Points
                </h3>
                <p className="text-white/90 text-sm font-semibold leading-relaxed max-w-[90%] drop-shadow-md">
                  Share the love! Get 500 points in your wallet for every friend who joins and completes their first booking.
                </p>
              </div>

              <div className="absolute top-6 right-6">
                <div className="bg-amber-400 p-3 rounded-2xl shadow-lg animate-bounce">
                  <Sparkles size={20} className="text-brand fill-brand" />
                </div>
              </div>
            </div>

            {/* Referral Code Box */}
            <div className="bg-white border-2 border-brand/10 border-dashed rounded-[2rem] p-6 flex flex-col items-center gap-4">
              <span className="text-[10px] font-black text-brand/40 uppercase tracking-[4px]">Your Referral Code</span>
              <div className="flex items-center gap-3 w-full">
                <div className="flex-1 bg-brand/5 py-4 px-6 rounded-2xl text-center font-black text-2xl text-brand tracking-[8px] shadow-inner">
                  {profileData?.referral_code || "---"}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(profileData?.referral_code || "");
                    showToast("Code copied!", "success");
                  }}
                  className="w-14 h-14 brand-gradient text-base rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                  <Copy size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleShare}
                className="w-full brand-gradient text-base py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-brand/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                <Share2 size={24} />
                {t('invite_friends')}
              </button>
            </div>
          </>
        )}

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-900">
          <h4 className="font-black text-brand uppercase tracking-wider text-sm mb-4">How it works</h4>
          <div className="space-y-4">
            {[
              { step: "1", text: "Invite your friends to Dorcas using your unique link." },
              { step: "2", text: "They sign up and complete their first home service." },
              { step: "3", text: "You instantly receive 500 reward points in your wallet!" }
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center shrink-0 font-black text-brand text-sm">
                  {item.step}
                </div>
                <p className="text-sm font-semibold text-brand/70 leading-relaxed pt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
