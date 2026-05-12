import { EmployeeType } from "./employeeDetection";
import { Employee } from "@/components/chat/EmployeeCard";

export const EMPLOYEE_DEFINITIONS: Record<EmployeeType, Omit<Employee, "id" | "status">> = {
  SALES: {
    type: "SALES",
    nameEn: "Sales Employee",
    nameAr: "موظف المبيعات",
    initials: "SE",
    descriptionEn: "Lead generation, pipeline management, and deal closing.",
    descriptionAr: "توليد العملاء المحتملين وإدارة المسار وإغلاق الصفقات.",
  },
  MARKETING: {
    type: "MARKETING",
    nameEn: "Marketing Employee",
    nameAr: "موظف التسويق",
    initials: "ME",
    descriptionEn: "Campaign planning, content strategy, and audience growth.",
    descriptionAr: "تخطيط الحملات واستراتيجية المحتوى ونمو الجمهور.",
  },
  DATA_ANALYST: {
    type: "DATA_ANALYST",
    nameEn: "Data Analyst",
    nameAr: "محلل بيانات",
    initials: "DA",
    descriptionEn: "Data modeling, dashboards, KPIs, and business insights.",
    descriptionAr: "نمذجة البيانات ولوحات المعلومات ومؤشرات الأداء والرؤى.",
  },
  SUPPORT: {
    type: "SUPPORT",
    nameEn: "Customer Support Employee",
    nameAr: "موظف الدعم",
    initials: "CS",
    descriptionEn: "Customer inquiries, ticket handling, and service follow-up.",
    descriptionAr: "استفسارات العملاء ومعالجة التذاكر ومتابعة الخدمة.",
  },
  OPERATIONS: {
    type: "OPERATIONS",
    nameEn: "Operations Employee",
    nameAr: "موظف العمليات",
    initials: "OE",
    descriptionEn: "Workflow optimization, processes, and execution tracking.",
    descriptionAr: "تحسين سير العمل والعمليات وتتبع التنفيذ.",
  },
  FINANCE: {
    type: "FINANCE",
    nameEn: "Finance Advisor",
    nameAr: "مستشار مالي",
    initials: "FA",
    descriptionEn: "Budget planning, forecasting, costs, and financial analysis.",
    descriptionAr: "تخطيط الميزانية والتوقعات والتكاليف والتحليل المالي.",
  },
  HR: {
    type: "HR",
    nameEn: "HR Manager",
    nameAr: "مدير الموارد البشرية",
    initials: "HR",
    descriptionEn: "Hiring, onboarding, team planning, and people operations.",
    descriptionAr: "التوظيف والتهيئة وتخطيط الفريق وعمليات الموظفين.",
  },
  LEGAL: {
    type: "LEGAL",
    nameEn: "Legal Counsel",
    nameAr: "مستشار قانوني",
    initials: "LC",
    descriptionEn: "Contracts, compliance, regulatory review, and risk management.",
    descriptionAr: "العقود والامتثال والمراجعة التنظيمية وإدارة المخاطر.",
  },
};

export function getSystemMessage(type: EmployeeType, language: "en" | "ar"): string {
  const def = EMPLOYEE_DEFINITIONS[type];
  if (language === "ar") {
    return `انضم ${def.nameAr} إلى مساحة العمل.`;
  }
  return `${def.nameEn} joined the workspace.`;
}

export function getEmployeeAIResponse(type: EmployeeType, language: "en" | "ar"): string {
  const def = EMPLOYEE_DEFINITIONS[type];
  if (language === "ar") {
    return `تم. انضم ${def.nameAr} إلى مساحة العمل. ${def.descriptionAr}`;
  }
  return `Done. Your ${def.nameEn} has joined the workspace. ${def.descriptionEn}`;
}
