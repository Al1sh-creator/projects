"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configuration for smooth movement
  const springConfig = { damping: 25, stiffness: 200 };
  const sx = useSpring(mouseX, springConfig);
  const sy = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setCoords({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest('.crystal-card, button, a'));
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[10000] hidden md:block">
      {/* The Main Crosshair */}
      <motion.div
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
        className="absolute w-8 h-8 flex items-center justify-center"
      >
        <div className="absolute w-full h-[1px] bg-white/20" />
        <div className="absolute h-full w-[1px] bg-white/20" />
        
        {/* The Outer Loupe */}
        <motion.div 
          animate={{ 
            width: isHovering ? 48 : 24, 
            height: isHovering ? 48 : 24,
            borderWidth: isHovering ? 2 : 1,
            borderColor: isHovering ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)"
          }}
          className="rounded-full border transition-colors duration-300" 
        />
        
        {/* Technical Data Label */}
        <motion.div 
          animate={{ opacity: isHovering ? 1 : 0, x: 40 }}
          className="absolute left-0 technical-mono text-[8px] text-white/40 whitespace-nowrap bg-black/40 px-2 py-1 backdrop-blur-md rounded-sm"
        >
          LOC_X: {Math.round(coords.x)} <br />
          LOC_Y: {Math.round(coords.y)} <br />
          SENS_AUTO: OK
        </motion.div>
      </motion.div>
      
      {/* Hide standard cursor */}
      <style jsx global>{`
        body, a, button, .crystal-card {
          cursor: none !important;
        }
      `}</style>
    </div>
  );
}
