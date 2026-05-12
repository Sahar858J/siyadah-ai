import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { saveSession, getSession } from "@/lib/auth";

export default function LoginPage() {
  const { t, language, setLanguage } = useAppContext();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getSession()) {
      setLocation("/chat");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(language === "ar" ? "يرجى ملء جميع الحقول." : "Please fill in all fields.");
      return;
    }
    if (!email.includes("@")) {
      setError(language === "ar" ? "يرجى إدخال بريد إلكتروني صحيح." : "Please enter a valid email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      saveSession(email);
      setLocation("/chat");
    }, 800);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      saveSession("user@google.com");
      setLocation("/chat");
    }, 800);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0D0D0D" }}>
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 grid-texture" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 65%)",
          }}
        />
        <div className="absolute inset-0 vignette" />

        {/* Floating geometric shapes */}
        {[
          { w: 120, h: 120, x: "15%", y: "20%", delay: 0 },
          { w: 60, h: 60, x: "70%", y: "60%", delay: 1 },
          { w: 80, h: 80, x: "30%", y: "70%", delay: 0.5 },
        ].map((shape, i) => (
          <motion.div
            key={i}
            className="absolute rounded-xl"
            style={{
              width: shape.w,
              height: shape.h,
              left: shape.x,
              top: shape.y,
              border: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.02)",
            }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: shape.delay, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="7" fill="white" fillOpacity="0.08" />
                <path
                  d="M7 8.5C7 7.67 7.67 7 8.5 7h7C16.33 7 17 7.67 17 8.5v0C17 9.33 16.33 10 15.5 10h-4C10.67 10 10 10.67 10 11.5v1C10 13.33 10.67 14 11.5 14h4c.83 0 1.5.67 1.5 1.5v0c0 .83-.67 1.5-1.5 1.5h-7C7.67 17 7 16.33 7 15.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-white font-semibold text-lg">Siyadah AI</span>
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              {language === "ar" ? "نظامك الذكي\nلإدارة الأعمال" : "Your AI\nOperating System"}
            </h1>
            <p className="text-white/40 text-base leading-relaxed max-w-sm">
              {language === "ar"
                ? "أتمت، حلّل، وابنِ باستخدام قوة عاملة من الذكاء الاصطناعي."
                : "Automate, analyze, and build with an AI workforce that never sleeps."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Language toggle */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="text-xs font-medium px-3 py-1.5 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all duration-200"
          >
            {language === "en" ? "عربي" : "EN"}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="6" fill="white" fillOpacity="0.08" />
              <path
                d="M7 8.5C7 7.67 7.67 7 8.5 7h7C16.33 7 17 7.67 17 8.5v0C17 9.33 16.33 10 15.5 10h-4C10.67 10 10 10.67 10 11.5v1C10 13.33 10.67 14 11.5 14h4c.83 0 1.5.67 1.5 1.5v0c0 .83-.67 1.5-1.5 1.5h-7C7.67 17 7 16.33 7 15.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-white font-semibold">Siyadah AI</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-1">{t("login.title")}</h2>
          <p className="text-white/40 text-sm mb-8">{t("login.subtitle")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-white/50 text-xs mb-1.5 block">{t("login.email")}</label>
              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                data-testid="input-email"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                whileFocus={{
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.2)",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              />
            </div>

            <div>
              <label className="text-white/50 text-xs mb-1.5 block">{t("login.password")}</label>
              <motion.input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                data-testid="input-password"
                className="w-full rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-white/20 outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                whileFocus={{
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.2)",
                  borderColor: "rgba(255,255,255,0.2)",
                }}
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              data-testid="button-signin"
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-black bg-white hover:bg-white/90 transition-all duration-200 disabled:opacity-50 mt-1"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? (language === "ar" ? "جاري الدخول..." : "Signing in...") : t("login.signin")}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-white/20 text-xs">{language === "ar" ? "أو" : "or"}</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <motion.button
            onClick={handleGoogle}
            disabled={loading}
            data-testid="button-google"
            className="w-full py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            whileHover={{ borderColor: "rgba(255,255,255,0.16)" }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t("login.google")}
          </motion.button>

          <p className="text-center text-white/25 text-xs mt-6" data-testid="link-signup">
            {language === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <span className="text-white/40 hover:text-white cursor-pointer transition-colors">
              {language === "ar" ? "سجّل الآن" : "Sign up"}
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
