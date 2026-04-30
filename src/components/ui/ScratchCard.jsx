import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Trophy } from "lucide-react";

export function ScratchCard({ cashback, onReveal, isScratched = false }) {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(isScratched);

  useEffect(() => {
    if (isScratched) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const width = canvas.width;
    const height = canvas.height;

    // Initial setup
    const initCanvas = () => {
      ctx.globalCompositeOperation = 'source-over';
      // Fill with silver gradient for premium look
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#ADB5BD');
      grad.addColorStop(0.5, '#CED4DA');
      grad.addColorStop(1, '#ADB5BD');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      
      // Add texture noise
      ctx.fillStyle = '#6C757D';
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 500; i++) {
         ctx.beginPath();
         ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 1.5, 0, Math.PI * 2);
         ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      
      // Text hint
      ctx.font = "bold 20px Inter, system-ui, sans-serif";
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SCRATCH HERE", width/2, height/2);
    };

    initCanvas();

    const checkReveal = () => {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      let transparentPixels = 0;
      
      // Check every 4th pixel for performance
      for (let i = 0; i < data.length; i += 16) {
        if (data[i + 3] < 150) transparentPixels += 4;
      }
      
      const p = (transparentPixels / (width * height)) * 100;
      if (p > 50 && !revealed) {
        setRevealed(true);
        ctx.clearRect(0, 0, width, height);
        if (onReveal) onReveal();
      }
    };

    const scratch = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      // Map CSS coordinates to canvas internal coordinates
      const x = (clientX - rect.left) * (width / rect.width);
      const y = (clientY - rect.top) * (height / rect.height);
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Use requestAnimationFrame to avoid blocking the UI thread
      requestAnimationFrame(checkReveal);
    };

    let isDrawing = false;

    const handleStart = (e) => {
      isDrawing = true;
      const point = e.touches ? e.touches[0] : e;
      scratch(point.clientX, point.clientY);
    };

    const handleMove = (e) => {
      if (!isDrawing) return;
      if (e.cancelable) e.preventDefault();
      const point = e.touches ? e.touches[0] : e;
      scratch(point.clientX, point.clientY);
    };

    const handleEnd = () => {
      isDrawing = false;
    };

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('touchstart', handleStart);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    
    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('touchstart', handleStart);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isScratched, onReveal, revealed]);

  return (
    <div className="relative w-full aspect-[4/3] bg-white rounded-3xl shadow-xl overflow-hidden">
       {/* Prize Underneath */}
       <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-brand/5 to-brand/10 p-4">
          <Trophy size={40} className="text-amber-500 mb-2 drop-shadow-lg" />
          <p className="text-[10px] font-black text-brand/40 uppercase tracking-widest">You Won</p>
          <h4 className="text-3xl font-black text-brand tracking-tighter">₹{cashback}</h4>
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mt-1">Reward Points</p>
       </div>

       {/* Scratch Layer */}
       {!isScratched && (
         <canvas 
          ref={canvasRef} 
          width={300} 
          height={225} 
          className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-500 ${revealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
         />
       )}
       
       {revealed && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3 right-3 p-1.5 bg-emerald-500 rounded-full text-white shadow-lg z-20"
          >
             <Check size={14} strokeWidth={4} />
          </motion.div>
       )}
    </div>
  );
}
