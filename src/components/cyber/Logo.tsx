import { motion } from "framer-motion";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 64 64"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="drop-shadow-[0_0_12px_var(--cyber-cyan)]"
    >
      <defs>
        <linearGradient id="lg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%"  stopColor="var(--cyber-cyan)" />
          <stop offset="100%" stopColor="var(--cyber-red)" />
        </linearGradient>
      </defs>
      <path
        d="M32 4c-10 0-18 8-18 18 0 13 18 38 18 38s18-25 18-38c0-10-8-18-18-18z"
        fill="none" stroke="url(#lg)" strokeWidth="2.5"
      />
      <circle cx="32" cy="22" r="4" fill="var(--cyber-cyan)" />
      <motion.path
        d="M8 44 H22 L26 36 L32 52 L38 30 L42 44 H56"
        fill="none" stroke="var(--cyber-red)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatType: "loop", repeatDelay: 0.6 }}
      />
    </motion.svg>
  );
}
