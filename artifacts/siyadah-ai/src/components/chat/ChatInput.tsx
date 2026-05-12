import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Paperclip, Mic } from "lucide-react";
import { useAppContext } from "@/context/AppContext";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  initialValue?: string;
  onInitialValueConsumed?: () => void;
}

export default function ChatInput({ onSend, disabled, initialValue, onInitialValueConsumed }: Props) {
  const { t } = useAppContext();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
      onInitialValueConsumed?.();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 50);
    }
  }, [initialValue]);

  const adjustHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustHeight();
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="px-4 pb-5 pt-2">
      <motion.div
        className="relative rounded-2xl transition-all duration-300"
        style={{
          background: "rgba(21,21,21,0.9)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        whileFocusWithin={{
          boxShadow: "0 0 0 1px rgba(255,255,255,0.15), 0 0 24px rgba(255,255,255,0.04)",
          borderColor: "rgba(255,255,255,0.16)",
        }}
      >
        <div className="flex items-end gap-2 p-3">
          <button
            className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0 mb-0.5"
            data-testid="button-attach"
          >
            <Paperclip size={16} />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={t("chat.input_placeholder")}
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 resize-none outline-none leading-relaxed"
            style={{ maxHeight: "120px", minHeight: "24px" }}
            data-testid="input-chat"
          />

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              className="text-white/30 hover:text-white/60 transition-colors mb-0.5"
              data-testid="button-mic"
            >
              <Mic size={16} />
            </button>

            <button
              onClick={handleSubmit}
              disabled={!value.trim() || disabled}
              className="w-7 h-7 rounded-lg bg-white text-black flex items-center justify-center transition-all duration-200 hover:bg-white/90 disabled:opacity-25 disabled:cursor-not-allowed"
              data-testid="button-send"
            >
              <ArrowUp size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
