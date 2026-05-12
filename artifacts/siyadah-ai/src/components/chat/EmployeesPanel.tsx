import { useAppContext } from "@/context/AppContext";
import EmployeeCard, { Employee } from "./EmployeeCard";

interface Props {
  employees: Employee[];
}

export default function EmployeesPanel({ employees }: Props) {
  const { t, language } = useAppContext();

  return (
    <div
      className="flex flex-col h-full"
      style={{
        width: "300px",
        minWidth: "300px",
        borderLeft: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(10,10,10,0.8)",
      }}
    >
      <div
        className="px-4 py-4 border-b"
        style={{ borderColor: "rgba(255,255,255,0.05)" }}
      >
        <p className="text-white/30 text-xs font-medium uppercase tracking-widest">
          {language === "ar" ? "الموظفون الذكيون" : "AI Employees"}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {employees.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/20 text-sm text-center leading-relaxed px-4">
              {t("employees.empty_placeholder")}
            </p>
          </div>
        ) : (
          employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))
        )}
      </div>
    </div>
  );
}
