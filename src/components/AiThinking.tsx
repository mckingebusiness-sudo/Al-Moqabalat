import { motion } from "framer-motion";

export function AiThinking({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium">
      <span>{label || "AI بيفكّر"}</span>
      <span className="inline-flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-current"
            animate={{ opacity: [0.2, 1, 0.2], y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </span>
    </span>
  );
}
