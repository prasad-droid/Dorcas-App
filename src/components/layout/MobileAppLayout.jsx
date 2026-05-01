import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, User, Gift, Briefcase, IndianRupee } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export function MobileAppLayout({ children }) {
  const location = useLocation();
  const { authMode } = useAuth();
  const { t } = useLanguage();

  const isTechMode = authMode === "technician"; // strict separation irrespective of isAuthenticated

  const customerNavItems = [
    { path: "/", icon: Home, label: t('home') },
    { path: "/bookings", icon: Calendar, label: t('bookings') },
    { path: "/rewards", icon: Gift, label: t('rewards') },
    { path: "/profile", icon: User, label: t('profile') },
  ];

  const techNavItems = [
    { path: "/tech", icon: Home, label: "Home" },
    { path: "/tech/services", icon: Briefcase, label: "Services" },
    { path: "/tech/earnings", icon: IndianRupee, label: "Earnings" },
    { path: "/tech/portfolio", icon: User, label: "Portfolio" },
  ];

  const navItems = isTechMode ? techNavItems : customerNavItems;

  return (
    <div className="flex flex-col h-[100dvh] sm:h-full w-full bg-base relative overflow-hidden">
      {/* Content Area */}
      <main className="flex-1 w-full relative overflow-hidden flex flex-col">
        {children}
      </main>

      {/* Bottom Navigation (iOS Style) */}
      {!["/login", "/register"].includes(location.pathname) && 
       !location.pathname.startsWith("/book/") && 
       !["/settings", "/support", "/terms-policy"].includes(location.pathname) && (
        <nav className="absolute sm:absolute bottom-0 w-full bg-white border-t-[0.5px] border-black/5 pt-2 pb-8 sm:pb-6 flex justify-around items-center z-[100] shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          {navItems.map((item) => {
            const isReallyActive = item.path === "/tech" 
              ? location.pathname === "/tech" 
              : (location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path)) || (item.path === "/tech/services" && location.pathname.startsWith("/tech/job/")));

            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-1 w-16"
              >
                <div
                  className={cn(
                    "transition-all duration-300 relative flex items-center justify-center p-1",
                    isReallyActive ? "text-brand" : "text-brand/40"
                  )}
                >
                  <Icon size={24} strokeWidth={isReallyActive ? 2.5 : 2} />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-semibold tracking-tight transition-colors",
                    isReallyActive ? "text-brand" : "text-brand/40"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
