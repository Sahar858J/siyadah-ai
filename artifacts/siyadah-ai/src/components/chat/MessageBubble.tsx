import { motion } from "framer-motion";

export interface Message {
  id: string;
  role: "user" | "ai" | "system";
  content: string;
  timestamp: number;
}

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  if (message.role === "system") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-3 px-4 py-2"
      >
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-white/30 text-xs tracking-wide">{message.content}</span>
        <div className="flex-1 h-px bg-white/5" />
      </motion.div>
    );
  }

  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end px-4 py-1.5"
      >
        <div
          className="max-w-[72%] px-4 py-2.5 rounded-2xl text-sm text-white leading-relaxed"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-start gap-3 px-4 py-1.5"
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-black flex-shrink-0 mt-0.5"
        style={{ background: "white" }}
      >
        S
      </div>
      <div
        className="max-w-[72%] px-4 py-2.5 rounded-2xl text-sm text-white/90 leading-relaxed"
        style={{ background: "rgba(21,21,21,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
