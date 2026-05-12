import { useRef, useState } from "react";
import { useLocation } from "wouter";
import { motion, useInView } from "framer-motion";
import { MessageSquare, Users, Zap, BarChart3, BookOpen, Plug } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAppContext } from "@/context/AppContext";

const features = [
  { icon: MessageSquare, key: "chat" },
  { icon: Users, key: "employees" },
  { icon: Zap, key: "workflow" },
  { icon: BarChart3, key: "data" },
  { icon: BookOpen, key: "knowledge" },
  { icon: Plug, key: "integrations" },
];

const sampleAgents = [
  { initials: "SE", nameEn: "Sales Employee", nameAr: "موظف المبيعات", roleEn: "Lead Generation", roleAr: "توليد العملاء" },
  { initials: "DA", nameEn: "Data Analyst", nameAr: "محلل بيانات", roleEn: "Business Intelligence", roleAr: "ذكاء الأعمال" },
  { initials: "ME", nameEn: "Marketing Employee", nameAr: "موظف التسويق", roleEn: "Growth & Campaigns", roleAr: "النمو والحملات" },
  { initials: "FA", nameEn: "Finance Advisor", nameAr: "مستشار مالي", roleEn: "Budget & Forecasting", roleAr: "الميزانية والتوقعات" },
  { initials: "LC", nameEn: "Legal Counsel", nameAr: "مستشار قانوني", roleEn: "Compliance & Contracts", roleAr: "الامتثال والعقود" },
  { initials: "HR", nameEn: "HR Manager", nameAr: "مدير الموارد البشرية", roleEn: "People Operations", roleAr: "عمليات الموظفين" },
];

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, visible: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      visible: true,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpot((s) => ({ ...s, visible: false }))}
      className={`relative overflow-hidden rounded-xl glass-card p-6 ${className}`}
    >
      {spot.visible && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle at ${spot.x}% ${spot.y}%, rgba(255,255,255,0.05) 0%, transparent 55%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

function FeaturesSection() {
  const { t } = useAppContext();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-28 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Capabilities</p>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          Everything your business needs
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feat, i) => (
          <motion.div
            key={feat.key}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: i * 0.07 }}
          >
            <SpotlightCard>
              <feat.icon size={20} className="text-white/50 mb-4" />
              <h3 className="text-white font-semibold text-sm mb-2">
                {t(`features.${feat.key}.title`)}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">
                {t(`features.${feat.key}.desc`)}
              </p>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AgentsSection() {
  const { language } = useAppContext();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="py-20 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-14"
      >
        <p className="text-white/30 text-xs uppercase tracking-widest mb-3">AI Workforce</p>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          {language === "ar" ? "قوة عمل ذكية كاملة" : "Your complete AI workforce"}
        </h2>
        <p className="text-white/40 text-sm mt-3 max-w-lg mx-auto">
          {language === "ar"
            ? "وظّف موظفين أذكياء متخصصين في ثوانٍ. كل واحد يعمل باستمرار."
            : "Hire specialized AI employees in seconds. Each one works continuously, learning your business context."}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleAgents.map((agent, i) => (
          <motion.div
            key={agent.initials}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <SpotlightCard>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {agent.initials}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">
                    {language === "ar" ? agent.nameAr : agent.nameEn}
                  </p>
                  <p className="text-white/40 text-xs">
                    {language === "ar" ? agent.roleAr : agent.roleEn}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full block"
                  style={{ background: "#4eff91" }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
                <span className="text-white/30 text-xs">Active</span>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function AutomationSection() {
  const { language } = useAppContext();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const steps = language === "ar"
    ? ["إرسال الطلب", "تعيين الموظف", "تنفيذ المهمة", "تسليم النتيجة"]
    : ["Send request", "Assign employee", "Execute task", "Deliver result"];

  return (
    <section ref={ref} className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <p className="text-white/30 text-xs uppercase tracking-widest mb-3">Automation</p>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
            {language === "ar" ? "أتمتة تعمل بذكاء" : "Automation that thinks"}
          </h2>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            {language === "ar"
              ? "من طلب واحد إلى نتيجة حقيقية، كل شيء يحدث تلقائياً."
              : "From a single request to a real outcome, everything happens automatically."}
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex items-center"
            >
              <div className="flex flex-col items-center text-center px-6 py-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mb-3"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {i + 1}
                </div>
                <span className="text-white/60 text-sm">{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden sm:block w-12 h-px bg-white/10 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { t, language } = useAppContext();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen" style={{ background: "#0D0D0D" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid-texture" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,255,255,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 vignette" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-10"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-white/60 block"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-white/50 text-xs tracking-wide">
              {language === "ar" ? "الذكاء الاصطناعي للمؤسسات" : "Enterprise AI Platform"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none mb-6"
            style={{ letterSpacing: "-0.03em" }}
          >
            {language === "ar" ? (
              <span>نظامك الذكي<br />لإدارة الأعمال</span>
            ) : (
              <span>Your AI<br />Operating System</span>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/40 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto"
          >
            {language === "ar"
              ? "تحدث، أتمت، حلّل، وابنِ باستخدام سيادة AI."
              : "Chat, automate, analyze, and build with Siyadah AI."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.button
              onClick={() => setLocation("/login")}
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-get-started"
            >
              {t("hero.cta_primary")}
            </motion.button>
            <motion.button
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-xl text-white/60 hover:text-white text-sm font-medium transition-all duration-200"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
              whileHover={{ borderColor: "rgba(255,255,255,0.18)" }}
              data-testid="button-see-demo"
            >
              {t("hero.cta_secondary")}
            </motion.button>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: "linear-gradient(to bottom, transparent, #0D0D0D)",
          }}
        />
      </section>

      <div id="features">
        <FeaturesSection />
      </div>

      <AgentsSection />
      <AutomationSection />
      <Footer />
    </div>
  );
}
