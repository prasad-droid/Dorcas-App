import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft, Shield, Upload, CheckCircle2, Clock,
  AlertCircle, Camera, FileText, ArrowRight,
  Info
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { API_BASE } from "../../../config";
import { useToast } from "../../../context/ToastContext";
import { ProfileSkeleton } from "../../ui/SkeletonScreen";

export function TechVerificationScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [kycStatus, setKycStatus] = useState("pending"); // pending, verified, rejected, not_submitted
  const [docType, setDocType] = useState("aadhar"); // aadhar, pan
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchKycStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const response = await fetch(`${API_BASE}/profile/get_profile.php`, {
          headers: { "Authorization": `Bearer ${token}`, "Role": role }
        });
        const data = await response.json();
        if (data.status) {
          const status = data.data.kyc_status || "not_submitted";
          setKycStatus(status);
        }
      } catch (error) {
        console.error("KYC status fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchKycStatus();
  }, [isAuthenticated]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("doc_type", docType);

      const response = await fetch(`${API_BASE}/profile/update_kyc.php`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Role": role
        },
        body: formData
      });

      const data = await response.json();

      if (data.status) {
        setKycStatus("pending");
        showToast("Documents uploaded successfully! We will review them shortly.", "success");
      } else {
        showToast(data.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col w-full h-full bg-base overflow-y-auto pb-24 remove-scrollbar"
    >
      {/* Brand Gradient Header */}
      <div className="brand-gradient pt-14 pb-5 px-5 rounded-b-[2.5rem] relative  shadow-lg">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10  flex items-center justify-between mb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md border border-white/10 shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1">ID Verification</h2>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Secure KYC Process</p>
          </div>
          <div className="w-11" />
        </div>
      </div>

      <div className="px-6 mt-6">
        {/* Status Card */}
        <div className={`bg-gray-100 rounded-3xl p-6 shadow-[0_10px_30px_rgba(13,110,253,0.08)] border-2  ${kycStatus === 'verified' ? 'border-2 border-emerald-600' :
          kycStatus === 'pending' ? 'border-2 border-amber-600' :
            kycStatus === 'rejected' ? 'border-2 border-red-600' :
              'border-2 border-brand-600'
          } mb-8`}>
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${kycStatus === 'verified' ? 'bg-emerald-50 text-emerald-500 border border-emerald-600' :
              kycStatus === 'pending' ? 'bg-amber-50 text-amber-500 border border-amber-600' :
                kycStatus === 'rejected' ? 'bg-red-50 text-red-500 border border-red-600' :
                  'bg-brand/5 text-brand border border-brand-600'
              }`}>
              {kycStatus === 'verified' ? <CheckCircle2 size={24} /> :
                kycStatus === 'pending' ? <Clock size={24} /> :
                  kycStatus === 'rejected' ? <AlertCircle size={24} /> :
                    <Shield size={24} />}
            </div>
            <div>
              <h3 className="font-black text-brand text-base leading-none mb-1.5">Verification Status</h3>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${kycStatus === 'verified' ? 'text-emerald-600' :
                kycStatus === 'pending' ? 'text-amber-600' :
                  kycStatus === 'rejected' ? 'text-red-600' :
                    'text-brand/40'
                }`}>
                {kycStatus.replace('_', ' ')}
              </p>
            </div>
          </div>
          <p className="text-xs text-brand/50 font-medium leading-relaxed italic">
            {kycStatus === 'verified' ? "Your account is fully verified. You have unlimited access to jobs." :
              kycStatus === 'pending' ? "We are currently reviewing your documents. This usually takes 24-48 hours." :
                kycStatus === 'rejected' ? "Your documents were rejected. Please upload clear images of valid IDs." :
                  "Please upload a valid government ID to verify your identity and start accepting jobs."}
          </p>
        </div>

        {kycStatus !== 'verified' && kycStatus !== 'pending' && (
          <div className="space-y-6">
            {/* Doc Type Selection */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-brand/30 uppercase tracking-[2px] px-1">Select Document Type</h4>
              <div className="grid grid-cols-2 gap-3">
                {['aadhar', 'pan'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setDocType(type)}
                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${docType === type ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20' : 'bg-white border-gray-900 text-brand'
                      }`}
                  >
                    <FileText size={20} />
                    <span className="text-xs font-bold capitalize">{type} Card</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-black text-brand/30 uppercase tracking-[2px] px-1">Upload Document Image</h4>
              <div className="relative group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={`w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all ${previewUrl ? 'border-brand/20 bg-brand/5' : 'border-brand/10 bg-white group-hover:border-brand/30'
                  }`}>
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-contain rounded-xl" alt="Preview" />
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-brand/5 rounded-full flex items-center justify-center text-brand mb-3">
                        <Camera size={24} />
                      </div>
                      <p className="text-sm font-bold text-brand">Click to Take Photo or Upload</p>
                      <p className="text-[10px] text-brand/40 font-medium mt-1">Clear photo of the front side</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50 flex gap-3">
              <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[11px] font-black text-blue-900 uppercase tracking-wider">Guidelines</p>
                <p className="text-[10px] text-blue-800/60 font-medium leading-relaxed">
                  Ensure all details are clearly visible. Avoid glare and blur. Only JPEG/PNG formats allowed.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={`w-full py-5 rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all ${!selectedFile || isUploading ? 'bg-gray-100 text-gray-400' : 'bg-brand text-white shadow-xl shadow-brand/20 active:scale-[0.98]'
                }`}
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Submit for Verification
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
