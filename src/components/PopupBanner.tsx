import { useState, useEffect } from "react";
import { X } from "lucide-react";
import popupImg from "@/assets/popup-banner.png";

const PopupBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if already dismissed in this session
    const dismissed = sessionStorage.getItem("popup_dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    sessionStorage.setItem("popup_dismissed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in-up">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative max-w-md w-full rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-foreground transition-colors"
          aria-label="Close popup"
        >
          <X className="w-5 h-5" />
        </button>
        <img src={popupImg} alt="Pal Classes - SSC Toppers - Admission Open" className="w-full h-auto" />
      </div>
    </div>
  );
};

export default PopupBanner;
