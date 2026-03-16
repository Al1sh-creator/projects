"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, X, FileText, Calendar, ShieldCheck } from "lucide-react";
import { useState } from "react";
import RoughLine from "./RoughLine";

interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  link?: string;
  color: string;
  index: string;
}

export default function CrystalProjectCard({ project }: { project: Project }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <motion.div
        layoutId={`card-${project.index}`}
        onClick={() => setIsExpanded(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group h-full cursor-none active:scale-[0.98] transition-transform"
      >
        {/* The "Index Card" Container */}
        <div className="relative h-full crystal-card rounded-sm overflow-hidden flex flex-col p-8 border-l-2" style={{ borderLeftColor: project.color }}>
          
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          <div className="flex justify-between items-start mb-12">
            <div className="flex flex-col gap-1">
              <span className="technical-mono text-[10px] text-white/30 tracking-[0.4em]">Index No.</span>
              <span className="technical-mono text-lg font-bold text-white/60">{project.index}</span>
            </div>
            <ArrowUpRight size={18} className="text-white/20 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>

          <div className="flex-grow">
            <h3 className="editorial-title text-4xl mb-6 group-hover:text-white transition-colors">
              {project.title}
            </h3>
            <p className="font-serif italic text-white/40 text-lg leading-snug mb-8 max-w-[90%]">
              {project.description}
            </p>
          </div>

          <div className="mt-auto">
            <RoughLine color={project.color} className="h-2 mb-6" />
            
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {project.tags.map((tag) => (
                <span key={tag} className="technical-mono text-[9px] text-white/30">
                  //{tag}
                </span>
              ))}
            </div>
          </div>

          {isHovered && <div className="light-sweep z-20" />}
        </div>
      </motion.div>

      {/* Expanded Dossier Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-none"
            />
            
            <motion.div
              layoutId={`card-${project.index}`}
              className="relative w-full max-w-4xl bg-[#0a0f18] border border-white/10 rounded-sm overflow-hidden flex flex-col md:flex-row h-[80vh] cursor-none"
            >
              {/* Sidebar Info */}
              <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-white/5 bg-black/20">
                <div className="flex justify-between items-start mb-12">
                   <div className="technical-mono text-[10px] text-white/20 pb-4 border-b border-white/5 w-full">
                      Archival // Record.System
                   </div>
                   <button onClick={() => setIsExpanded(false)} className="text-white/40 hover:text-white transition-colors">
                      <X size={20} />
                   </button>
                </div>

                <div className="mb-12">
                  <h2 className="editorial-title text-5xl mb-4 text-white" style={{ color: project.color }}>{project.title}</h2>
                  <p className="technical-mono text-[10px] text-white/40 tracking-[0.3em]">MISSION CONTROL // AUTH_LEVEL_7</p>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-white/40">
                      <Calendar size={14} />
                      <span className="technical-mono text-[9px]">Date: 2024.03.ARCHIVE</span>
                   </div>
                   <div className="flex items-center gap-3 text-white/40">
                      <ShieldCheck size={14} />
                      <span className="technical-mono text-[9px]">Status: PRODUCTION_READY</span>
                   </div>
                   <div className="flex items-center gap-3 text-white/40">
                      <FileText size={14} />
                      <span className="technical-mono text-[9px]">Type: DIGITAL_ARTIFACT</span>
                   </div>
                </div>

                <div className="mt-12 flex flex-col gap-4">
                   {project.github && (
                     <a href={project.github} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/20 transition-all rounded-sm group">
                        <span className="technical-mono text-[10px]">Source Repository</span>
                        <Github size={16} className="text-white/40 group-hover:text-white" />
                     </a>
                   )}
                   <a href="#" className="flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-white/20 transition-all rounded-sm group">
                      <span className="technical-mono text-[10px]">Launch Deployment</span>
                      <ExternalLink size={16} className="text-white/40 group-hover:text-white" />
                   </a>
                </div>
              </div>

              {/* Main Report Body */}
              <div className="flex-grow p-12 overflow-y-auto custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat opacity-90 overflow-x-hidden">
                <div className="max-w-xl">
                  <h4 className="technical-mono text-[10px] text-white/30 mb-8 border-b border-white/5 pb-2">Technical Dossier // Overview</h4>
                  
                  <p className="font-serif italic text-2xl text-white/80 leading-relaxed mb-12">
                    "{project.description} This initiative represents a core refraction of our current technological capabilities, pushing the boundaries of human-computer interaction through specialized digital aesthetics."
                  </p>

                  <div className="grid grid-cols-2 gap-12 mb-20">
                     <div>
                        <h5 className="technical-mono text-[9px] text-white/40 mb-4 tracking-widest">Stack.Components</h5>
                        <ul className="space-y-2">
                           {project.tags.map(t => (
                             <li key={t} className="technical-mono text-[11px] text-white/60">{"->"} {t}</li>
                           ))}
                        </ul>
                     </div>
                     <div>
                        <h5 className="technical-mono text-[9px] text-white/40 mb-4 tracking-widest">System.Hash</h5>
                        <p className="technical-mono text-[10px] text-white/20 break-all leading-tight">
                           0x7f4c19...9e3a // SECURE_ARCHIVE_ID_{project.index}
                        </p>
                     </div>
                  </div>

                  <RoughLine color={project.color} className="h-4 mb-20" />

                  <div className="opacity-30">
                     <p className="technical-mono text-[8px] leading-loose">
                        TERMINAL_LOG: INITIALIZING_VAULT_RECOVERY... <br />
                        ACCESSING_ENCRYPTED_SECTOR... <br />
                        ARTIFACT_DECRYPTION_SUCCESSFUL. <br />
                        READING_METADATA_STREAM_v2.0.1...
                     </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
