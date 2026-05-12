import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppContext } from "@/context/AppContext";
import { detectEmployee, EmployeeType } from "@/lib/employeeDetection";
import { isArabic } from "@/lib/mockAI";
import { EMPLOYEE_DEFINITIONS, getSystemMessage, getEmployeeAIResponse } from "@/lib/employeeData";
import { Employee } from "./EmployeeCard";
import MessageBubble, { Message } from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import ChatInput from "./ChatInput";

interface Props {
  employees: Employee[];
  onAddEmployee: (emp: Employee) => void;
}

const STORAGE_KEY = "siyadah_chat_history";

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function ChatArea({ employees, onAddEmployee }: Props) {
  const { t, language } = useAppContext();
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [pendingChip, setPendingChip] = useState<string | undefined>(undefined);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (msg: Omit<Message, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      { ...msg, id: generateId(), timestamp: Date.now() },
    ]);
  };

  const handleSend = (text: string) => {
    addMessage({ role: "user", content: text });
    setIsTyping(true);

    const detectedLang: "en" | "ar" = isArabic(text) ? "ar" : language;
    const empType: EmployeeType | null = detectEmployee(text);

    const delay = 1500 + Math.random() * 1000;
    setTimeout(() => {
      setIsTyping(false);

      if (empType) {
        const alreadyExists = employees.some((e) => e.type === empType);
        if (!alreadyExists) {
          const def = EMPLOYEE_DEFINITIONS[empType];
          const newEmployee: Employee = {
            id: generateId(),
            ...def,
            status: "active",
          };
          onAddEmployee(newEmployee);
          addMessage({ role: "system", content: getSystemMessage(empType, detectedLang) });
          addMessage({ role: "ai", content: getEmployeeAIResponse(empType, detectedLang) });
        } else {
          const def = EMPLOYEE_DEFINITIONS[empType];
          const name = detectedLang === "ar" ? def.nameAr : def.nameEn;
          const already =
            detectedLang === "ar"
              ? `${name} موجود بالفعل في مساحة العمل وجاهز لمساعدتك.`
              : `${name} is already active in your workspace and ready to assist.`;
          addMessage({ role: "ai", content: already });
        }
      } else {
        const generic =
          detectedLang === "ar"
            ? "فهمت طلبك. أقوم بتحليل المعلومات وإعداد الاستجابة المناسبة لك."
            : "Understood. I'm analyzing your request and preparing the best response. How can I help further?";
        addMessage({ role: "ai", content: generic });
      }
    }, delay);
  };

  const chips = [
    t("chat.suggested_1"),
    t("chat.suggested_2"),
    t("chat.suggested_3"),
    t("chat.suggested_4"),
  ];

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    const handler = () => handleClearChat();
    window.addEventListener("siyadah:newchat", handler);
    return () => window.removeEventListener("siyadah:newchat", handler);
  }, []);

  return (
    <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full px-6 text-center"
          >
            <div className="mb-6">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <rect width="24" height="24" rx="7" fill="white" fillOpacity="0.06" />
                <path
                  d="M7 8.5C7 7.67 7.67 7 8.5 7h7C16.33 7 17 7.67 17 8.5v0C17 9.33 16.33 10 15.5 10h-4C10.67 10 10 10.67 10 11.5v1C10 13.33 10.67 14 11.5 14h4c.83 0 1.5.67 1.5 1.5v0c0 .83-.67 1.5-1.5 1.5h-7C7.67 17 7 16.33 7 15.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h2 className="text-white text-xl font-semibold tracking-tight mb-1.5">
              {t("chat.empty_title")}
            </h2>
            <p className="text-white/40 text-sm mb-8 max-w-xs leading-relaxed">
              {t("chat.empty_subtitle")}
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {chips.map((chip, i) => (
                <button
                  key={i}
                  data-testid={`chip-suggested-${i}`}
                  onClick={() => setPendingChip(chip)}
                  className="text-xs px-3 py-2 rounded-lg text-white/60 hover:text-white transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      <ChatInput
        onSend={handleSend}
        disabled={isTyping}
        initialValue={pendingChip}
        onInitialValueConsumed={() => setPendingChip(undefined)}
      />
    </div>
  );
}
