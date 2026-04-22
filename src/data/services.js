import { 
  Car, Truck, Scissors, Package, Music, Camera, PartyPopper, 
  ChefHat, Bug, Wind, Tv, Sparkles, HeartPulse, Wrench, 
  FileSignature, Laptop, LayoutGrid 
} from "lucide-react";

export const mainCategories = [
  { id: 1, name: "Appliance", icon: Tv },
  { id: 2, name: "AC Services", icon: Wind },
  { id: 3, name: "Salon", icon: Scissors },
  { id: 4, name: "Cleaning", icon: Sparkles },
  { id: 5, name: "Home Repair", icon: Wrench },
  { id: 6, name: "Packing & Movers", icon: Package },
  { id: 7, name: "IT Service", icon: Laptop },
  { id: 8, name: "Home Health Care", icon: HeartPulse },
  { id: 9, name: "Legal & Doc.", icon: FileSignature },
  { id: 10, name: "Event & Party", icon: PartyPopper },
  { id: 11, name: "Other Services", icon: LayoutGrid },
];

export const categoryDetails = {
  "Appliance": [
    { id: 101, name: "Refrigerator Repair", price: "₹299", desc: "Expert check-up for cooling issues. 10% off on spares.", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=400&auto=format&fit=crop", icon: Tv },
    { id: 102, name: "Washing Machine", price: "₹299", desc: "Front load & top load service. Fast repair.", image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=400&auto=format&fit=crop", icon: Tv },
    { id: 103, name: "TV Mounting", price: "₹499", desc: "Professional wall bracket installation for all sizes.", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=400&auto=format&fit=crop", icon: Tv },
    { id: 104, name: "Microwave Service", price: "₹249", desc: "Fix heating and panel issues quickly.", image: "https://images.unsplash.com/photo-1585659722983-39cb86601f56?q=80&w=400&auto=format&fit=crop", icon: Tv }
  ],
  "AC Services": [
    { id: 201, name: "AC Check-up & Clean", price: "₹399", desc: "Deep filter cleaning & cooling coil check.", image: "https://images.unsplash.com/photo-1620888200632-475aeb7bc671?q=80&w=400&auto=format&fit=crop", icon: Wind },
    { id: 202, name: "Split AC Gas Refill", price: "₹1,499", desc: "Improve cooling instantly. Includes leak testing.", image: "https://images.unsplash.com/photo-1595844730298-b960fa25e9e3?q=80&w=400&auto=format&fit=crop", icon: Wind },
    { id: 203, name: "AC Installation", price: "₹999", desc: "Drilling, wiring, and standard window/split mounting.", image: "https://images.unsplash.com/photo-1558227691-81d3f9af58ed?q=80&w=400&auto=format&fit=crop", icon: Wind }
  ],
  "Salon": [
    { id: 301, name: "Men's Haircut", price: "₹199", desc: "Premium styling & beard trim at your convenience.", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop", icon: Scissors },
    { id: 302, name: "Spa & Massage", price: "₹999", desc: "Relaxing deep tissue therapy. 20% off today!", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=400&auto=format&fit=crop", icon: Sparkles },
    { id: 303, name: "Pedicure & Manicure", price: "₹499", desc: "Complete nail care and cleansing package.", image: "https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=400&auto=format&fit=crop", icon: Sparkles }
  ],
  "Cleaning": [
    { id: 401, name: "Home Deep Cleaning", price: "₹2,499", desc: "Get 20% Off Our Best Services Today", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop", icon: Sparkles },
    { id: 402, name: "Bathroom Cleaning", price: "₹399", desc: "Sparkling bathrooms, enjoy 20% off today!", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop", icon: Sparkles },
    { id: 403, name: "Sofa & Carpet Clean", price: "₹499", desc: "Fresh sofas, carpets — get 15% off!", image: "https://images.unsplash.com/photo-1524316666579-22aee539cdd9?q=80&w=400&auto=format&fit=crop", icon: Sparkles },
    { id: 404, name: "Kitchen Cleaning", price: "₹899", desc: "Stain-free counters and chimneys, heavy grease removal.", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400&auto=format&fit=crop", icon: Sparkles }
  ],
  "Home Repair": [
    { id: 501, name: "Electrician Visit", price: "₹149", desc: "Fix switches, sockets, and complex house wiring.", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=400&auto=format&fit=crop", icon: Wrench },
    { id: 502, name: "Plumbing Troubleshoot", price: "₹149", desc: "Leak fixes, tap repair, and pipe unclogging.", image: "https://images.unsplash.com/photo-1607584107198-d1eeebafe86e?q=80&w=400&auto=format&fit=crop", icon: Wrench },
    { id: 503, name: "Carpenter Work", price: "₹199", desc: "Cabinet hinges, door lock fixing, and woodwork.", image: "https://images.unsplash.com/photo-1533621430040-cde4a706be22?q=80&w=400&auto=format&fit=crop", icon: Wrench }
  ],
  "Packing & Movers": [
    { id: 601, name: "1 BHK Shifting", price: "₹3,999", desc: "Complete home packing and safe transport.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop", icon: Package },
    { id: 602, name: "Office Relocation", price: "₹5,999", desc: "Careful movement of IT equipments & furniture.", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=400&auto=format&fit=crop", icon: Truck }
  ],
  "IT Service": [
    { id: 701, name: "Laptop/PC Repair", price: "₹399", desc: "Hardware checkups, OS installs, battery replacements.", image: "https://images.unsplash.com/photo-1597872253359-f9d4b54a5c65?q=80&w=400&auto=format&fit=crop", icon: Laptop },
    { id: 702, name: "Wi-Fi & Networking", price: "₹299", desc: "Router setup, range extender, and speed issues.", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=400&auto=format&fit=crop", icon: Laptop }
  ],
  "Home Health Care": [
    { id: 801, name: "Physiotherapy Session", price: "₹599", desc: "Pain relief and mobility therapy at your home.", image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400&auto=format&fit=crop", icon: HeartPulse },
    { id: 802, name: "Nurse / Caregiver", price: "₹999", desc: "Professional nursing assistance for elders.", image: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=400&auto=format&fit=crop", icon: HeartPulse }
  ],
  "Legal & Doc.": [
    { id: 901, name: "Rent Agreement", price: "₹399", desc: "Drafting and quick stamping delivered home.", image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=400&auto=format&fit=crop", icon: FileSignature },
    { id: 902, name: "Notary Services", price: "₹299", desc: "Authorized affidavits and declarations.", image: "https://images.unsplash.com/photo-1450101499163-c8848c66cb85?q=80&w=400&auto=format&fit=crop", icon: FileSignature }
  ],
  "Event & Party": [
    { id: 1001, name: "Event Photography", price: "₹4,999", desc: "Capture your best moments. Full day coverage.", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=400&auto=format&fit=crop", icon: Camera },
    { id: 1002, name: "Birthday Party DJ", price: "₹2,999", desc: "High energy music, lights, and booming speakers.", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop", icon: Music },
    { id: 1003, name: "Catering (50 Pax)", price: "₹8,999", desc: "Delicious customized multi-course menus.", image: "https://images.unsplash.com/photo-1555244162-803834f875af?q=80&w=400&auto=format&fit=crop", icon: ChefHat }
  ],
  "Other Services": [
    { id: 1101, name: "Personal Driver", price: "₹699", desc: "Hire top-rated drivers for your daily commute.", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=400&auto=format&fit=crop", icon: Car },
    { id: 1102, name: "Key Maker", price: "₹299", desc: "Locked out? Urgent locksmith at your door.", image: "https://images.unsplash.com/photo-1582136015694-8186178c54de?q=80&w=400&auto=format&fit=crop", icon: Wrench },
    { id: 1103, name: "Pest Control", price: "₹899", desc: "Effective eradication of insects and termites.", image: "https://images.unsplash.com/photo-1587840131464-52643a0e6988?q=80&w=400&auto=format&fit=crop", icon: Bug }
  ]
};
