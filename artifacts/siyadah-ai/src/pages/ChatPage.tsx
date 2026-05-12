import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getSession } from "@/lib/auth";
import LeftSidebar from "@/components/chat/LeftSidebar";
import ChatArea from "@/components/chat/ChatArea";
import EmployeesPanel from "@/components/chat/EmployeesPanel";
import { Employee } from "@/components/chat/EmployeeCard";

export default function ChatPage() {
  const [, setLocation] = useLocation();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      setLocation("/login");
    }
  }, []);

  const handleNewChat = () => {
    window.dispatchEvent(new CustomEvent("siyadah:newchat"));
    setEmployees([]);
  };

  const handleAddEmployee = (emp: Employee) => {
    setEmployees((prev) => {
      if (prev.some((e) => e.type === emp.type)) return prev;
      return [...prev, emp];
    });
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0D0D0D" }}
    >
      <LeftSidebar onNewChat={handleNewChat} />

      <ChatArea employees={employees} onAddEmployee={handleAddEmployee} />

      <div className="hidden md:flex">
        <EmployeesPanel employees={employees} />
      </div>
    </div>
  );
}
