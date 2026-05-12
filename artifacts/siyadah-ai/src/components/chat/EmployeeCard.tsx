import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { EmployeeType } from "@/lib/employeeDetection";

export interface Employee {
  id: string;
  type: EmployeeType;
  nameEn: string;
  nameAr: string;
  initials: string;
  descriptionEn: string;
  descriptionAr: string;
  status: "active" | "waiting" | "processing" | "completed";
}

interface Props {
  employee: Employee;
}

export default function EmployeeCard({ employee }: Props) {
  const { language, t } = useAppContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, visible: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlight({ x, y, visible: true });
  };

  const handleMouseLeave = () => {
    setSpotlight((s) => ({ ...s, visible: false }));
  };

  const statusColor = {
    active: "#4eff91",
    waiting: "#666",
    processing: "#fff",
    completed: "#888",
  }[employee.status];

  const name = language === "ar" ? employee.nameAr : employee.nameEn;
  const description = language === "ar" ? employee.descriptionAr : employee.descriptionEn;
  const statusLabel = t(`status.${employee.status}`);

  return (
    <motion.div
      data-testid={`employee-card-${employee.type.toLowerCase()}`}
      ref={cardRef}
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-xl p-3.5 mb-3 overflow-hidden cursor-default"
      style={{
        background: "rgba(21,21,21,0.9)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.2s",
      }}
      whileHover={{ borderColor: "rgba(255,255,255,0.12)" }}
    >
      {spotlight.visible && (
        <div
          className="absolute inset-0 pointer-events-none rounded-xl"
          style={{
            background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.04) 0%, transparent 60%)`,
          }}
        />
      )}

      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          {employee.initials}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold leading-tight truncate">{name}</p>
          <p className="text-white/40 text-xs mt-0.5 leading-snug line-clamp-2">{description}</p>

          <div className="flex items-center gap-1.5 mt-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full block"
              style={{ background: statusColor }}
              animate={employee.status === "active" ? { opacity: [1, 0.4, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-white/40 text-xs">{statusLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
