import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-start gap-3 px-4 py-2"
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-black flex-shrink-0 mt-0.5"
        style={{ background: "white" }}
      >
        S
      </div>
      <div className="glass-card px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/40 block"
            animate={{ y: [0, -5, 0] }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
