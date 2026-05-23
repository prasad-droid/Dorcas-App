import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ShoppingCart, LayoutGrid } from "lucide-react";
import { categoryDetails as fallbackDetails } from "../../../data/services";

import { API_BASE, UPLOAD_BASE } from "../../../config";
import { useLanguage } from "../../../context/LanguageContext";
import { CategorySkeleton } from "../../ui/SkeletonScreen";

const IMAGE_BASE = `${UPLOAD_BASE}/categories/`;

const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, '');
};

export function CategoryScreen() {
  const { categoryId } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryName = queryParams.get("name") || "Services";

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        setIsLoading(true);
        // If categoryId is a number, it's an API ID
        if (!isNaN(categoryId)) {
          const res = await fetch(
            `${API_BASE}/services/get_services_by_category.php?category_id=${categoryId}`,
          );
          const data = await res.json();
          if (data.status) {
            const apiServices = data.data.map((srv) => ({
              id: srv.id,
              name: srv.service_name,
              price: srv.service_price ? `₹${srv.service_price}` : "₹299",
              desc: stripHtml(srv.service_desc) || "Expert service at your doorstep",
              image: srv.service_img
                ? srv.service_img.startsWith("http")
                  ? srv.service_img
                  : `https://dorcasaid.com/${srv.service_img}`
                : "services/cleaning.png",
              icon: LayoutGrid,
            }));
            console.log(apiServices);

            setServices(apiServices);
          } else {
            setServices(fallbackDetails[categoryName] || []);
          }
        } else {
          // Fallback for name-based navigation
          const decodedCategory = decodeURIComponent(categoryId);
          setServices(
            fallbackDetails[decodedCategory] ||
            fallbackDetails["Cleaning"] ||
            [],
          );
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setServices(fallbackDetails[categoryName] || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcategories();
  }, [categoryId, categoryName]);

  const displayName = categoryName;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-4 bg-base sticky top-0 z-20 shadow-sm border-b border-brand/5">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-brand/5 rounded-full flex items-center justify-center border border-brand/10 transition-colors hover:bg-brand/10"
        >
          <ChevronLeft size={20} className="text-brand pr-0.5" />
        </button>
        <h2 className="text-lg font-bold text-brand tracking-tight">
          {displayName}
        </h2>
        <button className="w-10 h-10 bg-brand/5 rounded-full flex items-center justify-center border border-brand/10 relative transition-colors hover:bg-brand/10">
          <ShoppingCart size={18} className="text-brand" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border border-base"></span>
        </button>
      </div>

      {/* List of Services */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-24 space-y-5 remove-scrollbar">
        {isLoading ? (
          <CategorySkeleton />
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-50">
            <LayoutGrid size={48} className="text-brand" />
            <p className="text-brand font-bold text-sm">
              {t('no_bookings')}
            </p>
          </div>
        ) : (
          services.map((sub) => {
            const Icon = sub.icon || LayoutGrid;
            return (
              <div
                key={sub.id}
                className="relative bg-brand/5 rounded-[2rem] p-5 overflow-hidden border border-brand/10 shadow-sm flex min-h-[170px]"
              >
                {/* Left Content Side */}
                <div className="w-[60%] z-10 flex flex-col items-start gap-2.5">
                  <div className="w-10 h-10 bg-base rounded-full flex items-center justify-center shadow-sm text-brand border border-brand/10 shrink-0">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-base font-bold text-brand leading-tight mt-1">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-brand/70 font-semibold leading-snug pe-4 line-clamp-2">
                    {sub.desc}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/book/${sub.id}/0?name=${encodeURIComponent(sub.name)}`,
                      )
                    }
                    className="mt-auto brand-gradient text-white px-5 py-2.5 rounded-full text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
                  >
                    {t('book_now')}
                  </button>
                </div>

                {/* Right Image Side with Fade Gradient */}
                <div className="absolute right-0 top-0 bottom-0 w-[45%] h-full z-0 pointer-events-none">
                  {/* Gradient mask to blend the left border of the image smoothly into the solid background */}
                  <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f9f9f9]/10 to-transparent z-10 mix-blend-multiply" />
                  <img
                    src={sub.image}
                    alt={sub.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center rounded-l-[3rem]"
                    style={{
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent, black 35%)",
                      maskImage:
                        "linear-gradient(to right, transparent, black 35%)",
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
