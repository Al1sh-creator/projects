"use client";

import { motion } from "framer-motion";

interface RoughLineProps {
  className?: string;
  color?: string;
  delay?: number;
}

export default function RoughLine({ className = "", color = "rgba(255,255,255,0.1)", delay = 0 }: RoughLineProps) {
  // Generate a slightly "wobbly" path
  const path = "M0 2 Q 50 0, 100 2 T 200 1 T 300 3 T 400 1 T 500 2";

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 500 4"
        className="w-full h-full preserve-3d"
        preserveAspectRatio="none"
      >
        <motion.path
          d={path}
          fill="transparent"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 1.5,
            delay: delay,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}
