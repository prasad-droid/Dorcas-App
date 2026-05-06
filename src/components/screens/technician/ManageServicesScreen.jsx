import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, LayoutGrid, Check, Search, Save, Zap } from "lucide-react";
import { API_BASE, UPLOAD_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";

export function ManageServicesScreen() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const headers = { 
        "Authorization": `Bearer ${token}`, 
        "Role": role,
        "Content-Type": "application/json"
      };

      // 1. Fetch all categories and services
      const catRes = await fetch(`${API_BASE}/categories/get_categories_with_services.php`);
      const catData = await catRes.json();
      
      // 2. Fetch current user services
      const userRes = await fetch(`${API_BASE}/vendors/manage_services.php`, { headers });
      const userData = await userRes.json();

      if (catData.status) setCategories(catData.data);
      if (userData.status) setSelectedServices(userData.data.map(id => Number(id)));
      
    } catch (error) {
      showToast("Failed to load services", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    if (selectedServices.length === 0) {
      showToast("Please select at least one service", "warning");
      return;
    }

    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const response = await fetch(`${API_BASE}/vendors/manage_services.php`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`, 
          "Role": role,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ services: selectedServices })
      });

      const data = await response.json();
      if (data.status) {
        showToast("Services updated successfully!", "success");
        navigate("/tech");
      } else {
        showToast(data.message || "Failed to update services", "error");
      }
    } catch (error) {
      showToast("Connection error. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-base">
        <div className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col bg-base overflow-y-auto pb-32">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 bg-white border-b border-brand/5">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-brand/5 flex items-center justify-center text-brand"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-black text-brand tracking-tight">Manage Services</h2>
          <div className="w-10" />
        </div>

        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/30 group-focus-within:text-brand transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand/5 border border-transparent rounded-2xl py-4 pl-12 pr-4 text-[15px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand/5 focus:border-brand/40 transition-all placeholder:text-brand/20 shadow-sm"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 remove-scrollbar pb-32">
        {categories
          .filter(cat => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return cat.category_name.toLowerCase().includes(q) || 
                   cat.services?.some(s => s.service_name.toLowerCase().includes(q));
          })
          .map((category) => {
            const displayServices = !searchQuery ? category.services : category.services?.filter(s => 
              s.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            const isExpanded = expandedCategory === category.id || (searchQuery.length > 0 && displayServices?.length > 0);
            const selectedInCategory = category.services?.filter(s => selectedServices.includes(Number(s.id))) || [];
            
            return (
              <div key={category.id} className="space-y-2">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                  className={`w-full p-4 rounded-[2rem] border transition-all flex items-center justify-between ${
                    isExpanded ? "bg-white border-brand shadow-xl shadow-brand/5" : "bg-white border-brand/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isExpanded ? "bg-brand text-white" : "bg-brand/5 text-brand"}`}>
                      <LayoutGrid size={20} />
                    </div>
                    <div className="text-left">
                      <span className="block font-black text-sm tracking-tight text-brand">
                        {category.category_name}
                      </span>
                      {selectedInCategory.length > 0 && (
                        <span className="text-[10px] font-bold text-emerald-600 block">
                          {selectedInCategory.length} services active
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${isExpanded ? "rotate-180 bg-brand/10 text-brand" : "bg-brand/5 text-brand/40"}`}>
                    <ChevronLeft size={16} className="-rotate-90" />
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-2 px-1"
                    >
                      {displayServices?.map((service) => {
                        const isSelected = selectedServices.includes(Number(service.id));
                        return (
                          <button
                            key={service.id}
                            onClick={() => toggleService(Number(service.id))}
                            className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
                              isSelected
                                ? "bg-brand/5 border-brand/20 shadow-sm"
                                : "bg-white border-brand/5 hover:border-brand/20"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                isSelected ? "bg-brand text-white" : "bg-brand/5 text-brand/20"
                              }`}>
                                <Zap size={14} />
                              </div>
                              <div className="text-left">
                                <span className="text-sm font-bold text-brand">{service.service_name}</span>
                                <span className="block text-[10px] font-black text-brand/30">₹{service.price || service.amount}</span>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <Check size={12} strokeWidth={4} />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
                
              </div>
            );
          })}

        {categories.filter(cat => {
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          return cat.category_name.toLowerCase().includes(q) || 
                 cat.services?.some(s => s.service_name.toLowerCase().includes(q));
        }).length === 0 && (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-brand/5 rounded-full flex items-center justify-center mx-auto text-brand/20">
              <Search size={32} />
            </div>
            <div className="space-y-1">
              <p className="font-black text-brand tracking-tight">No services found</p>
              <p className="text-[12px] font-bold text-brand/40 uppercase tracking-widest">Try a different search term</p>
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-brand text-white py-5 rounded-[2rem] font-black text-[15px] shadow-2xl shadow-brand/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          {isSaving ? "Saving Changes..." : "Save Selection"}
          {!isSaving && <Save size={18} />}
        </button>
      </div>
    </div>
  );
}
