import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const LanguageContext = createContext();

/*
==================================================
SUPPORTED LANGUAGES
==================================================
*/

export const languages = ["English", "Hindi", "Marathi"];

/*
==================================================
TRANSLATIONS
==================================================
*/

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

    // Profile
    account_dashboard: "Account Dashboard",
    sign_out: "Sign Out Safely",
    edit_profile: "Edit Profile",

    // Settings
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

    delete_confirm:
      "This action is permanent and will erase all your history and wallet balance.",

    // Address
    primary_address: "Primary Address",
    add_new_address: "Add New Address",

    // Payment
    cod: "Cash on Delivery",
    default_payment: "Default Payment Method",
    add_payment: "Add Payment Method",

    // Home
    current_location: "Current Location",
    search_placeholder: "Search for services...",
    available_balance: "Available Balance",
    book_reliable: "Book Reliable Home Services",
    popular_services: "Most Popular Services",
    see_all: "See All",
    special_offers: "Special Offers & Deals",
    browse_rated: "Browse Top Rated Services",
    claim_now: "Claim Now",

    // Bookings
    my_bookings: "My Bookings",
    no_bookings: "No bookings found",
    no_bookings_desc:
      "When you book a service, your booking history will appear here.",

    book_now: "Book Now",
    status: "Status",
    date: "Date",
    time: "Time",

    // Rewards
    my_rewards: "My Rewards",
    scratch_cards: "Scratch Cards",
    points_balance: "Points Balance",

    // Technician
    online: "Online",
    offline: "Offline",
    earnings_today: "Today's Earnings",
    total_jobs: "Total Jobs",
    active_jobs: "Active Jobs",
    avg_rating: "Average Rating",
    acceptance_rate: "Acceptance Rate",
    completed_jobs: "Completed Jobs",
    missed_jobs: "Missed Jobs",

    verification_required: "Verification Required",
    pending_approval: "Pending Approval",

    start_kyc: "Start KYC Verification",

    kyc_desc:
      "Complete your KYC verification to unlock bookings and start earning.",

    waiting_jobs: "Waiting for new jobs...",
    waiting_desc:
      "We’ll notify you when a request matches your profile.",

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
    invite_friends: "Invite friends and earn points",

    share_whatsapp: "Share via WhatsApp",

    lucky_reward: "Lucky Reward",

    scratch_to_reveal:
      "Scratch the card to reveal your reward.",

    referral_copied: "Referral code copied successfully!",

    redeem_wallet: "Redeem to Wallet",

    points: "Points",
    value: "Value",

    min_points_error:
      "Minimum 100 points are required for redemption.",

    book_to_get_cards:
      "Book services to receive scratch cards.",

    pending: "Pending",
    all: "All",

    finding_services: "Finding the best services...",
    apply_filters: "Apply Filters",

    claimed: "Claimed",

    available_redemption: "Available for redemption",

    finding_experts: "Finding experts...",

    no_providers_found:
      "No providers found for this service.",

    no_providers_desc:
      "We are expanding! Please check again soon for professionals in your area.",

    search_in: "Search In",

    recommended: "Recommended First",
    price_low: "Price: Low to High",
    price_high: "Price: High to Low",
    highest_rated: "Highest Rated",
    most_reviewed: "Most Reviewed",

    sort_filter: "Sort & Filter",

    // Booking Form
    full_name: "Full Name",
    mobile_number: "Mobile Number",

    service_location: "Service Location",

    use_current_location: "Use Current Location",

    city: "City",
    pincode: "Pincode",

    service_date: "Service Date",
    preferred_time: "Preferred Time",

    special_instructions: "Special Instructions",

    payment_mode: "Payment Mode",

    pay_after_service: "Pay After Service",

    confirm_booking: "Confirm Booking",

    booking_confirmed: "Booking Confirmed!",

    total_amount: "Total Amount",

    rate_service: "Rate Service",

    cancel_booking: "Cancel Booking",

    payout_locked: "Payout Locked",

    payout_locked_desc:
      "Complete at least 3 scratch cards to unlock payout requests.",

    enter_upi: "Enter UPI ID for payout",

    upi_placeholder: "example@upi",

    request_payout: "Request Payout",

    payout_requested:
      "Payout request sent successfully to admin.",

    payout_min_cards:
      "At least 3 scratched cards are required for redemption.",

    upi_required: "Please enter a valid UPI ID.",
  },

  Hindi: {
    // Common
    save: "परिवर्तन सहेजें",
    cancel: "रद्द करें",
    confirm: "पुष्टि करें",
    back: "वापस",
    loading: "लोड हो रहा है...",

    // Bottom Nav
    home: "होम",
    bookings: "बुकिंग",
    rewards: "रिवॉर्ड्स",
    profile: "प्रोफाइल",
    jobs: "काम",
    earnings: "कमाई",

    // Profile
    account_dashboard: "अकाउंट डैशबोर्ड",
    sign_out: "सुरक्षित रूप से साइन आउट करें",
    edit_profile: "प्रोफाइल संपादित करें",

    // Settings
    settings: "सेटिंग्स",
    identity: "अकाउंट और पहचान",
    personal_info: "व्यक्तिगत जानकारी",
    saved_addresses: "सहेजे गए पते",
    payment_methods: "भुगतान के तरीके",
    preferences: "पसंद",
    notifications: "सूचनाएं",
    app_language: "ऐप भाषा",
    privacy_permissions: "गोपनीयता और नीतियां",
    support: "सहायता",
    help_support: "मदद और सहायता",
    terms_policies: "नियम और नीतियां",
    danger_zone: "खतरे का क्षेत्र",
    delete_account: "अकाउंट हटाएं",

    // Modals
    select_language: "भाषा चुनें",

    notification_settings: "सूचना सेटिंग्स",

    booking_updates: "बुकिंग अपडेट",

    offers_rewards: "ऑफर और रिवॉर्ड्स",

    system_updates: "सिस्टम अपडेट",

    yes_delete: "हाँ, हमेशा के लिए हटाएं",

    no_keep: "नहीं, मेरा अकाउंट रखें",

    delete_confirm:
      "यह प्रक्रिया स्थायी है और आपका पूरा इतिहास और वॉलेट बैलेंस हटा देगी।",

    // Address
    primary_address: "मुख्य पता",

    add_new_address: "नया पता जोड़ें",

    // Payment
    cod: "कैश ऑन डिलीवरी",

    default_payment: "डिफॉल्ट भुगतान तरीका",

    add_payment: "भुगतान तरीका जोड़ें",

    // Home
    current_location: "वर्तमान स्थान",

    search_placeholder: "सेवाएं खोजें...",

    available_balance: "उपलब्ध बैलेंस",

    book_reliable: "विश्वसनीय होम सेवाएं बुक करें",

    popular_services: "लोकप्रिय सेवाएं",

    see_all: "सभी देखें",

    special_offers: "विशेष ऑफर और डील्स",

    browse_rated: "टॉप रेटेड सेवाएं देखें",

    claim_now: "अभी प्राप्त करें",

    // Bookings
    my_bookings: "मेरी बुकिंग",

    no_bookings: "कोई बुकिंग नहीं मिली",

    no_bookings_desc:
      "जब आप कोई सेवा बुक करेंगे, आपकी बुकिंग हिस्ट्री यहां दिखाई देगी।",

    book_now: "अभी बुक करें",

    status: "स्थिति",

    date: "तारीख",

    time: "समय",

    // Rewards
    my_rewards: "मेरे रिवॉर्ड्स",

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

    completed_jobs: "पूर्ण किए गए काम",

    missed_jobs: "छूटे हुए काम",

    verification_required: "सत्यापन आवश्यक",

    pending_approval: "अनुमोदन लंबित",

    start_kyc: "KYC सत्यापन शुरू करें",

    kyc_desc:
      "बुकिंग और कमाई शुरू करने के लिए अपना KYC पूरा करें।",

    waiting_jobs: "नए कामों का इंतजार है...",

    waiting_desc:
      "जब कोई काम आपकी प्रोफाइल से मेल खाएगा, हम आपको सूचित करेंगे।",

    performance_overview: "प्रदर्शन अवलोकन",

    monthly_analytics: "मासिक विश्लेषण",

    booking_history: "बुकिंग इतिहास",

    accepted: "स्वीकृत",

    missed: "छूटा",

    top_services: "टॉप सेवाएं",

    recent_completed: "हाल ही में पूरे हुए काम",

    recent_missed: "हाल ही में छूटे अनुरोध",

    view_details: "विवरण देखें",

    view_accept: "देखें और स्वीकार करें",

    ignore: "अनदेखा करें",
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

    // Profile
    account_dashboard: "खाते डॅशबोर्ड",

    sign_out: "सुरक्षितपणे साइन आउट करा",

    edit_profile: "प्रोफाइल संपादित करा",

    // Settings
    settings: "सेटिंग्ज",

    identity: "खाते आणि ओळख",

    personal_info: "वैयक्तिक माहिती",

    saved_addresses: "जतन केलेले पत्ते",

    payment_methods: "पेमेंट पद्धती",

    preferences: "पसंती",

    notifications: "सूचना",

    app_language: "अॅप भाषा",

    privacy_permissions: "गोपनीयता आणि धोरणे",

    support: "सहकार्य",

    help_support: "मदत आणि सहकार्य",

    terms_policies: "अटी आणि धोरणे",

    danger_zone: "धोक्याचा विभाग",

    delete_account: "खाते हटवा",

    // Modals
    select_language: "भाषा निवडा",

    notification_settings: "सूचना सेटिंग्ज",

    booking_updates: "बुकिंग अपडेट्स",

    offers_rewards: "ऑफर आणि बक्षिसे",

    system_updates: "सिस्टम अपडेट्स",

    yes_delete: "होय, कायमचे हटवा",

    no_keep: "नाही, माझे खाते ठेवा",

    delete_confirm:
      "ही कृती कायमस्वरूपी आहे आणि तुमचा सर्व इतिहास व वॉलेट शिल्लक हटवेल।",

    // Home
    current_location: "सध्याचे स्थान",

    search_placeholder: "सेवा शोधा...",

    available_balance: "उपलब्ध शिल्लक",

    book_reliable: "विश्वासार्ह होम सेवा बुक करा",

    popular_services: "सर्वाधिक लोकप्रिय सेवा",

    see_all: "सर्व पहा",

    special_offers: "विशेष ऑफर आणि डील्स",

    browse_rated:
      "सर्वोत्तम रेटिंग असलेल्या सेवा पहा",

    claim_now: "आत्ताच मिळवा",

    // Rewards
    refer_earn: "रेफर करा आणि कमवा",

    invite_friends:
      "मित्रांना आमंत्रित करा आणि पॉइंट्स मिळवा",

    lucky_reward: "लकी रिवॉर्ड",

    scratch_to_reveal:
      "तुमचे बक्षीस पाहण्यासाठी कार्ड स्क्रॅच करा",

    referral_copied:
      "रेफरल कोड यशस्वीरित्या कॉपी झाला!",

    redeem_wallet: "वॉलेटमध्ये रिडीम करा",

    claimed: "मिळाले",

    // Booking
    booking_confirmed:
      "बुकिंग यशस्वीरित्या पूर्ण झाली!",

    no_bookings:
      "कोणतीही बुकिंग आढळली नाही",

    no_bookings_desc:
      "तुम्ही सेवा बुक केल्यानंतर तुमचा इतिहास येथे दिसेल।",

    payout_locked: "पेआउट लॉक आहे",

    payout_locked_desc:
      "पेआउट अनलॉक करण्यासाठी किमान 3 स्क्रॅच कार्ड पूर्ण करा.",

    enter_upi:
      "पेआउटसाठी UPI आयडी टाका",

    request_payout:
      "पेआउट विनंती पाठवा",

    payout_requested:
      "पेआउट विनंती यशस्वीरित्या पाठवली गेली आहे!",

    upi_required:
      "कृपया वैध UPI आयडी प्रविष्ट करा.",
  },
};

/*
==================================================
LANGUAGE PROVIDER
==================================================
*/

export const LanguageProvider = ({ children }) => {
  /*
  ==============================================
  SAFE DEFAULT LANGUAGE
  ==============================================
  */

  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("app_language");

    return translations[savedLanguage]
      ? savedLanguage
      : "English";
  });

  /*
  ==============================================
  SAVE LANGUAGE
  ==============================================
  */

  useEffect(() => {
    localStorage.setItem("app_language", language);
  }, [language]);

  /*
  ==============================================
  TRANSLATION FUNCTION
  ==============================================
  */

  const t = useCallback(
    (key) => {
      return translations[language]?.[key] || key;
    },
    [language]
  );

  /*
  ==============================================
  PROVIDER
  ==============================================
  */

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

/*
==================================================
CUSTOM HOOK
==================================================
*/

export const useLanguage = () => {
  return useContext(LanguageContext);
};