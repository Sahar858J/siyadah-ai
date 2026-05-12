import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowLeft, Zap, CheckCircle2, Clock, TrendingUp, Activity, Send } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { EMPLOYEE_DEFINITIONS } from "@/lib/employeeData";
import { EmployeeType } from "@/lib/employeeDetection";
import { getSession } from "@/lib/auth";

/* ─── Fake employee data per type ─── */

const EMPLOYEE_META: Record<string, {
  color: string;
  tools: { nameEn: string; nameAr: string; descEn: string; descAr: string }[];
  logs: { timeAgo: string; en: string; ar: string }[];
  statsEn: { label: string; value: string; sub: string }[];
  statsAr: { label: string; value: string; sub: string }[];
  chatStartEn: string;
  chatStartAr: string;
}> = {
  SALES: {
    color: "#a8e6cf",
    tools: [
      { nameEn: "CRM Access", nameAr: "الوصول إلى CRM", descEn: "Manage contacts & accounts", descAr: "إدارة جهات الاتصال والحسابات" },
      { nameEn: "Lead Tracker", nameAr: "تتبع العملاء", descEn: "Monitor pipeline in real-time", descAr: "مراقبة خط المبيعات" },
      { nameEn: "Follow-up Bot", nameAr: "روبوت المتابعة", descEn: "Automated outreach sequences", descAr: "تسلسلات التواصل التلقائية" },
      { nameEn: "Deal Closing AI", nameAr: "ذكاء إغلاق الصفقات", descEn: "Objection handling & closing", descAr: "معالجة الاعتراضات والإغلاق" },
    ],
    logs: [
      { timeAgo: "2m ago", en: "Analyzed Q3 sales pipeline — 14 warm leads identified", ar: "تحليل خط مبيعات Q3 — تحديد 14 عميل محتمل" },
      { timeAgo: "18m ago", en: "Generated 3 follow-up email sequences for dormant contacts", ar: "إنشاء 3 تسلسلات متابعة للجهات الخاملة" },
      { timeAgo: "1h ago", en: "Closed deal with Acme Corp — $42,000 ARR", ar: "إغلاق صفقة مع Acme Corp — 42,000$ ARR" },
      { timeAgo: "3h ago", en: "Updated CRM with 8 new lead records", ar: "تحديث CRM بـ 8 سجلات عملاء جدد" },
      { timeAgo: "Yesterday", en: "Delivered weekly pipeline report to workspace", ar: "تسليم تقرير خط المبيعات الأسبوعي" },
    ],
    statsEn: [
      { label: "Tasks completed", value: "128", sub: "↑ 12% this week" },
      { label: "Active workflows", value: "6", sub: "2 closing soon" },
      { label: "Response speed", value: "1.2s", sub: "avg per request" },
      { label: "Performance", value: "94%", sub: "above benchmark" },
    ],
    statsAr: [
      { label: "المهام المنجزة", value: "128", sub: "↑ 12% هذا الأسبوع" },
      { label: "سير العمل النشط", value: "6", sub: "2 على وشك الإغلاق" },
      { label: "سرعة الاستجابة", value: "1.2s", sub: "متوسط لكل طلب" },
      { label: "الأداء", value: "94%", sub: "فوق المعيار" },
    ],
    chatStartEn: "Hello! I'm your Sales Employee. I can help you with lead generation, pipeline management, and closing deals. What would you like to work on?",
    chatStartAr: "مرحباً! أنا موظف المبيعات. يمكنني مساعدتك في توليد العملاء وإدارة خط المبيعات وإغلاق الصفقات. بماذا تريد العمل؟",
  },
  MARKETING: {
    color: "#ffd3b6",
    tools: [
      { nameEn: "Campaign Builder", nameAr: "بناء الحملات", descEn: "Create & launch campaigns", descAr: "إنشاء وإطلاق الحملات" },
      { nameEn: "Content Studio", nameAr: "استوديو المحتوى", descEn: "AI-driven content creation", descAr: "إنشاء محتوى بالذكاء الاصطناعي" },
      { nameEn: "Audience Insights", nameAr: "رؤى الجمهور", descEn: "Segment & analyze audiences", descAr: "تقسيم وتحليل الجمهور" },
      { nameEn: "A/B Test Engine", nameAr: "محرك الاختبار", descEn: "Test and optimize variants", descAr: "اختبار وتحسين المتغيرات" },
    ],
    logs: [
      { timeAgo: "5m ago", en: "Launched summer campaign — 3 ad variants running", ar: "إطلاق حملة الصيف — 3 إعلانات تعمل" },
      { timeAgo: "30m ago", en: "Generated 5 social media posts for this week", ar: "إنشاء 5 منشورات لوسائل التواصل الاجتماعي" },
      { timeAgo: "2h ago", en: "A/B test winner identified — variant B +22% CTR", ar: "تحديد الفائز في الاختبار — النسخة ب +22% CTR" },
      { timeAgo: "4h ago", en: "Analyzed audience segments — new insights ready", ar: "تحليل شرائح الجمهور — رؤى جديدة جاهزة" },
      { timeAgo: "Yesterday", en: "Monthly marketing report generated", ar: "تقرير التسويق الشهري جاهز" },
    ],
    statsEn: [
      { label: "Tasks completed", value: "204", sub: "↑ 18% this week" },
      { label: "Active campaigns", value: "4", sub: "1 launching today" },
      { label: "Response speed", value: "0.9s", sub: "avg per request" },
      { label: "Performance", value: "91%", sub: "above benchmark" },
    ],
    statsAr: [
      { label: "المهام المنجزة", value: "204", sub: "↑ 18% هذا الأسبوع" },
      { label: "الحملات النشطة", value: "4", sub: "1 ينطلق اليوم" },
      { label: "سرعة الاستجابة", value: "0.9s", sub: "متوسط" },
      { label: "الأداء", value: "91%", sub: "فوق المعيار" },
    ],
    chatStartEn: "Hi! I'm your Marketing Employee. I specialize in campaigns, content strategy, and audience growth. How can I help today?",
    chatStartAr: "مرحباً! أنا موظف التسويق. أتخصص في الحملات واستراتيجية المحتوى ونمو الجمهور. كيف يمكنني المساعدة؟",
  },
  DATA_ANALYST: {
    color: "#c9b1ff",
    tools: [
      { nameEn: "Dashboard Builder", nameAr: "بناء لوحات المعلومات", descEn: "Create live KPI dashboards", descAr: "إنشاء لوحات مؤشرات الأداء" },
      { nameEn: "Data Connector", nameAr: "موصل البيانات", descEn: "Connect to any data source", descAr: "الاتصال بأي مصدر بيانات" },
      { nameEn: "Forecast Engine", nameAr: "محرك التوقعات", descEn: "Predictive analytics & trends", descAr: "التحليلات التنبؤية والاتجاهات" },
      { nameEn: "Report Generator", nameAr: "مولد التقارير", descEn: "Automated business reports", descAr: "تقارير الأعمال التلقائية" },
    ],
    logs: [
      { timeAgo: "1m ago", en: "Updated revenue dashboard — Q3 data refreshed", ar: "تحديث لوحة الإيرادات — بيانات Q3 محدّثة" },
      { timeAgo: "45m ago", en: "Generated churn prediction model — 87% accuracy", ar: "نموذج توقع الانسحاب — دقة 87%" },
      { timeAgo: "2h ago", en: "Processed 2.4M records from data warehouse", ar: "معالجة 2.4 مليون سجل من مستودع البيانات" },
      { timeAgo: "5h ago", en: "Detected anomaly in user acquisition funnel", ar: "اكتشاف شذوذ في قمع اكتساب المستخدمين" },
      { timeAgo: "Yesterday", en: "Weekly analytics report sent to workspace", ar: "تقرير التحليلات الأسبوعي مُرسل" },
    ],
    statsEn: [
      { label: "Tasks completed", value: "341", sub: "↑ 22% this week" },
      { label: "Active models", value: "9", sub: "3 in training" },
      { label: "Response speed", value: "2.1s", sub: "complex queries" },
      { label: "Accuracy", value: "97%", sub: "model precision" },
    ],
    statsAr: [
      { label: "المهام المنجزة", value: "341", sub: "↑ 22% هذا الأسبوع" },
      { label: "النماذج النشطة", value: "9", sub: "3 في التدريب" },
      { label: "سرعة الاستجابة", value: "2.1s", sub: "للاستعلامات المعقدة" },
      { label: "الدقة", value: "97%", sub: "دقة النموذج" },
    ],
    chatStartEn: "Hello! I'm your Data Analyst. I can help with dashboards, KPIs, data modeling, and business insights. What would you like to analyze?",
    chatStartAr: "مرحباً! أنا محلل البيانات. يمكنني المساعدة في لوحات المعلومات ومؤشرات الأداء ونمذجة البيانات. ماذا تريد تحليله؟",
  },
  SUPPORT: {
    color: "#b8e0ff",
    tools: [
      { nameEn: "Ticket Manager", nameAr: "مدير التذاكر", descEn: "Handle & route support tickets", descAr: "معالجة وتوجيه تذاكر الدعم" },
      { nameEn: "Knowledge Base", nameAr: "قاعدة المعرفة", descEn: "AI-powered help articles", descAr: "مقالات مساعدة مدعومة بالذكاء" },
      { nameEn: "Live Chat Bot", nameAr: "روبوت الدردشة الحية", descEn: "Instant customer responses", descAr: "ردود فورية على العملاء" },
      { nameEn: "Escalation Engine", nameAr: "محرك التصعيد", descEn: "Smart escalation routing", descAr: "توجيه ذكي للتصعيد" },
    ],
    logs: [
      { timeAgo: "3m ago", en: "Resolved 12 support tickets — avg 4min response", ar: "حل 12 تذكرة دعم — متوسط 4 دقائق" },
      { timeAgo: "20m ago", en: "Updated knowledge base with 3 new articles", ar: "تحديث قاعدة المعرفة بـ 3 مقالات جديدة" },
      { timeAgo: "1h ago", en: "Escalated VIP customer complaint to human team", ar: "تصعيد شكوى عميل VIP للفريق البشري" },
      { timeAgo: "3h ago", en: "Handled 48 chat sessions — 98% satisfaction", ar: "معالجة 48 جلسة دردشة — رضا 98%" },
      { timeAgo: "Yesterday", en: "CSAT report: 4.8/5 average rating", ar: "تقرير CSAT: تقييم متوسط 4.8/5" },
    ],
    statsEn: [
      { label: "Tickets resolved", value: "892", sub: "↑ 8% this week" },
      { label: "Active chats", value: "11", sub: "handling now" },
      { label: "Response speed", value: "0.4s", sub: "first response time" },
      { label: "CSAT score", value: "98%", sub: "customer satisfaction" },
    ],
    statsAr: [
      { label: "التذاكر المحلولة", value: "892", sub: "↑ 8% هذا الأسبوع" },
      { label: "الدردشات النشطة", value: "11", sub: "يعالجها الآن" },
      { label: "سرعة الاستجابة", value: "0.4s", sub: "وقت الاستجابة الأول" },
      { label: "رضا العملاء", value: "98%", sub: "نسبة الرضا" },
    ],
    chatStartEn: "Hi! I'm your Customer Support Employee. I handle tickets, live chats, and customer escalations. How can I help?",
    chatStartAr: "مرحباً! أنا موظف دعم العملاء. أتعامل مع التذاكر والدردشات الحية والتصعيد. كيف يمكنني المساعدة؟",
  },
  OPERATIONS: {
    color: "#ffe8a3",
    tools: [
      { nameEn: "Workflow Builder", nameAr: "بناء سير العمل", descEn: "Design & automate processes", descAr: "تصميم وأتمتة العمليات" },
      { nameEn: "Task Orchestrator", nameAr: "منسق المهام", descEn: "Multi-step task management", descAr: "إدارة المهام متعددة الخطوات" },
      { nameEn: "Resource Planner", nameAr: "مخطط الموارد", descEn: "Allocate team resources", descAr: "تخصيص موارد الفريق" },
      { nameEn: "SLA Monitor", nameAr: "مراقب SLA", descEn: "Track & enforce SLAs", descAr: "تتبع وتطبيق SLAs" },
    ],
    logs: [
      { timeAgo: "7m ago", en: "Optimized onboarding workflow — saved 3h/week", ar: "تحسين سير عمل التهيئة — وفر 3 ساعات/أسبوع" },
      { timeAgo: "35m ago", en: "Automated invoice processing — 100 docs processed", ar: "أتمتة معالجة الفواتير — 100 مستند" },
      { timeAgo: "2h ago", en: "SLA breach alert resolved — Team notified", ar: "حل تنبيه خرق SLA — الفريق مُبلَّغ" },
      { timeAgo: "4h ago", en: "Deployed new resource allocation plan", ar: "نشر خطة تخصيص موارد جديدة" },
      { timeAgo: "Yesterday", en: "Weekly ops efficiency report published", ar: "تقرير كفاءة العمليات الأسبوعي منشور" },
    ],
    statsEn: [
      { label: "Tasks completed", value: "176", sub: "↑ 14% this week" },
      { label: "Active workflows", value: "13", sub: "across 4 depts." },
      { label: "Response speed", value: "1.5s", sub: "avg execution" },
      { label: "Efficiency", value: "89%", sub: "process optimization" },
    ],
    statsAr: [
      { label: "المهام المنجزة", value: "176", sub: "↑ 14% هذا الأسبوع" },
      { label: "سير العمل النشط", value: "13", sub: "عبر 4 أقسام" },
      { label: "سرعة التنفيذ", value: "1.5s", sub: "متوسط" },
      { label: "الكفاءة", value: "89%", sub: "تحسين العمليات" },
    ],
    chatStartEn: "Hello! I'm your Operations Employee. I specialize in workflow automation, process optimization, and execution tracking. What do you need?",
    chatStartAr: "مرحباً! أنا موظف العمليات. أتخصص في أتمتة سير العمل وتحسين العمليات وتتبع التنفيذ. ماذا تحتاج؟",
  },
  FINANCE: {
    color: "#ffc8c8",
    tools: [
      { nameEn: "Budget Planner", nameAr: "مخطط الميزانية", descEn: "Annual & quarterly planning", descAr: "التخطيط السنوي والفصلي" },
      { nameEn: "Cash Flow AI", nameAr: "ذكاء التدفق النقدي", descEn: "Predict & manage cash flow", descAr: "توقع وإدارة التدفق النقدي" },
      { nameEn: "Expense Tracker", nameAr: "متتبع النفقات", descEn: "Real-time expense monitoring", descAr: "مراقبة النفقات في الوقت الفعلي" },
      { nameEn: "Forecast Model", nameAr: "نموذج التوقعات", descEn: "Revenue & cost projections", descAr: "توقعات الإيرادات والتكاليف" },
    ],
    logs: [
      { timeAgo: "10m ago", en: "Updated Q3 financial model — $2.1M ARR projected", ar: "تحديث نموذج Q3 المالي — توقع 2.1M$ ARR" },
      { timeAgo: "1h ago", en: "Flagged 4 overbudget departments for review", ar: "تحديد 4 أقسام تجاوزت الميزانية" },
      { timeAgo: "3h ago", en: "Cash flow forecast updated — healthy runway 18mo", ar: "توقع التدفق النقدي محدّث — 18 شهراً" },
      { timeAgo: "5h ago", en: "Monthly expense report auto-generated", ar: "تقرير النفقات الشهري جاهز" },
      { timeAgo: "Yesterday", en: "Board-ready financials prepared for Q3 review", ar: "التقارير المالية للمجلس جاهزة لـ Q3" },
    ],
    statsEn: [
      { label: "Reports generated", value: "64", sub: "↑ 5% this week" },
      { label: "Budget monitored", value: "$4.2M", sub: "across 8 depts." },
      { label: "Response speed", value: "1.8s", sub: "avg calculation" },
      { label: "Accuracy", value: "99.2%", sub: "financial precision" },
    ],
    statsAr: [
      { label: "التقارير المولّدة", value: "64", sub: "↑ 5% هذا الأسبوع" },
      { label: "الميزانية المُراقبة", value: "$4.2M", sub: "عبر 8 أقسام" },
      { label: "سرعة الحساب", value: "1.8s", sub: "متوسط" },
      { label: "الدقة", value: "99.2%", sub: "الدقة المالية" },
    ],
    chatStartEn: "Hello! I'm your Finance Advisor. I handle budgeting, forecasting, and financial analysis. What financial insight can I provide?",
    chatStartAr: "مرحباً! أنا المستشار المالي. أتعامل مع الميزانية والتوقعات والتحليل المالي. ما الرؤية المالية التي تحتاجها؟",
  },
  HR: {
    color: "#d4edda",
    tools: [
      { nameEn: "Hiring Pipeline", nameAr: "خط التوظيف", descEn: "Track & manage candidates", descAr: "تتبع وإدارة المرشحين" },
      { nameEn: "Onboarding Hub", nameAr: "مركز التهيئة", descEn: "Streamline new hires", descAr: "تبسيط إجراءات الموظفين الجدد" },
      { nameEn: "Performance AI", nameAr: "ذكاء الأداء", descEn: "Reviews & growth tracking", descAr: "تقييمات وتتبع النمو" },
      { nameEn: "Policy Manager", nameAr: "مدير السياسات", descEn: "HR policies & compliance", descAr: "سياسات الموارد البشرية والامتثال" },
    ],
    logs: [
      { timeAgo: "15m ago", en: "Screened 23 applicants — 5 moved to next round", ar: "فرز 23 متقدماً — 5 انتقلوا للمرحلة التالية" },
      { timeAgo: "1h ago", en: "Sent onboarding kit to 2 new hires starting Monday", ar: "إرسال مجموعة التهيئة لـ 2 موظفين جدد" },
      { timeAgo: "3h ago", en: "Completed Q3 performance review cycle", ar: "إتمام دورة تقييم أداء Q3" },
      { timeAgo: "6h ago", en: "Updated employee handbook with new policies", ar: "تحديث دليل الموظف بالسياسات الجديدة" },
      { timeAgo: "Yesterday", en: "HR analytics dashboard refreshed", ar: "لوحة تحليلات الموارد البشرية محدّثة" },
    ],
    statsEn: [
      { label: "Candidates reviewed", value: "218", sub: "↑ 31% this month" },
      { label: "Active job posts", value: "7", sub: "across 3 teams" },
      { label: "Response speed", value: "1.1s", sub: "avg processing" },
      { label: "Retention rate", value: "96%", sub: "company-wide" },
    ],
    statsAr: [
      { label: "المرشحون المراجَعون", value: "218", sub: "↑ 31% هذا الشهر" },
      { label: "الوظائف المنشورة", value: "7", sub: "عبر 3 فرق" },
      { label: "سرعة المعالجة", value: "1.1s", sub: "متوسط" },
      { label: "معدل الاحتفاظ", value: "96%", sub: "على مستوى الشركة" },
    ],
    chatStartEn: "Hi! I'm your HR Manager. I handle hiring, onboarding, performance management, and people operations. How can I help?",
    chatStartAr: "مرحباً! أنا مدير الموارد البشرية. أتعامل مع التوظيف والتهيئة وإدارة الأداء. كيف يمكنني المساعدة؟",
  },
  LEGAL: {
    color: "#e8d5b7",
    tools: [
      { nameEn: "Contract Analyzer", nameAr: "محلل العقود", descEn: "Review & redline contracts", descAr: "مراجعة العقود وتعليق عليها" },
      { nameEn: "Compliance Monitor", nameAr: "مراقب الامتثال", descEn: "Regulatory compliance tracking", descAr: "تتبع الامتثال التنظيمي" },
      { nameEn: "Risk Assessor", nameAr: "مقيّم المخاطر", descEn: "Identify & score legal risks", descAr: "تحديد وتقييم المخاطر القانونية" },
      { nameEn: "IP Manager", nameAr: "مدير الملكية الفكرية", descEn: "Track patents & trademarks", descAr: "تتبع براءات الاختراع والعلامات التجارية" },
    ],
    logs: [
      { timeAgo: "8m ago", en: "Reviewed vendor contract — 3 risk clauses flagged", ar: "مراجعة عقد المورد — 3 بنود مخاطرة محددة" },
      { timeAgo: "40m ago", en: "GDPR compliance audit completed — all clear", ar: "تدقيق امتثال GDPR مكتمل — كل شيء واضح" },
      { timeAgo: "2h ago", en: "Generated NDA template for new partnership", ar: "إنشاء نموذج NDA للشراكة الجديدة" },
      { timeAgo: "5h ago", en: "Patent filing reminder sent — deadline in 14 days", ar: "تذكير بتقديم براءة الاختراع — 14 يوماً" },
      { timeAgo: "Yesterday", en: "Monthly legal risk report completed", ar: "تقرير المخاطر القانونية الشهري مكتمل" },
    ],
    statsEn: [
      { label: "Contracts reviewed", value: "89", sub: "↑ 7% this week" },
      { label: "Open legal items", value: "3", sub: "low risk" },
      { label: "Response speed", value: "2.4s", sub: "complex analysis" },
      { label: "Risk score", value: "Low", sub: "company-wide" },
    ],
    statsAr: [
      { label: "العقود المراجَعة", value: "89", sub: "↑ 7% هذا الأسبوع" },
      { label: "العناصر القانونية المفتوحة", value: "3", sub: "مخاطر منخفضة" },
      { label: "سرعة التحليل", value: "2.4s", sub: "للتحليل المعقد" },
      { label: "درجة المخاطرة", value: "منخفضة", sub: "على مستوى الشركة" },
    ],
    chatStartEn: "Hello! I'm your Legal Counsel. I can help with contract review, compliance, risk assessment, and legal strategy. What do you need?",
    chatStartAr: "مرحباً! أنا المستشار القانوني. يمكنني المساعدة في مراجعة العقود والامتثال وتقييم المخاطر. ماذا تحتاج؟",
  },
};

