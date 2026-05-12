import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";

export default function Navbar() {
  const { language, setLanguage, t } = useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(13,13,13,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <SiyadahLogo />
          <span className="text-white font-semibold text-base tracking-tight">
            Siyadah AI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="text-xs font-medium px-3 py-1.5 rounded-md border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all duration-200"
            data-testid="button-language-toggle"
          >
            {language === "en" ? "عربي" : "EN"}
          </button>

          <button
            onClick={() => setLocation("/login")}
            className="text-sm font-medium px-4 py-1.5 rounded-md bg-white text-black hover:bg-white/90 transition-all duration-200"
            data-testid="button-signin"
          >
            {t("nav.signin")}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

function SiyadahLogo({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="white" fillOpacity="0.08" />
      <path
        d="M7 8.5C7 7.67 7.67 7 8.5 7h7C16.33 7 17 7.67 17 8.5v0C17 9.33 16.33 10 15.5 10h-4C10.67 10 10 10.67 10 11.5v1C10 13.33 10.67 14 11.5 14h4c.83 0 1.5.67 1.5 1.5v0c0 .83-.67 1.5-1.5 1.5h-7C7.67 17 7 16.33 7 15.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
