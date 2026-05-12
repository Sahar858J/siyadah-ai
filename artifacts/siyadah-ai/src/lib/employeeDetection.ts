export type EmployeeType = 'SALES' | 'MARKETING' | 'DATA_ANALYST' | 'SUPPORT' | 'OPERATIONS' | 'FINANCE' | 'HR' | 'LEGAL';

const keywords: Record<EmployeeType, string[]> = {
  SALES: ['sales', 'lead', 'leads', 'deal', 'deals', 'pipeline', 'revenue', 'mbyeat', 'مبيعات', 'عملاء', 'ليدز', 'صفقات', 'صفقة', 'إيرادات'],
  MARKETING: ['marketing', 'ads', 'campaign', 'campaigns', 'content', 'social media', 'تسويق', 'حملات', 'حملة', 'إعلانات', 'إعلان', 'محتوى'],
  DATA_ANALYST: ['analytics', 'data', 'kpi', 'dashboard', 'report', 'insights', 'بيانات', 'تحليل', 'محلل', 'إحصائيات', 'مؤشرات', 'تقارير'],
  SUPPORT: ['support', 'customer', 'ticket', 'tickets', 'client', 'service', 'دعم', 'خدمة العملاء', 'عميل', 'تذاكر', 'استفسارات'],
  OPERATIONS: ['operations', 'workflow', 'process', 'automation', 'tasks', 'عمليات', 'تشغيل', 'سير العمل', 'أتمتة', 'مهام', 'إجراءات'],
  FINANCE: ['finance', 'budget', 'forecast', 'payment', 'invoice', 'cost', 'مالية', 'ميزانية', 'توقعات', 'دفع', 'فاتورة', 'تكلفة', 'مصاريف'],
  HR: ['hr', 'hiring', 'recruitment', 'team', 'employee', 'culture', 'موارد بشرية', 'توظيف', 'فريق', 'موظفين', 'ثقافة', 'مقابلات'],
  LEGAL: ['legal', 'contract', 'compliance', 'risk', 'regulation', 'قانوني', 'عقد', 'عقود', 'امتثال', 'مخاطر', 'تنظيم']
};

export function detectEmployee(message: string): EmployeeType | null {
  const lowerMessage = message.toLowerCase();
  
  for (const [type, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (lowerMessage.includes(word)) {
        return type as EmployeeType;
      }
    }
  }
  
  return null;
}