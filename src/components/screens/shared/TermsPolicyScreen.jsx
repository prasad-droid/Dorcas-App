import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Shield, FileText, Scale, Lock, CreditCard,
  UserCheck, Briefcase, Settings, AlertCircle, Eye,
  Database, Share2, ShieldCheck, Cookie, Info, Clock
} from "lucide-react";

export function TermsPolicyScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("terms");

  const termsSections = [
    {
      id: "general",
      title: "1. General Terms",
      icon: FileText,
      content: "Welcome to Dorcasaid (\"we\", \"our\", \"us\") — a home services platform connecting customers with verified local service vendors. By accessing or using our website, mobile application, or any related services, you agree to be bound by these Terms and Conditions. These terms apply to all users of the platform including customers, vendors/service providers, and administrators. Please read them carefully before using Dorcasaid. These Terms constitute a legally binding agreement. If you do not agree with any part, please discontinue use of the platform immediately."
    },
    {
      id: "acceptance",
      title: "2. Acceptance of Terms",
      icon: UserCheck,
      content: "By creating an account or using any part of the Dorcasaid platform, you confirm that:\n\n• You are at least 18 years of age or have parental consent.\n• You have read, understood, and agreed to these Terms & Conditions.\n• You agree to our Privacy Policy and Cookie Policy.\n• The information you provide during registration is accurate and up to date.\n• You will not use the platform for any unlawful or fraudulent purpose.\n\nDorcasaid reserves the right to update these terms at any time. Continued use after updates constitutes acceptance of the revised terms."
    },
    {
      id: "privacy_terms",
      title: "3. Privacy & Data",
      icon: Lock,
      content: "We collect and process personal data to provide, improve, and secure the Dorcasaid platform. By using our services, you consent to data collection as described in our Privacy Policy.\n\nData We Collect:\n• Name, phone number, email address, and location during registration.\n• Booking history, service preferences, and communication records.\n• KYC documents for vendors (Aadhaar, PAN, or equivalent government ID).\n• Payment and transaction data processed through secure gateways.\n• Device info, IP address, and usage analytics for platform security.\n\nDorcasaid does not sell your personal data to third parties. KYC documents are used solely for identity verification and are stored securely."
    },
    {
      id: "payments",
      title: "4. Payments & Refunds",
      icon: CreditCard,
      content: "All payments on Dorcasaid are processed through secure, PCI-compliant payment gateways (CCAvenue / Razorpay). By making a payment you agree to the following:\n\n• Service charges are displayed clearly before booking confirmation.\n• Refunds for cancellations made 24+ hours before the service date will be processed within 5–7 business days.\n• Cancellations made within 2 hours of the scheduled service may not be eligible for a refund.\n• Vendor commission dues must be paid within the specified due date to continue receiving new job requests.\n• Vendors with 2 or more unpaid dues may have their job request access suspended automatically.\n\nDorcasaid reserves the right to modify pricing structures and commission rates. Vendors will be notified of any changes at least 7 days in advance."
    },
    {
      id: "liability",
      title: "5. Limitation of Liability",
      icon: Scale,
      content: "Dorcasaid is a marketplace platform that connects customers with independent service vendors. We are not directly liable for the quality, safety, or outcomes of any service rendered by vendors.\n\n• Dorcasaid is not responsible for damages arising from vendor negligence or misconduct.\n• We do not guarantee continuous, uninterrupted access to the platform at all times.\n• Disputes between customers and vendors will be reviewed by our support team in good faith.\n• All vendors undergo KYC verification to ensure accountability and trust."
    },
    {
      id: "termination",
      title: "6. Account Termination",
      icon: AlertCircle,
      content: "Dorcasaid reserves the right to suspend or permanently terminate any account without prior notice for the following reasons:\n\n• Fraudulent, misleading, or deceptive activity on the platform.\n• Submitting false KYC documents or impersonating another individual.\n• Abusive, threatening, or inappropriate behaviour toward customers, vendors, or staff.\n• Persistent non-payment of vendor dues or chargebacks.\n• Violation of any section of these Terms & Conditions.\n\nUsers may also delete their own account by contacting our support team. Any pending dues or active bookings must be resolved before deletion."
    },
    {
      id: "customers",
      title: "7. Terms for Customers",
      icon: UserCheck,
      category: "Customer Agreement",
      content: "Booking & Scheduling:\n• Customers may book any available service listed on the platform subject to vendor availability in their area.\n• Booking confirmation is sent via SMS/email once a vendor accepts the request.\n• Customers must provide accurate address details including landmark and pincode for successful service delivery.\n• Customers must not book services for locations outside supported service areas.\n• Repeated no-show or last-minute cancellations may result in account restrictions.\n\nReviews & Ratings:\n• Customers are encouraged to leave honest, factual reviews after service completion.\n• Fake, defamatory, or incentivised reviews are strictly prohibited and may result in account suspension.\n\nCustomer Responsibilities:\n• Ensure a safe working environment for the visiting vendor.\n• Be present or arrange access at the scheduled service time.\n• Do not offer cash or off-platform payments to avoid platform fees — this violates platform policy."
    },
    {
      id: "vendors",
      title: "8. Terms for Vendors / Service Providers",
      icon: Briefcase,
      category: "Vendor Agreement",
      content: "KYC Verification (Mandatory):\n• All vendors must complete KYC verification with a valid government-issued ID before accepting any bookings.\n• Submitting forged or altered documents will result in immediate permanent ban and legal action.\n\nJob Acceptance & Conduct:\n• Job requests must be accepted or declined within the 5-minute window.\n• Vendors must maintain professional conduct and wear appropriate attire.\n• Vendors must not solicit customers for off-platform work.\n\nCommission & Payments:\n• A platform commission is charged per completed booking.\n• Commission invoices must be paid by the stated due date.\n• Vendors with 2+ unpaid dues will have job request access paused.\n\nService Quality:\n• Vendors are responsible for professional standard tools and materials.\n• Consistently low ratings may lead to temporary suspension."
    },
    {
      id: "admins",
      title: "9. Terms for Administrators",
      icon: Settings,
      category: "Admin Agreement",
      content: "Access & Authority:\n• Admin access is granted exclusively by Dorcasaid management and is non-transferable.\n• Admins must review vendor KYC submissions within 24 hours.\n\nData Responsibility:\n• Admins must handle all user data with strict confidentiality.\n• Exporting or misusing user data outside platform scope is strictly prohibited.\n\nPlatform Moderation:\n• Admins are empowered to suspend or reinstate accounts based on violations.\n• Misuse of administrative privileges will result in immediate termination."
    },
    {
      id: "disputes",
      title: "10. Dispute Resolution & Governing Law",
      icon: Scale,
      content: "Any disputes arising from the use of the Dorcasaid platform shall first be resolved through our internal support team. If unresolved, disputes shall be subject to:\n\n• Mediation through a mutually agreed third-party mediator before litigation.\n• Jurisdiction of courts located in Navi Mumbai, Maharashtra, India.\n• Applicable laws of India including the IT Act 2000, Consumer Protection Act 2019, and Indian Contract Act 1872.\n\nFor refund disputes, both parties must provide evidence within 48 hours of the disputed service."
    }
  ];

  const privacySections = [
    {
      id: "overview",
      title: "1. Overview",
      icon: Eye,
      content: "At Dorcasaid (\"we\", \"our\", \"us\"), your privacy is fundamental to everything we build. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our home services platform — whether you're a customer, vendor/service provider, or administrator.\n\nDorcasaid operates in compliance with the Information Technology Act, 2000, and applicable rules under India's data protection framework. By using our platform, you consent to the practices described in this policy."
    },
    {
      id: "collection",
      title: "2. Data We Collect",
      icon: Database,
      content: "We collect different types of data depending on your role:\n\n• Information You Provide Directly: Full name, email, phone number, address, and KYC documents (for vendors).\n• Information Collected Automatically: Device model, OS version, IP address, and GPS/location data (with your permission).\n• Information from Third Parties: Payment confirmation from gateways and KYC verification results."
    },
    {
      id: "usage",
      title: "3. How We Use Your Data",
      icon: ShieldCheck,
      content: "We use your data only for legitimate purposes:\n\n• Core Operations: Matching bookings, authenticating logins, and processing payments.\n• Safety & Compliance: Verifying vendor identity and preventing fraud.\n• Improvement: Analysing usage data to fix bugs and improve features.\n\nWe will NEVER sell your data to advertisers or share it with unaffiliated commercial entities."
    },
    {
      id: "sharing",
      title: "4. Data Sharing & Disclosure",
      icon: Share2,
      content: "We share data only as necessary:\n\n• With Vendors: Customer name, phone, and address are shared to fulfill bookings.\n• With Customers: Vendor name, photo, and rating are shared upon confirmation.\n• With Partners: Secure sharing with payment gateways (Razorpay) and KYC verification APIs.\n• Legal: Disclosure to authorities if legally required by a valid order."
    },
    {
      id: "retention",
      title: "5. Data Retention",
      icon: Clock,
      content: "• Account & profile data: Active + 2 years\n• Booking & transaction records: 7 years (Tax regulations)\n• KYC documents: Active + 3 years\n• Support logs: 2 years\n• Usage data: 12 months (Anonymised)"
    },
    {
      id: "security",
      title: "6. Data Security",
      icon: Lock,
      content: "We use industry-standard measures:\n\n• Encryption: All data is transmitted via TLS 1.2 / 1.3 (HTTPS).\n• Hashing: Passwords are hashed using bcrypt.\n• Gateway: Payment data is handled by PCI-DSS compliant gateways.\n• MFA: Admin access is protected by multi-factor authentication."
    },
    {
      id: "cookies",
      title: "7. Cookies & Tracking",
      icon: Cookie,
      content: "We use essential cookies for security and session management, and functional cookies for location preferences. You can control non-essential cookies through your browser settings."
    },
    {
      id: "rights",
      title: "8. Your Privacy Rights",
      icon: UserCheck,
      content: "You have the right to:\n\n• Access: Request a copy of your personal data.\n• Rectification: Correct inaccurate data in your profile.\n• Erasure: Request account deletion (subject to legal retention).\n• Portability: Download your data in machine-readable format.\n\nTo exercise these rights, email privacy@dorcasaid.com."
    },
    {
      id: "minors",
      title: "9. Children's Privacy",
      icon: Info,
      content: "Dorcasaid is not intended for use by individuals under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has registered, please contact support@dorcasaid.com."
    },
    {
      id: "kyc_privacy",
      title: "10. KYC Document Privacy",
      icon: ShieldCheck,
      content: "KYC documents are treated with the highest care:\n\n• Strictly confidential: Only authorised admin and verification partners can access them.\n• Verification only: Never shared for marketing or commercial purposes.\n• Retention: Post-deletion, documents are kept for 3 years per regulations."
    },
    {
      id: "updates",
      title: "11. Changes to Policy",
      icon: AlertCircle,
      content: "We may update this policy. Material changes will be notified via in-app alerts and email at least 7 days before taking effect. Continued use constitutes acceptance."
    }
  ];

  const currentSections = activeTab === "terms" ? termsSections : privacySections;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-[#f8fbff] overflow-hidden"
    >
      {/* Header */}
      <div className="bg-brand pt-14 pb-4 px-5 rounded-b-[2.5rem] shadow-sm relative overflow-hidden text-base flex flex-col">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-base/20 rounded-full flex items-center justify-center hover:bg-base/30 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-black tracking-tight">Terms & Policies</h2>
          <div className="w-10"></div>
        </div>

        {/* Tab Switcher */}
        <div className="relative z-10 bg-white/10 backdrop-blur-md p-1 rounded-2xl flex gap-1 mb-4">
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === "terms" ? "bg-white text-brand shadow-lg" : "text-white/60"}`}
          >
            Terms
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === "privacy" ? "bg-white text-brand shadow-lg" : "text-white/60"}`}
          >
            Privacy
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-6 pb-28 space-y-8 remove-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-[2rem] p-6 border border-gray-900 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-brand leading-none">
                    {activeTab === "terms" ? "Service Agreement" : "Privacy Commitment"}
                  </h3>
                  <p className="text-[10px] font-bold text-brand/40 uppercase tracking-wider mt-1">Version 1.2 • April 2026</p>
                </div>
              </div>
              <p className="text-[13px] font-semibold text-brand/60 leading-relaxed">
                {activeTab === "terms"
                  ? "Our terms of service define the relationship between Dorcasaid and our community members to ensure a professional experience."
                  : "Your privacy is our priority. We are committed to transparency and security in how we handle your personal information."}
              </p>
            </div>

            {currentSections.map((section, idx) => (
              <div key={section.id} className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-8 h-8 bg-brand/5 rounded-full flex items-center justify-center text-brand">
                    <section.icon size={16} />
                  </div>
                  <h4 className="text-[15px] font-black text-brand tracking-tight">{section.title}</h4>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-gray-900 shadow-sm">
                  {section.category && (
                    <div className="mb-4 inline-block bg-brand/5 px-3 py-1 rounded-full">
                      <span className="text-[10px] font-black text-brand uppercase tracking-wider">{section.category}</span>
                    </div>
                  )}
                  <div className="text-[13px] font-semibold text-brand/70 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
                {idx < currentSections.length - 1 && <div className="h-px bg-brand/5 mx-6" />}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="bg-brand/5 rounded-3xl p-8 text-center space-y-4">
          <h4 className="text-brand font-black">Need more clarification?</h4>
          <p className="text-xs font-semibold text-brand/50 leading-relaxed">
            We're here to help. Reach out to our legal compliance team for any queries.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.location.href = `mailto:${activeTab === 'terms' ? 'support@dorcasaid.com' : 'privacy@dorcasaid.com'}`}
              className="bg-brand text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-lg shadow-brand/20 active:scale-95 transition-transform"
            >
              Email {activeTab === 'terms' ? 'Support' : 'Privacy'} Team
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
