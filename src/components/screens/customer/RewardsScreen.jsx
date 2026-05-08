import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Copy, Share2, Sparkles, X, Trophy, CheckCircle2, RefreshCw } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { ScratchCard } from "../../ui/ScratchCard";

import { API_BASE, APP_DOMAIN } from "../../../config";
import { useToast } from "../../../context/ToastContext";

export function RewardsScreen() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [profileData, setProfileData] = useState(null);
  const [scratchCards, setScratchCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

   const fetchData = async (showLoading = true) => {
     try {
       if (showLoading) setIsLoading(true);
       const token = localStorage.getItem("token");
       const role = localStorage.getItem("role");

       // Fetch Profile for points and referral code
       const profileRes = await fetch(`${API_BASE}/profile/get_profile.php`, {
         headers: { "Authorization": `Bearer ${token}`, "Role": role }
       });
       const profileData = await profileRes.json();
       if (profileData.status) setProfileData(profileData.data);

       // Fetch Scratch Cards
       const cardsRes = await fetch(`${API_BASE}/rewards/get_scratch_cards.php`, {
         headers: { "Authorization": `Bearer ${token}`, "Role": role }
       });
       const cardsData = await cardsRes.json();
       if (cardsData.status) setScratchCards(cardsData.data);

     } catch (error) {
       // console.error("Rewards Fetch Error:", error);
     } finally {
       setIsLoading(false);
     }
   };

  const handleScratchComplete = async (cardId) => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const response = await fetch(`${API_BASE}/rewards/scratch_card.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Role": role
        },
        body: JSON.stringify({ card_id: cardId })
      });

      const data = await response.json();
      if (data.status) {
        setScratchCards(prev => prev.map(c => c.id === cardId ? { ...c, is_scratched: 1 } : c));
        // Re-fetch to get updated points and stats from DB
        fetchData(false);
      }
    } catch (error) {
      // console.error("Scratch error:", error);
    }
  };

  const [isRedeeming, setIsRedeeming] = useState(false);
  const scratchedCount = scratchCards.filter(c => c.is_scratched).length;

  const handleRedeem = async () => {
    const points = Number(profileData?.stats?.value2) || 0;
    
    if (scratchedCount < 3) {
      showToast(t('payout_min_cards'), "error");
      return;
    }

    if (!upiId.trim()) {
      showToast(t('upi_required'), "error");
      return;
    }

    if (points <= 0) {
      showToast("No points available to redeem", "error");
      return;
    }

    try {
      setIsRedeeming(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const response = await fetch(`${API_BASE}/rewards/redeem_points.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Bearer ${token}`,
          "Role": role
        },
        body: `points=${points}&upi_id=${encodeURIComponent(upiId)}`
      });

      const data = await response.json();
      if (data.status) {
        setProfileData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            value2: 0 // All points redeemed
          }
        }));
        setUpiId("");
        showToast(t('payout_requested'), "success");
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      // console.error("Redeem error:", error);
      showToast("Failed to redeem points. Please try again.", "error");
    } finally {
      setIsRedeeming(false);
    }
  };

  const copyReferral = () => {
    const code = profileData?.referral_code || "REF";
    const link = `${APP_DOMAIN}/register?ref=${code}`;
    navigator.clipboard.writeText(link);
    showToast(t('referral_copied'), "success");
  };

  const shareWhatsApp = () => {
    const code = profileData?.referral_code || "REF";
    const link = `${APP_DOMAIN}/register?ref=${code}`;
    const text = `Hey! Join Dorcasaid for reliable home services. Use my link to sign up and we both get rewards: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base pt-12 sm:pt-6 px-5"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-brand tracking-tight">{t('my_rewards')}</h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchData(true)}
            className="w-10 h-10 bg-brand/5 rounded-2xl flex items-center justify-center text-brand active:rotate-180 transition-transform"
          >
            <RefreshCw size={18} />
          </button>
          <div className="flex items-center gap-1.5 bg-brand/10 px-4 py-2 rounded-2xl border border-brand/5">
            <Sparkles size={16} className="text-brand" />
            <span className="text-sm font-black text-brand">{profileData?.stats?.value2 || 0} {t('points')}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-28 space-y-8 remove-scrollbar">
        {/* Points Banner */}
        <div className="bg-gradient-to-br from-brand to-brand/80 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">{t('available_redemption')}</p>
            <h3 className="text-4xl font-black mb-4">₹{(Number(profileData?.stats?.value2 || 0) / 10).toFixed(0)} <span className="text-sm font-bold opacity-60">{t('value')}</span></h3>
            
            {scratchedCount < 3 ? (
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={14} className="text-white/40" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-white/40">{t('payout_locked')}</span>
                </div>
                <p className="text-[11px] font-bold text-white/70 leading-tight">
                  {t('payout_locked_desc')} ({scratchedCount}/3)
                </p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(scratchedCount / 3) * 100}%` }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/60 uppercase tracking-widest px-1">{t('enter_upi')}</label>
                  <input 
                    type="text" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder={t('upi_placeholder')}
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-sm font-bold text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/30 outline-none transition-all"
                  />
                </div>
                <button
                  onClick={handleRedeem}
                  disabled={isRedeeming}
                  className="w-full bg-white text-brand py-3.5 rounded-2xl text-[13px] font-black shadow-xl shadow-black/10 active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  {isRedeeming ? t('loading') : t('request_payout')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scratch Cards Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[15px] font-black text-brand tracking-tight">{t('scratch_cards')}</h3>
            <span className="text-[10px] font-bold text-brand/40 uppercase tracking-widest">{scratchCards.filter(c => !c.is_scratched).length} {t('pending')}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {scratchCards.map((card) => (
              <motion.div
                key={card.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => !card.is_scratched && setActiveCard(card)}
                className={`aspect-[4/5] rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden shadow-sm border ${card.is_scratched
                    ? "bg-emerald-50 border-emerald-100"
                    : "bg-brand border-brand/5 cursor-pointer"
                  }`}
              >
                {card.is_scratched ? (
                  <>
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
                      <Trophy size={24} className="text-emerald-600" />
                    </div>
                    <span className="text-emerald-700 font-black text-lg">₹{card.reward_amount}</span>
                    <span className="text-emerald-600/60 text-[10px] font-bold mt-1">{t('claimed')}</span>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                      <Gift size={32} className="text-white" />
                    </div>
                    <span className="text-white font-black text-[13px] text-center leading-tight">Lucky<br />Reward</span>
                    <span className="absolute bottom-3 text-white/60 text-[9px] font-bold uppercase tracking-widest">Tap to reveal</span>
                  </>
                )}
              </motion.div>
            ))}

            {/* Empty State placeholder */}
            {scratchCards.length === 0 && (
              <div className="col-span-2 py-10 bg-brand/5 border-2 border-dashed border-brand/10 rounded-3xl flex flex-col items-center">
                <Gift size={32} className="text-brand/20 mb-3" />
                <p className="text-xs font-bold text-brand/40 uppercase tracking-widest">{t('book_to_get_cards')}</p>
              </div>
            )}
          </div>
        </section>

        {/* Refer & Earn */}
        <section className="bg-brand/5 p-6 rounded-[2.5rem] shadow-sm border border-brand/10 relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-brand/5 rotate-12">
            <Share2 size={120} />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center">
              <Share2 size={24} className="text-brand" />
            </div>
            <div>
              <h3 className="text-lg font-black text-brand tracking-tight">{t('refer_earn')}</h3>
              <p className="text-[10px] font-bold text-brand/40 uppercase tracking-widest">{t('invite_friends')}</p>
            </div>
          </div>

          <p className="text-sm text-brand/70 font-semibold mb-6 leading-relaxed">
            Earn <span className="text-brand font-black">100 Points</span> instantly when your friends complete their first booking.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white border border-brand/10 rounded-2xl px-5 py-4 text-sm font-bold text-brand/60 truncate shadow-inner">
                {`${APP_DOMAIN}/register?ref=${profileData?.referral_code || "REF"}`}
              </div>
              <button
                onClick={copyReferral}
                className="bg-brand text-white p-4 rounded-2xl transition-all shadow-lg active:scale-90"
              >
                <Copy size={20} />
              </button>
            </div>
            <button
              onClick={shareWhatsApp}
              className="w-full bg-emerald-600 text-white font-black py-4.5 rounded-[2rem] shadow-xl shadow-emerald-600/20 mt-2 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
            >
              {t('share_whatsapp')}
              <Share2 size={18} />
            </button>
          </div>
        </section>
      </div>

      {/* Scratch Modal */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-brand/90 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="w-full max-w-sm flex flex-col items-center"
            >
              <button
                onClick={() => setActiveCard(null)}
                className="absolute top-12 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{t('lucky_reward')}!</h2>
                <p className="text-white/60 font-bold uppercase tracking-widest text-xs">{t('scratch_to_reveal')}</p>
              </div>

              <ScratchCard
                cashback={activeCard.reward_amount}
                onReveal={() => handleScratchComplete(activeCard.id)}
              />

              <p className="mt-10 text-white/40 text-[10px] font-bold uppercase tracking-[4px]">Verified by Dorcasaid Rewards</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
