import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  English: {
    // Common
    save: "Save Changes",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    loading: "Loading...",
    
    // Bottom Nav
    home: "Home",
    bookings: "Bookings",
    rewards: "Rewards",
    profile: "Profile",
    jobs: "Jobs",
    earnings: "Earnings",

    // Profile Screen
    account_dashboard: "Account Dashboard",
    sign_out: "Sign Out safely",
    edit_profile: "Edit Profile",
    
    // Settings Screen
    settings: "Settings",
    identity: "Account & Identity",
    personal_info: "Personal Information",
    saved_addresses: "Saved Addresses",
    payment_methods: "Payment Methods",
    preferences: "Preferences",
    notifications: "Notifications",
    app_language: "App Language",
    privacy_permissions: "Privacy & Policies",
    support: "Support",
    help_support: "Help & Support",
    terms_policies: "Terms & Policies",
    danger_zone: "Danger Zone",
    delete_account: "Delete Account",
    
    // Modals
    select_language: "Select Language",
    notification_settings: "Notification Settings",
    booking_updates: "Booking Updates",
    offers_rewards: "Offers & Rewards",
    system_updates: "System Updates",
    yes_delete: "Yes, Delete Permanently",
    no_keep: "No, Keep My Account",
    delete_confirm: "This action is permanent and will erase all your history and wallet balance.",
    
    // Address Modal
    primary_address: "Primary Address",
    add_new_address: "Add New Address",
    
    // Payment Modal
    cod: "Cash on Delivery",
    default_payment: "Default Payment Method",
    add_payment: "Add Payment Method",

    // Home Screen
    current_location: "Current Location",
    search_placeholder: "Search for services...",
    available_balance: "Available Balance",
    book_reliable: "Book Reliable Home Services",
    popular_services: "Most Popular Services",
    see_all: "See All",
    special_offers: "Special Offers & Deals",
    browse_rated: "Browse Top Rated Services",
    claim_now: "Claim Now",
    
    // Bookings Screen
    my_bookings: "My Bookings",
    no_bookings: "No bookings found",
    book_now: "Book Now",
    status: "Status",
    date: "Date",
    time: "Time",
    
    // Rewards Screen
    my_rewards: "My Rewards",
    scratch_cards: "Scratch Cards",
    points_balance: "Points Balance",
    
    // Technician
    online: "Online",
    offline: "Offline",
    earnings_today: "Today's Earnings",
    total_jobs: "Total Jobs",
    active_jobs: "Active Jobs",
    avg_rating: "Avg Rating",
    acceptance_rate: "Acceptance Rate",
    completed_jobs: "Completed Jobs",
    missed_jobs: "Missed Jobs",
    verification_required: "Verification Required",
    pending_approval: "Pending Approval",
    start_kyc: "Start KYC Verification",
    kyc_desc: "Complete your KYC to unlock bookings and start earning.",
    waiting_jobs: "Waiting for new jobs...",
    waiting_desc: "We'll notify you when a request matches your profile",
    performance_overview: "Performance Overview",
    monthly_analytics: "Monthly Analytics",
    booking_history: "Booking History",
    accepted: "Accepted",
    missed: "Missed",
    top_services: "Top Services",
    recent_completed: "Recent Completed Jobs",
    recent_missed: "Recent Missed Requests",
    view_details: "View Details",
    view_accept: "View & Accept",
    ignore: "Ignore",
    
    // Rewards & Refer
    explore_services: "Explore Services",
    filter_sort: "Filter & Sort",
    refer_earn: "Refer & Earn",
    invite_friends: "Invite friends, get points",
    share_whatsapp: "Share via WhatsApp",
    lucky_reward: "Lucky Reward",
    scratch_to_reveal: "Scratch the card to reveal your prize",
    referral_copied: "Referral code copied!",
    redeem_wallet: "Redeem to Wallet",
    points: "Points",
    value: "Value",
    min_points_error: "Minimum 100 points required to redeem!",
    book_to_get_cards: "Book services to get scratch cards",
    pending: "Pending",
    all: "All",
    finding_services: "Finding best services...",
    apply_filters: "Apply Filters",
    claimed: "Claimed",
    available_redemption: "Available for redemption"
  },
  Hindi: {
    // Common
    save: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    back: "पीछे",
    loading: "लोड हो रहा है...",

    // Bottom Nav
    home: "होम",
    bookings: "बुकिंग",
    rewards: "पुरस्कार",
    profile: "प्रोफ़ाइल",
    jobs: "काम",
    earnings: "कमाई",

    // Profile Screen
    account_dashboard: "खाता डैशबोर्ड",
    sign_out: "सुरक्षित रूप से साइन आउट करें",
    edit_profile: "प्रोफ़ाइल संपादित करें",

    // Settings Screen
    settings: "सेटिंग्स",
    identity: "खाता और पहचान",
    personal_info: "व्यक्तिगत जानकारी",
    saved_addresses: "सहेजे गए पते",
    payment_methods: "भुगतान के तरीके",
    preferences: "प्राथमिकताएं",
    notifications: "सूचनाएं",
    app_language: "ऐप की भाषा",
    privacy_permissions: "गोपनीयता और नीतियां",
    support: "सहायता",
    help_support: "सहायता और समर्थन",
    terms_policies: "नियम और नीतियां",
    danger_zone: "खतरे का क्षेत्र",
    delete_account: "खाता हटाएं",

    // Modals
    select_language: "भाषा चुनें",
    notification_settings: "सूचना सेटिंग",
    booking_updates: "बुकिंग अपडेट",
    offers_rewards: "ऑफर और पुरस्कार",
    system_updates: "सिस्टम अपडेट",
    yes_delete: "हाँ, स्थायी रूप से हटाएं",
    no_keep: "नहीं, मेरा खाता रखें",
    delete_confirm: "यह कार्रवाई स्थायी है और आपके सभी इतिहास और वॉलेट बैलेंस को मिटा देगी।",

    // Address Modal
    primary_address: "प्राथमिक पता",
    add_new_address: "नया पता जोड़ें",

    // Payment Modal
    cod: "कैश ऑन डिलीवरी",
    default_payment: "डिफ़ॉल्ट भुगतान विधि",
    add_payment: "भुगतान विधि जोड़ें",

    // Home Screen
    current_location: "वर्तमान स्थान",
    search_placeholder: "सेवाएं खोजें...",
    available_balance: "उपलब्ध शेष राशि",
    book_reliable: "विश्वसनीय होम सेवाएं बुक करें",
    popular_services: "सबसे लोकप्रिय सेवाएं",
    see_all: "सभी देखें",
    special_offers: "विशेष ऑफर और सौदे",
    browse_rated: "टॉप रेटेड सेवाएं देखें",
    claim_now: "अभी दावा करें",

    // Bookings Screen
    my_bookings: "मेरी बुकिंग",
    no_bookings: "कोई बुकिंग नहीं मिली",
    book_now: "अभी बुक करें",
    status: "स्थिति",
    date: "दिनांक",
    time: "समय",

    // Rewards Screen
    my_rewards: "मेरे पुरस्कार",
    scratch_cards: "स्क्रैच कार्ड",
    points_balance: "पॉइंट्स बैलेंस",

    // Technician
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
    earnings_today: "आज की कमाई",
    total_jobs: "कुल काम",
    active_jobs: "सक्रिय काम",
    avg_rating: "औसत रेटिंग",
    acceptance_rate: "स्वीकृति दर",
    completed_jobs: "पूरे हुए काम",
    missed_jobs: "छूटे हुए काम",
    verification_required: "सत्यापन आवश्यक",
    pending_approval: "अनुमोदन लंबित",
    start_kyc: "KYC सत्यापन शुरू करें",
    kyc_desc: "बुकिंग शुरू करने और कमाई करने के लिए अपना KYC पूरा करें।",
    waiting_jobs: "नए कामों का इंतज़ार है...",
    waiting_desc: "जब कोई काम आपकी प्रोफ़ाइल से मेल खाएगा, तो हम आपको सूचित करेंगे",
    performance_overview: "प्रदर्शन अवलोकन",
    monthly_analytics: "मासिक विश्लेषण",
    booking_history: "बुकिंग इतिहास",
    accepted: "स्वीकार किया गया",
    missed: "छूटा",
    top_services: "शीर्ष सेवाएं",
    recent_completed: "हाल ही में पूरे हुए काम",
    recent_missed: "हाल ही में छूटे हुए अनुरोध",
    view_details: "विवरण देखें",
    view_accept: "देखें और स्वीकार करें",
    ignore: "अनदेखा करें",

    // Rewards & Refer
    explore_services: "सेवाएं खोजें",
    filter_sort: "फ़िल्टर और क्रमबद्ध करें",
    refer_earn: "रेफ़र करें और कमाएं",
    invite_friends: "मित्रों को आमंत्रित करें, अंक प्राप्त करें",
    share_whatsapp: "WhatsApp पर साझा करें",
    lucky_reward: "लकी रिवॉर्ड",
    scratch_to_reveal: "अपना इनाम देखने के लिए कार्ड स्क्रैच करें",
    referral_copied: "रेफ़रल कोड कॉपी किया गया!",
    redeem_wallet: "वॉलेट में रिडीम करें",
    points: "अंक",
    value: "मूल्य",
    min_points_error: "रिडीम करने के लिए न्यूनतम 100 अंक आवश्यक हैं!",
    book_to_get_cards: "स्क्रैच कार्ड प्राप्त करने के लिए सेवाएं बुक करें",
    pending: "लंबित",
    all: "सभी",
    finding_services: "सबसे अच्छी सेवाएं खोज रहे हैं...",
    apply_filters: "फ़िल्टर लागू करें",
    claimed: "दावा किया गया",
    available_redemption: "रिडेम्पशन के लिए उपलब्ध"
  },
  Marathi: {
    // Common
    save: "बदल जतन करा",
    cancel: "रद्द करा",
    confirm: "पुष्टी करा",
    back: "मागे",
    loading: "लोड होत आहे...",

    // Bottom Nav
    home: "होम",
    bookings: "बुकिंग",
    rewards: "बक्षिसे",
    profile: "प्रोफाइल",
    jobs: "कामे",
    earnings: "कमाई",

    // Profile Screen
    account_dashboard: "खाते डॅशबोर्ड",
    sign_out: "सुरक्षितपणे साइन आउट करा",
    edit_profile: "प्रोफाइल संपादित करा",

    // Settings Screen
    settings: "सेटिंग्ज",
    identity: "खाते आणि ओळख",
    personal_info: "वैयक्तिक माहिती",
    saved_addresses: "जतन केलेले पत्ते",
    payment_methods: "पेमेंट पद्धती",
    preferences: "पसंती",
    notifications: "सूचना",
    app_language: "अॅपची भाषा",
    privacy_permissions: "गोपनीयता आणि धोरणे",
    support: "सहकार्य",
    help_support: "मदत आणि सहकार्य",
    terms_policies: "अटी आणि धोरणे",
    danger_zone: "धोकादायक क्षेत्र",
    delete_account: "खाते हटवा",

    // Modals
    select_language: "भाषा निवडा",
    notification_settings: "सूचना सेटिंग्ज",
    booking_updates: "बुकिंग अपडेट्स",
    offers_rewards: "ऑफर आणि बक्षिसे",
    system_updates: "सिस्टम अपडेट्स",
    yes_delete: "होय, कायमचे हटवा",
    no_keep: "नाही, माझे खाते ठेवा",
    delete_confirm: "ही कृती कायमस्वरूपी आहे आणि आपला सर्व इतिहास आणि वॉलेट शिल्लक पुसून टाकेल.",

    // Address Modal
    primary_address: "प्राथमिक पत्ता",
    add_new_address: "नवीन पत्ता जोडा",

    // Payment Modal
    cod: "कॅश ऑन डिलिव्हरी",
    default_payment: "डीफॉल्ट पेमेंट पद्धत",
    add_payment: "पेमेंट पद्धत जोडा",

    // Home Screen
    current_location: "वर्तमान स्थान",
    search_placeholder: "सेवा शोधा...",
    available_balance: "उपलब्ध शिल्लक",
    book_reliable: "विश्वसनीय होम सेवा बुक करा",
    popular_services: "सर्वात लोकप्रिय सेवा",
    see_all: "सर्व पहा",
    special_offers: "विशेष ऑफर आणि सौदे",
    browse_rated: "टॉप रेटेड सेवा पहा",
    claim_now: "आत्ताच दावा करा",

    // Bookings Screen
    my_bookings: "माझ्या बुकिंग",
    no_bookings: "कोणतीही बुकिंग सापडली नाही",
    book_now: "आता बुक करा",
    status: "स्थिती",
    date: "दिनांक",
    time: "वेळ",

    // Rewards Screen
    my_rewards: "माझी बक्षिसे",
    scratch_cards: "स्क्रॅच कार्ड",
    points_balance: "पॉइंट्स बॅलन्स",

    // Technician
    online: "ऑनलाइन",
    offline: "ऑफलाइन",
    earnings_today: "आजची कमाई",
    total_jobs: "एकूण कामे",
    active_jobs: "सक्रिय कामे",
    avg_rating: "सरासरी रेटिंग",
    acceptance_rate: "स्वीकृती दर",
    completed_jobs: "पूर्ण झालेली कामे",
    missed_jobs: "सुटलेली कामे",
    verification_required: "पडताळणी आवश्यक",
    pending_approval: "मंजुरी प्रलंबित",
    start_kyc: "KYC पडताळणी सुरू करा",
    kyc_desc: "बुकिंग सुरू करण्यासाठी आणि कमाई करण्यासाठी तुमचे KYC पूर्ण करा.",
    waiting_jobs: "नवीन कामांची प्रतीक्षा आहे...",
    waiting_desc: "जेव्हा एखादे काम तुमच्या प्रोफाइलशी जुळेल तेव्हा आम्ही तुम्हाला सूचित करू",
    performance_overview: "कामगिरीचे विहंगावलोकन",
    monthly_analytics: "मासिक विश्लेषण",
    booking_history: "बुकिंग इतिहास",
    accepted: "स्वीकारले",
    missed: "सुटलेले",
    top_services: "टॉप सेवा",
    recent_completed: "अलीकडे पूर्ण झालेली कामे",
    recent_missed: "अलीकडे सुटलेले विनंत्या",
    view_details: "तपशील पहा",
    view_accept: "पहा आणि स्वीकारा",
    ignore: "दुर्लक्ष करा",

    // Rewards & Refer
    explore_services: "सेवा एक्सप्लोर करा",
    filter_sort: "फिल्टर आणि क्रमवारी लावा",
    refer_earn: "रेफर करा आणि कमवा",
    invite_friends: "मित्रांना आमंत्रित करा, पॉईंट्स मिळवा",
    share_whatsapp: "WhatsApp द्वारे शेअर करा",
    lucky_reward: "लकी रिवॉर्ड",
    scratch_to_reveal: "तुमचे बक्षीस पाहण्यासाठी कार्ड स्क्रॅच करा",
    scratch_to_reveal: "तुमचे बक्षीस पाहण्यासाठी कार्ड स्क्रैच करा",
    referral_copied: "रेफरल कोड कॉपी केला!",
    redeem_wallet: "वॉलेटमध्ये रिडीम करा",
    points: "पॉईंट्स",
    value: "मूल्य",
    min_points_error: "रिडीम करण्यासाठी किमान १०० पॉईंट्स आवश्यक आहेत!",
    book_to_get_cards: "स्क्रैच कार्ड मिळवण्यासाठी सेवा बुक करा",
    pending: "प्रलंबित",
    all: "सर्व",
    finding_services: "सर्वोत्तम सेवा शोधत आहे...",
    apply_filters: "फिल्टर लागू करा",
    claimed: "मिळालेले",
    available_redemption: "रिडेम्प्शनसाठी उपलब्ध"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app_language") || "English";
  });

  useEffect(() => {
    localStorage.setItem("app_language", language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
