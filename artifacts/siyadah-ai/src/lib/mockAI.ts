import { EmployeeType } from './employeeDetection';

export function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export function generateAIResponse(message: string, employeeType: EmployeeType | null, language: "en" | "ar"): string {
  const isAr = language === "ar" || isArabic(message);
  
  if (employeeType) {
    if (isAr) {
      return `لقد قمت بتعيين موظف ${getArabicEmployeeName(employeeType)} لمساعدتك في هذا الأمر. سيقوم بالعمل على الفور. هل تحتاج إلى تفاصيل محددة؟`;
    } else {
      return `I've assigned your ${getEnglishEmployeeName(employeeType)} to help you with this. They're on it right away. Do you need any specific details?`;
    }
  }
  
  if (isAr) {
    return "لقد فهمت طلبك. أقوم بتحليل البيانات وإعداد الإجراءات المناسبة لك.";
  } else {
    return "I understand your request. I'm analyzing the data and preparing the appropriate actions for you.";
  }
}

function getEnglishEmployeeName(type: EmployeeType): string {
  const map: Record<EmployeeType, string> = {
    SALES: "Sales Employee",
    MARKETING: "Marketing Employee",
    DATA_ANALYST: "Data Analyst",
    SUPPORT: "Customer Support Employee",
    OPERATIONS: "Operations Employee",
    FINANCE: "Finance Advisor",
    HR: "HR Manager",
    LEGAL: "Legal Counsel"
  };
  return map[type];
}

function getArabicEmployeeName(type: EmployeeType): string {
  const map: Record<EmployeeType, string> = {
    SALES: "المبيعات",
    MARKETING: "التسويق",
    DATA_ANALYST: "محلل البيانات",
    SUPPORT: "الدعم",
    OPERATIONS: "العمليات",
    FINANCE: "المستشار المالي",
    HR: "مدير الموارد البشرية",
    LEGAL: "المستشار القانوني"
  };
  return map[type];
}