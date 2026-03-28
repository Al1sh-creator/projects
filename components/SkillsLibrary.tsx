"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SKILLS_DATA, Skill } from '@/lib/skills';
import { X, Sparkles, Box, Target } from 'lucide-react';

interface SkillsLibraryProps {
  onToggle3D?: () => void;
}

export default function SkillsLibrary({ onToggle3D }: SkillsLibraryProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 py-24 z-10 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-14 flex flex-col md:flex-row justify-between items-end gap-6"
      >
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#e5e2e1] mb-4">
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#abc7ff] to-[#007FFF]">Biblioteque</span>
          </h2>
          <p className="text-[#c4c7c7] text-lg max-w-2xl">
            An archive of technical expertise, organized into specialized, high-performance racks.
          </p>
        </div>

        <button 
          onClick={onToggle3D}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <Box className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Physical Archive</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {SKILLS_DATA.map((rack, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            className={`
              relative p-8 rounded-3xl bg-[#131313] border border-white/5 
              shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)] 
              flex flex-col gap-8 transition-all duration-500 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_15px_50px_rgba(0,0,0,0.6)]
              ${rack.colSpan}
              overflow-hidden group/rack
            `}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-700 group-hover/rack:opacity-30" style={{ background: `radial-gradient(circle at 50% 120%, ${rack.color}40, transparent 70%)` }} />

            <div className="flex items-center gap-3 relative z-10">
              <motion.div 
                animate={{ boxShadow: [`0 0 12px ${rack.color}80`, `0 0 20px ${rack.color}`, `0 0 12px ${rack.color}80`] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-1.5 h-5 rounded-full" 
                style={{ backgroundColor: rack.color }}
              />
              <h3 className="text-sm font-bold text-white tracking-[0.1em] uppercase">
                {rack.category}
              </h3>
            </div>

            <div className={`
              flex items-end gap-3 h-52 border-b border-[#2a2a2a] pb-[2px] w-full 
              overflow-x-auto overflow-y-hidden 
              [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
              relative z-10
            `}>
              <div 
                className="absolute bottom-0 left-0 right-0 h-40 opacity-30 blur-2xl pointer-events-none mix-blend-screen"
                style={{ background: `linear-gradient(to top, ${rack.color}, transparent)` }}
              />

              {rack.skills.map((skill, bIndex) => {
                const height = 130 + (Math.sin(bIndex * 45) * 40); 
                const isGlossy = bIndex % 2 === 0;
                const width = skill.name.length > 8 ? 'w-12' : 'w-10';

                return (
                  <motion.div 
                    key={bIndex}
                    whileHover={{ y: -24, scale: 1.05 }}
                    onClick={() => setSelectedSkill(skill)}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`
                      relative group flex-shrink-0 cursor-pointer overflow-hidden 
                      ${width}
                    `}
                    style={{ height: `${height}px` }}
                  >
                    <div 
                      className="absolute inset-0 rounded-sm border border-white/10 backdrop-blur-xl transition-all duration-300 group-hover:border-white/20 group-hover:brightness-125"
                      style={{
                        background: isGlossy 
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.1) 100%)' 
                          : 'rgba(255,255,255,0.06)',
                        borderLeftColor: `${rack.color}90`,
                        borderLeftWidth: '2px',
                        boxShadow: `inset 2px 0 10px rgba(0,0,0,0.6), inset -1px 0 3px rgba(255,255,255,0.2), 8px 0 15px rgba(0,0,0,0.4)`
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span 
                          className="text-[#e5e2e1] font-semibold text-[10px] md:text-xs tracking-widest opacity-70 whitespace-nowrap transform -rotate-90 origin-center transition-all duration-300 group-hover:opacity-100 group-hover:text-white group-hover:scale-110 drop-shadow-md"
                          style={{ textShadow: `0 0 8px ${rack.color}80` }}
                        >
                          {skill.name}
                        </span>
                      </div>
                      
                      {isGlossy && (
                         <div className="absolute top-0 bottom-0 left-[2px] w-[1px] bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none" />
                      )}
                      
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                        style={{ backgroundColor: rack.color }}
                      ></div>

                      {bIndex % 3 === 0 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#D4AF37]/60 rounded-sm filter blur-[0.5px]" />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Crystalline Lens Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSkill(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
              layoutId={`skill-${selectedSkill.name}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0e16] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-10 md:p-14"
            >
              {/* Decorative Scanning Ring */}
              <div className="absolute -top-10 -right-10 w-40 h-40 border border-white/5 rounded-full animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 border border-white/5 rounded-full animate-spin-slow" />

              <button 
                onClick={() => setSelectedSkill(null)}
                className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <Sparkles className="w-6 h-6 text-[#abc7ff]" />
                  </div>
                  <span className="text-[10px] technical-mono text-white/30 tracking-[.3em] uppercase underline-offset-8 decoration-white/20 underline">System.Artifact.v3</span>
                </div>

                <h3 className="text-5xl md:text-6xl editorial-title text-white mb-6">
                  {selectedSkill.name}
                </h3>

                <p className="text-xl text-white/60 leading-relaxed max-w-xl mb-12">
                  {selectedSkill.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Power Level */}
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-xs technical-mono text-white/40 uppercase">Aptitude Index</span>
                      <span className="text-2xl font-bold text-white">{selectedSkill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedSkill.level}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-[#007FFF] to-[#abc7ff]"
                      />
                    </div>
                  </div>

                  {/* Related Projects */}
                  <div>
                    <span className="text-xs technical-mono text-white/40 uppercase block mb-4">Deployment History</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.relatedProjects.length > 0 ? selectedSkill.relatedProjects.map(proj => (
                        <span key={proj} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/60 uppercase tracking-wider">
                          {proj}
                        </span>
                      )) : (
                        <span className="text-[10px] text-white/20 italic">No public records found</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-16 pt-10 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#007FFF]/50" />
                    <span className="text-[9px] technical-mono text-white/20 tracking-tighter">COORDINATE: // ARCHIVE.CORE.SEC-7</span>
                  </div>
                  <button 
                    onClick={() => setSelectedSkill(null)}
                    className="text-xs font-bold uppercase tracking-widest text-[#abc7ff] hover:text-white transition-colors"
                  >
                    Close Entry
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
