import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const slides = [
  {
    title: "Happiness Starts with a Clean Space",
    desc: "Happiness truly starts with a clean space where you can relax, breathe easily, and feel at peace.",
    image: "/onboarding/clean_space.png"
  },
  {
    title: "Choose a Service",
    desc: "Select from a wide range of top-rated home services tailored to your everyday needs.",
    image: "/onboarding/services.png"
  },
  {
    title: "Schedule Your Slot",
    desc: "Pick a date & time that suits you. We work entirely around your schedule.",
    image: "/onboarding/schedule.png"
  },
  {
    title: "Verified Technician Arrives",
    desc: "Skilled, verified experts reach your doorstep perfectly on time and fully equipped.",
    image: "/onboarding/technician.png"
  },
  {
    title: "Relax & Pay Securely",
    desc: "Pay online or after service completion with seamless and highly secure options.",
    image: "/onboarding/payment.png"
  }
];

export function OnboardingScreen({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex === slides.length - 1) {
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <motion.div
      key="onboarding"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="absolute inset-0 z-[1500] bg-base flex flex-col overflow-hidden"
    >
      {/* Image Container with Fade Transition */}
      <div className="relative flex-1 w-full flex justify-center items-end overflow-hidden pt-12">
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-base via-base/90 to-transparent z-10"></div>
        
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentIndex}
            src={slides[currentIndex].image}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover object-top max-h-[60vh] sm:max-h-[500px]" 
          />
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="relative z-20 px-8 pb-10 pt-2 flex flex-col bg-base">
        
        {/* Pagination Dots */}
        <div className="flex gap-2 justify-center mb-6">
          {slides.map((_, i) => (
            <div 
               key={i} 
               className={`h-[6px] rounded-full transition-all duration-300 ${i === currentIndex ? 'w-6 bg-brand' : 'w-[6px] bg-brand/20'}`}
            />
          ))}
        </div>

        {/* Text Transition */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-[28px] sm:text-[32px] font-bold tracking-tight text-gray-900 mb-4 leading-[1.15] text-center">
              {slides[currentIndex].title}
            </h1>
            <p className="text-gray-500 text-[15px] font-medium leading-relaxed mb-10 text-center px-2">
              {slides[currentIndex].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 items-center w-full">
          {currentIndex > 0 && (
            <button 
              onClick={prevSlide}
              className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-transform"
            >
              <ChevronLeft className="text-brand" size={24} strokeWidth={2.5} />
            </button>
          )}
          
          <button 
            onClick={nextSlide}
            className="flex-1 h-14 rounded-2xl bg-brand font-bold text-white text-[17px] shadow-lg shadow-brand/20 active:scale-[0.98] transition-transform"
          >
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