/* ─── Mini counter animation ─── */
function AnimatedNumber({ target }: { target: string }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const num = parseInt(target.replace(/[^0-9]/g, ""), 10);
    if (isNaN(num)) { setDisplay(target); return; }
    let start = 0;
    const step = Math.ceil(num / 30);
    const timer = setInterval(() => {
      start = Math.min(start + step, num);
      setDisplay(target.replace(/[0-9]+/, String(start)));
      if (start >= num) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{display}</span>;
}

/* ─── Mini employee chat ─── */
function MiniChat({ typeKey, ar }: { typeKey: string; ar: boolean }) {
  const meta = EMPLOYEE_META[typeKey];
  const [messages, setMessages] = useState([
    { role: "ai" as const, content: ar ? meta.chatStartAr : meta.chatStartEn },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fakeReplies: Record<string, string[]> = {
    en: [
      "Great question. I'm analyzing this right now and will have a full breakdown ready shortly.",
      "Understood. I'll prioritize this task and update you once it's complete.",
      "On it. I've identified 3 key action items. Want me to proceed with all of them?",
      "This aligns with our current strategy. I've already prepared a draft for your review.",
      "I've processed your request. Here's what I recommend based on the available data.",
    ],
    ar: [
      "سؤال ممتاز. أقوم بتحليل هذا الآن وسيكون التقرير الكامل جاهزاً قريباً.",
      "مفهوم. سأعطي هذه المهمة الأولوية وسأخبرك عند اكتمالها.",
      "في الطريق. حددت 3 إجراءات رئيسية. هل تريد المتابعة مع جميعها؟",
      "هذا يتوافق مع استراتيجيتنا الحالية. لقد أعددت مسودة للمراجعة.",
      "عالجت طلبك. إليك ما أوصي به بناءً على البيانات المتاحة.",
    ],
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setTyping(true);
    const lang = ar ? "ar" : "en";
    const replies = fakeReplies[lang];
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "ai", content: replies[Math.floor(Math.random() * replies.length)] }]);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col" style={{ height: 340 }}>
      <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="px-3.5 py-2.5 rounded-2xl text-sm max-w-[80%]"
              style={{
                background: msg.role === "user" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.06)",
                color: msg.role === "user" ? "#0D0D0D" : "rgba(255,255,255,0.8)",
                border: msg.role === "ai" ? "1px solid rgba(255,255,255,0.06)" : "none",
              }}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex gap-1.5 px-3.5 py-3 rounded-2xl w-fit" style={{ background: "rgba(255,255,255,0.06)" }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/40"
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="px-3 pb-3">
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={ar ? "اكتب رسالة..." : "Type a message..."}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
          />
          <motion.button
            onClick={send}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            whileTap={{ scale: 0.9 }}
          >
            <Send size={13} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Employee Page ─── */

export default function EmployeePage() {
  const params = useParams<{ type: string }>();
  const [, setLocation] = useLocation();
  const { language } = useAppContext();
  const ar = language === "ar";

  const typeKey = params.type?.toUpperCase() as EmployeeType;
  const def = EMPLOYEE_DEFINITIONS[typeKey];
  const meta = EMPLOYEE_META[typeKey];

  useEffect(() => {
    const session = getSession();
    if (!session) { setLocation("/login"); return; }
    if (!def || !meta) setLocation("/chat");
  }, [typeKey]);

  if (!def || !meta) return null;

  const name = ar ? def.nameAr : def.nameEn;
  const stats = ar ? meta.statsAr : meta.statsEn;

  return (
    <div className="min-h-screen overflow-y-auto" style={{ background: "#0D0D0D" }}>
      {/* Top nav */}
      <div
        className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4"
        style={{
          background: "rgba(13,13,13,0.9)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
        }}
      >
        <motion.button
          onClick={() => setLocation("/chat")}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors duration-200 text-sm"
          whileHover={{ x: -2 }}
        >
          <ArrowLeft size={15} />
          {ar ? "العودة" : "Back"}
        </motion.button>
        <div className="w-px h-4 bg-white/10" />
        <span className="text-white/30 text-sm">{name}</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl p-8"
          style={{
            background: "rgba(18,18,18,0.9)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${meta.color}08 0%, transparent 70%)`,
              transform: "translate(30%, -30%)",
            }}
          />

          <div className="flex items-center gap-5 relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${meta.color}20, rgba(255,255,255,0.04))`,
                border: `1px solid ${meta.color}30`,
              }}
            >
              {def.initials}
            </motion.div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-white text-2xl font-bold tracking-tight">{name}</h1>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: "rgba(78,255,145,0.08)", border: "1px solid rgba(78,255,145,0.2)" }}>
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full block"
                    style={{ background: "#4eff91" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs font-medium" style={{ color: "#4eff91" }}>
                    {ar ? "نشط" : "Active"}
                  </span>
                </div>
              </div>
              <p className="text-white/40 text-sm">
                {ar ? def.descriptionAr : def.descriptionEn}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06, duration: 0.4 }}
              className="rounded-xl p-5"
              style={{
                background: "rgba(18,18,18,0.9)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-white/40 text-xs mb-2">{stat.label}</p>
              <p className="text-white text-2xl font-bold tracking-tight leading-none mb-1">
                <AnimatedNumber target={stat.value} />
              </p>
              <p className="text-white/30 text-xs">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity log */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(18,18,18,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-white/30" />
                <span className="text-white text-sm font-semibold">{ar ? "سجل النشاط" : "Activity Log"}</span>
              </div>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {meta.logs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="px-5 py-3.5 flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-sm leading-snug">{ar ? log.ar : log.en}</p>
                    <p className="text-white/25 text-xs mt-0.5">{log.timeAgo}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tools */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.45 }}
            className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(18,18,18,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-white/30" />
                <span className="text-white text-sm font-semibold">{ar ? "الأدوات والوحدات" : "Tools & Modules"}</span>
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 gap-2">
              {meta.tools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer group"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                  whileHover={{ borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)" }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}20` }}
                  >
                    <CheckCircle2 size={13} style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold">{ar ? tool.nameAr : tool.nameEn}</p>
                    <p className="text-white/35 text-xs">{ar ? tool.descAr : tool.descEn}</p>
                  </div>
                  <div className="w-4 h-4 flex items-center justify-center text-white/20 group-hover:text-white/50 transition-colors">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4h5M4 1.5l2.5 2.5L4 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Mini chat */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(18,18,18,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}30` }}
              >
                {def.initials}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{name}</p>
                <div className="flex items-center gap-1.5">
                  <motion.span
                    className="w-1.5 h-1.5 rounded-full block"
                    style={{ background: "#4eff91" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-white/30 text-xs">{ar ? "متصل" : "online"}</span>
                </div>
              </div>
            </div>
          </div>
          <MiniChat typeKey={typeKey} ar={ar} />
        </motion.div>
      </div>
    </div>
  );
}
