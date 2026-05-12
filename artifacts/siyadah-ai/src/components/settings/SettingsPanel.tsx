import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Globe, Palette, Brain, Bell, Building2, ChevronRight } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { getSession } from "@/lib/auth";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Tab = "profile" | "language" | "appearance" | "ai" | "notifications" | "workspace";

const TABS: { id: Tab; icon: typeof User; labelEn: string; labelAr: string }[] = [
  { id: "profile", icon: User, labelEn: "Profile", labelAr: "الملف الشخصي" },
  { id: "language", icon: Globe, labelEn: "Language", labelAr: "اللغة" },
  { id: "appearance", icon: Palette, labelEn: "Appearance", labelAr: "المظهر" },
  { id: "ai", icon: Brain, labelEn: "AI Settings", labelAr: "إعدادات الذكاء" },
  { id: "notifications", icon: Bell, labelEn: "Notifications", labelAr: "الإشعارات" },
  { id: "workspace", icon: Building2, labelEn: "Workspace", labelAr: "مساحة العمل" },
];

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/[0.04]">
      <span className="text-white/50 text-sm">{label}</span>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      className="relative w-10 h-5.5 rounded-full flex-shrink-0"
      style={{
        background: value ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.1)",
        width: 40,
        height: 22,
      }}
      animate={{ background: value ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.08)" }}
    >
      <motion.div
        className="absolute top-0.5 rounded-full"
        style={{
          width: 18,
          height: 18,
          background: value ? "#0D0D0D" : "rgba(255,255,255,0.3)",
        }}
        animate={{ left: value ? "calc(100% - 20px)" : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
      />
    </motion.button>
  );
}

function Slider({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-white/40 text-xs">{label}</span>
        <span className="text-white/60 text-xs font-mono">{value}%</span>
      </div>
      <div className="relative h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ background: "rgba(255,255,255,0.5)", width: `${value}%` }}
          animate={{ width: `${value}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

function ProfileTab() {
  const { language } = useAppContext();
  const session = getSession();
  const ar = language === "ar";
  const [name, setName] = useState("John Doe");
  const [workspace, setWorkspace] = useState("My Workspace");

  return (
    <div>
      <div className="flex items-center gap-4 mb-8 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-black flex-shrink-0" style={{ background: "rgba(255,255,255,0.85)" }}>
          {(session?.email?.[0] ?? "U").toUpperCase()}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{name}</p>
          <p className="text-white/40 text-xs mt-0.5">{session?.email ?? "user@siyadah.ai"}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-white/40 text-xs mb-1.5 block">{ar ? "الاسم" : "Display name"}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
        <div>
          <label className="text-white/40 text-xs mb-1.5 block">{ar ? "البريد الإلكتروني" : "Email"}</label>
          <input
            value={session?.email ?? ""}
            readOnly
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white/40 outline-none"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          />
        </div>
        <div>
          <label className="text-white/40 text-xs mb-1.5 block">{ar ? "اسم مساحة العمل" : "Workspace name"}</label>
          <input
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
      </div>

      <motion.button
        className="w-full mt-6 py-2.5 rounded-xl text-sm font-semibold text-black bg-white"
        whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(255,255,255,0.12)" }}
        whileTap={{ scale: 0.99 }}
      >
        {ar ? "حفظ التغييرات" : "Save changes"}
      </motion.button>
    </div>
  );
}

function LanguageTab() {
  const { language, setLanguage } = useAppContext();
  return (
    <div className="space-y-3">
      {[
        { code: "en", label: "English", sub: "Left-to-right" },
        { code: "ar", label: "عربي", sub: "يمين إلى يسار (RTL)" },
      ].map((lang) => (
        <motion.button
          key={lang.code}
          onClick={() => setLanguage(lang.code as "en" | "ar")}
          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-all duration-200"
          style={{
            background: language === lang.code ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${language === lang.code ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)"}`,
          }}
          whileHover={{ borderColor: "rgba(255,255,255,0.14)" }}
        >
          <div>
            <p className="text-white text-sm font-medium">{lang.label}</p>
            <p className="text-white/35 text-xs mt-0.5">{lang.sub}</p>
          </div>
          {language === lang.code && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "white" }}
            >
              <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}

function AppearanceTab() {
  const { language } = useAppContext();
  const ar = language === "ar";
  const [mode, setMode] = useState("dark");
  return (
    <div className="space-y-3">
      {[
        { id: "dark", labelEn: "Dark", labelAr: "داكن", sub: "Always dark — recommended", subAr: "داكن دائماً — موصى به" },
        { id: "light", labelEn: "Light", labelAr: "فاتح", sub: "Coming soon", subAr: "قريباً" },
        { id: "system", labelEn: "System", labelAr: "النظام", sub: "Match your OS preference", subAr: "تتبع إعدادات نظامك" },
      ].map((m) => (
        <motion.button
          key={m.id}
          onClick={() => m.id === "dark" && setMode("dark")}
          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left"
          style={{
            background: mode === m.id ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
            border: `1px solid ${mode === m.id ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.06)"}`,
            opacity: m.id !== "dark" ? 0.45 : 1,
          }}
          whileHover={m.id === "dark" ? { borderColor: "rgba(255,255,255,0.14)" } : {}}
        >
          <div>
            <p className="text-white text-sm font-medium">{ar ? m.labelAr : m.labelEn}</p>
            <p className="text-white/35 text-xs mt-0.5">{ar ? m.subAr : m.sub}</p>
          </div>
          {mode === m.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "white" }}
            >
              <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}

function AISettingsTab() {
  const { language } = useAppContext();
  const ar = language === "ar";
  const [model, setModel] = useState("siyadah-v2");
  const [style, setStyle] = useState("balanced");
  const [creativity, setCreativity] = useState(65);

  return (
    <div className="space-y-6">
      <div>
        <label className="text-white/40 text-xs mb-2 block">{ar ? "نموذج الذكاء الاصطناعي" : "AI Model"}</label>
        <div className="space-y-2">
          {[
            { id: "siyadah-v2", label: "Siyadah v2", sub: ar ? "الأقوى، الأبطأ قليلاً" : "Most capable, slightly slower" },
            { id: "siyadah-fast", label: "Siyadah Fast", sub: ar ? "سريع جداً، مثالي للمهام السريعة" : "Ultra fast, ideal for quick tasks" },
          ].map((m) => (
            <motion.button
              key={m.id}
              onClick={() => setModel(m.id)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left"
              style={{
                background: model === m.id ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${model === m.id ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div>
                <p className="text-white text-sm font-medium">{m.label}</p>
                <p className="text-white/35 text-xs">{m.sub}</p>
              </div>
              {model === m.id && <div className="w-2 h-2 rounded-full bg-white/70" />}
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-white/40 text-xs mb-2 block">{ar ? "أسلوب الاستجابة" : "Response style"}</label>
        <div className="flex gap-2">
          {[
            { id: "concise", en: "Concise", ar: "موجز" },
            { id: "balanced", en: "Balanced", ar: "متوازن" },
            { id: "detailed", en: "Detailed", ar: "مفصّل" },
          ].map((s) => (
            <motion.button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className="flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: style === s.id ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${style === s.id ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.06)"}`,
                color: style === s.id ? "white" : "rgba(255,255,255,0.4)",
              }}
            >
              {ar ? s.ar : s.en}
            </motion.button>
          ))}
        </div>
      </div>

      <Slider
        value={creativity}
        onChange={setCreativity}
        label={ar ? "مستوى الإبداع" : "Creativity level"}
      />
    </div>
  );
}

function NotificationsTab() {
  const { language } = useAppContext();
  const ar = language === "ar";
  const [email, setEmail] = useState(true);
  const [sound, setSound] = useState(false);
  const [activity, setActivity] = useState(true);
  const [weekly, setWeekly] = useState(true);

  return (
    <div>
      <SettingRow label={ar ? "إشعارات البريد الإلكتروني" : "Email notifications"}>
        <Toggle value={email} onChange={setEmail} />
      </SettingRow>
      <SettingRow label={ar ? "الأصوات" : "Sound effects"}>
        <Toggle value={sound} onChange={setSound} />
      </SettingRow>
      <SettingRow label={ar ? "نشاط الموظفين" : "Employee activity alerts"}>
        <Toggle value={activity} onChange={setActivity} />
      </SettingRow>
      <SettingRow label={ar ? "تقارير أسبوعية" : "Weekly reports"}>
        <Toggle value={weekly} onChange={setWeekly} />
      </SettingRow>
    </div>
  );
}

function WorkspaceTab() {
  const { language } = useAppContext();
  const ar = language === "ar";
  const [memory, setMemory] = useState(true);
  const [learning, setLearning] = useState(true);
  const [autoHire, setAutoHire] = useState(false);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-white text-sm font-medium mb-1">{ar ? "نمط الموظفين" : "Employee Behavior"}</p>
        <p className="text-white/35 text-xs mb-4">{ar ? "تحكم في كيفية استجابة الموظفين الذكيين." : "Control how your AI employees respond and learn."}</p>
        <SettingRow label={ar ? "ذاكرة المحادثة" : "Conversation memory"}>
          <Toggle value={memory} onChange={setMemory} />
        </SettingRow>
        <SettingRow label={ar ? "التعلم التلقائي" : "Auto-learning"}>
          <Toggle value={learning} onChange={setLearning} />
        </SettingRow>
        <SettingRow label={ar ? "توظيف تلقائي" : "Auto-hire employees"}>
          <Toggle value={autoHire} onChange={setAutoHire} />
        </SettingRow>
      </div>
    </div>
  );
}

const TAB_CONTENT: Record<Tab, () => JSX.Element> = {
  profile: ProfileTab,
  language: LanguageTab,
  appearance: AppearanceTab,
  ai: AISettingsTab,
  notifications: NotificationsTab,
  workspace: WorkspaceTab,
};

export default function SettingsPanel({ open, onClose }: Props) {
  const { language } = useAppContext();
  const ar = language === "ar";
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const ActiveContent = TAB_CONTENT[activeTab];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 bottom-0 z-50 flex flex-col overflow-hidden"
            style={{
              left: ar ? undefined : 64,
              right: ar ? 64 : undefined,
              width: 620,
              background: "#111111",
              borderRight: ar ? undefined : "1px solid rgba(255,255,255,0.07)",
              borderLeft: ar ? "1px solid rgba(255,255,255,0.07)" : undefined,
              boxShadow: "24px 0 60px rgba(0,0,0,0.6)",
            }}
            initial={{ x: ar ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: ar ? 40 : -40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 className="text-white font-semibold text-base tracking-tight">
                {ar ? "الإعدادات" : "Settings"}
              </h2>
              <motion.button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Tab sidebar */}
              <div className="w-48 flex-shrink-0 py-3 px-2" style={{ borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left mb-0.5 transition-all duration-150"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.07)" : "transparent",
                        color: isActive ? "white" : "rgba(255,255,255,0.4)",
                      }}
                      whileHover={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.8)" }}
                    >
                      <Icon size={14} strokeWidth={1.5} />
                      <span className="text-xs font-medium">
                        {ar ? tab.labelAr : tab.labelEn}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="tab-indicator"
                          className="ml-auto w-1 h-1 rounded-full"
                          style={{ background: "rgba(255,255,255,0.6)" }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-white/25 text-xs uppercase tracking-widest mb-5">
                      {ar ? TABS.find((t) => t.id === activeTab)?.labelAr : TABS.find((t) => t.id === activeTab)?.labelEn}
                    </p>
                    <ActiveContent />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
