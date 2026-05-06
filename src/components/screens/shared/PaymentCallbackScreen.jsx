import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, ChevronRight, Loader2 } from "lucide-react";

export function PaymentCallbackScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  
  useEffect(() => {
    const paymentStatus = searchParams.get("status");
    if (paymentStatus === "Success") {
      setStatus("success");
    } else if (paymentStatus === "Aborted" || paymentStatus === "Failure") {
      setStatus("error");
    } else {
      setStatus("error");
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-base">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-xl text-center space-y-6"
      >
        {status === "processing" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-brand animate-spin" />
            </div>
            <h2 className="text-2xl font-black text-brand">Processing Payment</h2>
            <p className="text-brand/50 font-medium">Please wait while we verify your transaction...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={48} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-brand">Payment Successful!</h2>
            <p className="text-brand/50 font-medium">Your commission dues have been cleared successfully.</p>
            <button 
              onClick={() => navigate("/tech/commissions")}
              className="w-full py-4 bg-brand text-white rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Back to Commissions
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                <XCircle size={48} />
              </div>
            </div>
            <h2 className="text-2xl font-black text-brand">Payment Failed</h2>
            <p className="text-brand/50 font-medium">Something went wrong with the transaction. Please try again.</p>
            <button 
              onClick={() => navigate("/tech/commissions")}
              className="w-full py-4 bg-brand text-white rounded-2xl font-black flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Try Again
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
