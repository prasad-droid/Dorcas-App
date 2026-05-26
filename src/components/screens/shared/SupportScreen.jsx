import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, HelpCircle, ChevronDown, ChevronUp, 
  Search, MessageCircle, Phone, Mail, Sparkles 
} from "lucide-react";

export function SupportScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("customer");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const customerFaqs = [
    {
      q: "What is Dorcasaid?",
      a: "Dorcasaid is our specialized support and protection program. It ensures that every service booked through our platform is covered by our quality guarantee and professional standards."
    },
    {
      q: "How do I book a service?",
      a: "Booking is easy! Just browse our categories, select the service you need, choose a qualified professional based on their ratings, and pick a convenient date and time."
    },
    {
      q: "How can I pay for a service?",
      a: "We offer flexible payment options. You can choose to 'Pay After Service' via cash or use various online payment methods for a completely digital experience."
    },
    {
      q: "Can I reschedule or cancel a booking?",
      a: "Yes, you can manage your bookings through the 'Order History' section. You can reschedule or cancel a booking up to 2 hours before the scheduled service time."
    },
    {
      q: "How do I know if a service provider is trustworthy?",
      a: "Every provider on Dorcasaid undergoes a rigorous background verification process. We also display real customer ratings and reviews to help you make an informed choice."
    },
    {
      q: "What if I have an issue with a service?",
      a: "Your satisfaction is our priority. If you're not happy with a service, you can report the issue within 24 hours through the 'Help & Support' screen or by contacting our 24/7 helpline."
    },
    {
      q: "How can I provide feedback or rate a provider?",
      a: "Once a service is marked as completed, you can go to your 'Order History' and tap on 'Rate Service' to share your experience and give a star rating."
    },
    {
      q: "How do I reset my account password?",
      a: "If you're logged in, go to Settings in your profile. If you've forgotten your password, use the 'Forgot Password' link on the login screen to receive a reset OTP."
    }
  ];

  const technicianFaqs = [
    {
      q: "Who can join Dorcasaid as a service provider?",
      a: "Any skilled professional with experience in home services, appliances, cleaning, or other listed categories can apply to join the Dorcasaid network."
    },
    {
      q: "How do I register as a service provider?",
      a: "Download the Dorcasaid app and sign up by selecting the 'Technician/Vendor' role. You'll need to provide your professional details and complete the onboarding process."
    },
    {
      q: "What documents are required to get approved?",
      a: "To ensure safety and trust, we require valid government-issued ID (like Aadhar or PAN), address proof, and any relevant trade certificates or licenses."
    },
    {
      q: "How do I receive service bookings?",
      a: "Once approved, you'll receive real-time notifications for new job requests in your area. You can view and accept these jobs from your 'My Jobs' dashboard."
    },
    {
      q: "How does payment work for service providers?",
      a: "For cash payments, you collect from the customer directly. For online payments, funds are settled to your bank account weekly after deducting a small platform commission."
    },
    {
      q: "Can I update my profile and service details?",
      a: "Yes, you can edit your profile, update your service areas, and manage your availability through the 'Settings' section in your professional dashboard."
    },
    {
      q: "How do ratings and reviews affect my profile?",
      a: "Higher ratings increase your visibility and lead to more job requests. Maintaining a high rating is key to becoming a 'Premium Partner' on the platform."
    },
    {
      q: "Who should I contact if I face an issue with a booking?",
      a: "Technicians have access to a dedicated 'Partner Support' line available in the app to resolve any job-related queries or disputes instantly."
    }
  ];

  const currentFaqs = activeTab === "customer" ? customerFaqs : technicianFaqs;
  const filteredFaqs = currentFaqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-[#f8fbff] overflow-hidden"
    >
      {/* Header */}
      <div className="bg-brand pt-14 pb-20 px-5 rounded-b-[2.5rem] shadow-sm relative overflow-hidden text-base flex flex-col">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-base/20 rounded-full flex items-center justify-center hover:bg-base/30 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-black tracking-tight">Help & Support</h2>
          <div className="w-10"></div>
        </div>
        
        <div className="relative z-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-white/40 focus:outline-none focus:ring-4 focus:ring-white/5 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 -mt-8 relative z-20 mb-6">
        <div className="bg-white p-1.5 rounded-2xl shadow-xl flex gap-1 border border-gray-300">
          <button 
            onClick={() => { setActiveTab("customer"); setExpandedIndex(null); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === "customer" ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-brand/40"}`}
          >
            For Customers
          </button>
          <button 
            onClick={() => { setActiveTab("technician"); setExpandedIndex(null); }}
            className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${activeTab === "technician" ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-brand/40"}`}
          >
            For Professionals
          </button>
        </div>
      </div>

      {/* FAQs List */}
      <div className="flex-1 overflow-y-auto px-5 pb-28 space-y-4 remove-scrollbar">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, idx) => (
            <motion.div 
              key={idx}
              layout
              className={`bg-white rounded-3xl border border-gray-300 shadow-sm overflow-hidden transition-all ${expandedIndex === idx ? "ring-2 ring-brand/10" : ""}`}
            >
              <button 
                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                className="w-full p-5 flex items-center justify-between text-left"
              >
                <span className="text-[14px] font-black text-brand leading-snug pr-4">{faq.q}</span>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${expandedIndex === idx ? "bg-brand text-white" : "bg-brand/5 text-brand"}`}>
                  {expandedIndex === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>
              
              <AnimatePresence>
                {expandedIndex === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-5 pb-6"
                  >
                    <div className="h-px bg-brand/5 mb-4" />
                    <p className="text-[13px] font-semibold text-brand/60 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-brand/5 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-brand/20" />
            </div>
            <p className="text-sm font-black text-brand/40 uppercase tracking-widest">No results found</p>
          </div>
        )}

        {/* Contact Support Section */}
        <div className="mt-8 bg-gradient-to-br from-brand to-brand/80 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
           <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                 <Sparkles size={18} className="text-white/60" />
                 <span className="text-[10px] font-black uppercase tracking-[3px]">Still need help?</span>
              </div>
              <h3 className="text-2xl font-black mb-6 leading-tight">Our support team is<br/>here for you 24/7</h3>
              
              <div className="space-y-3">
                 <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => window.location.href = 'tel:8624939757'}
                      className="bg-white text-brand py-4 rounded-2xl font-black text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-black/10"
                    >
                       <Phone size={16} />
                       8624939757
                    </button>
                    <button 
                      onClick={() => window.location.href = 'mailto:Enquiry.dorcasaid@gmail.com'}
                      className="bg-white text-brand py-4 rounded-2xl font-black text-[13px] flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-black/10"
                    >
                       <Mail size={16} />
                       Email
                    </button>
                 </div>
              </div>
           </div>
        </div>
        <div className="mt-8 pb-12 flex justify-center">
           <p className="text-[10px] font-bold text-brand/20 uppercase tracking-widest">Dorcasaid App Version 1.0.0</p>
        </div>
      </div>
    </motion.div>
  );
}
