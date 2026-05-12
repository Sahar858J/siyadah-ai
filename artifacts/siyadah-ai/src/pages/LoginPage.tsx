import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { motion, useAnimationFrame } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { saveSession, getSession } from "@/lib/auth";

/* ─────────────────────────── Particle Canvas ─────────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const count = 60;
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const pts = particles.current;

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}

/* ──────────────────────── Floating orbs ──────────────────────── */

function Orb({ cx, cy, r, delay }: { cx: string; cy: string; r: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: cx,
        top: cy,
        width: r * 2,
        height: r * 2,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)`,
        filter: "blur(1px)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
      animate={{ y: [0, -18, 0], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 6 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

/* ──────────────────────── Main Component ──────────────────────── */

export default function LoginPage() {
  const { language, setLanguage } = useAppContext();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const ar = language === "ar";

  useEffect(() => {
    if (getSession()) setLocation("/chat");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError(ar ? "يرجى ملء جميع الحقول." : "Please fill in all fields.");
      return;
    }
    if (!email.includes("@")) {
      setError(ar ? "يرجى إدخال بريد إلكتروني صحيح." : "Please enter a valid email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      saveSession(email);
      setLocation("/chat");
    }, 900);
  };

  const handleGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      saveSession("user@google.com");
      setLocation("/chat");
    }, 900);
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ background: "#0D0D0D", direction: ar ? "rtl" : "ltr" }}
    >
      {/* ─── LEFT BRANDING PANEL ─── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
        {/* Particle field */}
        <ParticleCanvas />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid-texture opacity-30" />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 45% 45%, rgba(255,255,255,0.06) 0%, transparent 65%)",
          }}
        />

        {/* Bottom edge fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, rgba(13,13,13,0.7))",
          }}
        />

        {/* Right edge separator */}
        <div
          className="absolute top-0 right-0 bottom-0 w-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        {/* Floating orbs */}
        <Orb cx="20%" cy="25%" r={80} delay={0} />
        <Orb cx="75%" cy="65%" r={55} delay={1.5} />
        <Orb cx="45%" cy="80%" r={40} delay={0.8} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-14">
          {/* Top: Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 24px rgba(255,255,255,0.04)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 8.5C7 7.67 7.67 7 8.5 7h7C16.33 7 17 7.67 17 8.5v0C17 9.33 16.33 10 15.5 10h-4C10.67 10 10 10.67 10 11.5v1C10 13.33 10.67 14 11.5 14h4c.83 0 1.5.67 1.5 1.5v0c0 .83-.67 1.5-1.5 1.5h-7C7.67 17 7 16.33 7 15.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-base tracking-tight">Siyadah AI</span>
          </motion.div>

          {/* Middle: Headline */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-white/30 text-xs uppercase tracking-widest mb-5 font-medium">
              Enterprise AI Platform
            </p>
            <h1
              className="text-white font-bold leading-none mb-6"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 3.2rem)",
                letterSpacing: "-0.03em",
                textShadow: "0 0 40px rgba(255,255,255,0.08)",
              }}
            >
              {ar ? (
                "قم بإدارة\nمؤسستك الذكية."
              ) : (
                <>Command your<br />intelligent enterprise.</>
              )}
            </h1>
            <p
              className="text-white/35 leading-relaxed max-w-sm"
              style={{ fontSize: "0.95rem" }}
            >
              {ar
                ? "ادخل إلى مساحة العمل الذكية الخاصة بك وإدارة الموظفين والأنظمة الذكية."
                : "Access your AI workspace, employees, workflows, and intelligent systems."}
            </p>
          </motion.div>

          {/* Bottom: Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-8"
          >
            {[
              { val: "6+", label: ar ? "موظف ذكي" : "AI Employees" },
              { val: "∞", label: ar ? "مهام" : "Tasks" },
              { val: "24/7", label: ar ? "متاح دائماً" : "Always on" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-white font-semibold text-lg" style={{ letterSpacing: "-0.02em" }}>
                  {s.val}
                </p>
                <p className="text-white/30 text-xs">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT FORM PANEL ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Lang toggle */}
        <div className={`absolute top-6 ${ar ? "left-6" : "right-6"}`}>
          <motion.button
            onClick={() => setLanguage(ar ? "en" : "ar")}
            className="text-xs font-medium px-3 py-1.5 rounded-md text-white/40 hover:text-white transition-all duration-200"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
            whileHover={{ borderColor: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.06)" }}
          >
            {ar ? "EN" : "عربي"}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[360px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 8.5C7 7.67 7.67 7 8.5 7h7C16.33 7 17 7.67 17 8.5v0C17 9.33 16.33 10 15.5 10h-4C10.67 10 10 10.67 10 11.5v1C10 13.33 10.67 14 11.5 14h4c.83 0 1.5.67 1.5 1.5v0c0 .83-.67 1.5-1.5 1.5h-7C7.67 17 7 16.33 7 15.5"
                  stroke="white" strokeWidth="1.5" strokeLinecap="round"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">Siyadah AI</span>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-8"
            style={{
              background: "rgba(21,21,21,0.8)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="mb-7">
              <h2
                className="text-white font-bold mb-1.5"
                style={{ fontSize: "1.45rem", letterSpacing: "-0.025em" }}
              >
                {ar ? "مرحباً بعودتك" : "Welcome back"}
              </h2>
              <p className="text-white/35 text-sm">
                {ar ? "أدخل بياناتك للوصول إلى مساحة العمل." : "Enter your credentials to access your workspace."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label className="text-white/40 text-xs mb-1.5 block font-medium">
                  {ar ? "البريد الإلكتروني" : "Email address"}
                </label>
                <motion.div
                  animate={{
                    boxShadow: focusedField === "email"
                      ? "0 0 0 1px rgba(255,255,255,0.18), 0 0 20px rgba(255,255,255,0.04)"
                      : "0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl overflow-hidden"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    data-testid="input-email"
                    className="w-full px-4 py-3 text-sm text-white placeholder-white/20 outline-none bg-transparent"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  />
                </motion.div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-white/40 text-xs font-medium">
                    {ar ? "كلمة المرور" : "Password"}
                  </label>
                  <button
                    type="button"
                    className="text-white/30 text-xs hover:text-white/60 transition-colors duration-200"
                  >
                    {ar ? "نسيت كلمة المرور؟" : "Forgot password?"}
                  </button>
                </div>
                <motion.div
                  animate={{
                    boxShadow: focusedField === "password"
                      ? "0 0 0 1px rgba(255,255,255,0.18), 0 0 20px rgba(255,255,255,0.04)"
                      : "0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl overflow-hidden"
                >
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    data-testid="input-password"
                    className="w-full px-4 py-3 text-sm text-white placeholder-white/20 outline-none bg-transparent"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  />
                </motion.div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setRemember((v) => !v)}
                  className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    border: remember ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.15)",
                    background: remember ? "rgba(255,255,255,0.1)" : "transparent",
                  }}
                >
                  {remember && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      width="9" height="9" viewBox="0 0 12 12" fill="none"
                    >
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </div>
                <span className="text-white/35 text-xs group-hover:text-white/55 transition-colors duration-200">
                  {ar ? "تذكرني" : "Remember me"}
                </span>
              </label>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400/80 text-xs"
                >
                  {error}
                </motion.p>
              )}

              {/* Sign In button */}
              <motion.button
                type="submit"
                disabled={loading}
                data-testid="button-signin"
                className="relative w-full py-3 rounded-xl text-sm font-semibold text-black overflow-hidden disabled:opacity-60 transition-opacity duration-200"
                style={{
                  background: "white",
                  boxShadow: "0 0 20px rgba(255,255,255,0.1)",
                }}
                whileHover={{
                  boxShadow: "0 0 32px rgba(255,255,255,0.18)",
                  scale: 1.01,
                }}
                whileTap={{ scale: 0.99 }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      className="w-3.5 h-3.5 rounded-full border-2 border-black/30 border-t-black block"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                    />
                    {ar ? "جاري الدخول..." : "Signing in..."}
                  </span>
                ) : (
                  ar ? "تسجيل الدخول" : "Sign In"
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <span className="text-white/20 text-xs">{ar ? "أو" : "or"}</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
            </div>

            {/* Google */}
            <motion.button
              onClick={handleGoogle}
              disabled={loading}
              data-testid="button-google"
              className="w-full py-3 rounded-xl text-sm font-medium text-white/55 hover:text-white flex items-center justify-center gap-2.5 transition-colors duration-200 disabled:opacity-50"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              whileHover={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.14)",
                scale: 1.01,
              }}
              whileTap={{ scale: 0.99 }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {ar ? "متابعة مع Google" : "Continue with Google"}
            </motion.button>

            <p className="text-center text-white/20 text-xs mt-6">
              {ar ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
              <span className="text-white/40 hover:text-white/70 cursor-pointer transition-colors duration-200">
                {ar ? "سجّل الآن" : "Sign up"}
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
