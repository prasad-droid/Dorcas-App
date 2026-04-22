import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, User, Gift, Briefcase, IndianRupee } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export function MobileAppLayout({ children }) {
  const location = useLocation();
  const { authMode } = useAuth();

  const isTechMode = authMode === "technician"; // strict separation irrespective of isAuthenticated

  const customerNavItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/bookings", icon: Calendar, label: "Bookings" },
    { path: "/rewards", icon: Gift, label: "Rewards" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const techNavItems = [
    { path: "/tech", icon: Briefcase, label: "Jobs" },
    { path: "/tech/earnings", icon: IndianRupee, label: "Earnings" },
    { path: "/tech/profile", icon: User, label: "Profile" },
  ];

  const navItems = isTechMode ? techNavItems : customerNavItems;

  return (
    <div className="flex flex-col h-[100dvh] sm:h-full w-full bg-base relative overflow-hidden">
      {/* Content Area */}
      <main className="flex-1 w-full relative overflow-hidden flex flex-col">
        {children}
      </main>

      {/* Bottom Navigation (iOS Style) */}
      {!["/login", "/register"].includes(location.pathname) && (
        <nav className="absolute sm:absolute bottom-0 w-full bg-base/70 backdrop-blur-2xl border-t-[0.5px] border-black/10 pt-2 pb-8 sm:pb-6 flex justify-around items-center z-[100]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(`${item.path}/`) && item.path !== "/tech"); 
            // For tech home (/tech), exact match or starts with (/tech/) but since all tech routes start with /tech, we check exact match for /tech.
            const isReallyActive = item.path === "/tech" ? location.pathname === "/tech" : (location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path)));

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
          {/* iOS Home Indicator Pill */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[35%] h-[5px] bg-black/20 rounded-full"></div>
        </nav>
      )}
    </div>
  );
}
