"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Diamond, Sparkles } from "lucide-react";
import CrystalProjectCard from "./CrystalProjectCard";
import CustomCursor from "./CustomCursor";
import { useState } from "react";

const PROJECTS = [
  {
    index: "01",
    title: "Athenify",
    description: "An AI-powered debate platform where users can engage in structured arguments with dynamic AI personas.",
    tags: ["Next.js", "Gemini AI", "TailwindCSS"],
    github: "http://github.com",
    color: "#00f2ff",
    size: "bento-large"
  },
  {
    index: "02",
    title: "Harmonium",
    description: "A digital musical instrument application simulating a traditional harmonium.",
    tags: ["React", "Web Audio API", "GSAP"],
    github: "http://github.com",
    color: "#ff00ea",
    size: "bento-medium"
  },
  {
    index: "03",
    title: "Payment Tracker",
    description: "A financial dashboard for tracking payments and analytics with real-time visualization.",
    tags: ["React", "D3.js", "Firebase"],
    github: "http://github.com",
    color: "#7000ff",
    size: "bento-small"
  },
  {
    index: "04",
    title: "The Stone Tablets",
    description: "A prehistoric-themed blog featuring a 3D rotating tablet and archive filtering.",
    tags: ["Next.js", "Three.js", "Markdown"],
    github: "http://github.com",
    color: "#f49d25",
    size: "bento-medium"
  },
  {
    index: "05",
    title: "Project Cosmos",
    description: "The core 3D portfolio universe connecting all digital artifacts.",
    tags: ["Three.js", "WebGL", "GSAP"],
    github: "http://github.com",
    color: "#00ffcc",
    size: "bento-small"
  }
];

export default function ProjectsVault() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen pb-40">
      <CustomCursor />
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-10 mix-blend-difference">
        <div className="max-w-7xl mx-auto flex justify-between items-end">
          <a
            href="http://localhost:8080"
            className="group flex flex-col gap-1 text-white/40 hover:text-white transition-all duration-300"
          >
            <span className="technical-mono text-[8px]">Esc // System</span>
            <span className="flex items-center gap-2 font-bold uppercase tracking-tighter text-xs">
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Return to Cosmos
            </span>
          </a>
          <div className="flex flex-col items-end">
            <span className="technical-mono text-[8px] text-white/40 mb-1">Authenticated Entry</span>
            <div className="flex items-center gap-2">
              <Diamond className="w-4 h-4 text-white/60" />
              <span className="text-2xl editorial-title text-white">परियोजना .ALISH</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-60 pb-32 px-12 relative">
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="technical-mono text-white/30 block mb-6">// Mission.Database.v2</span>
            <h1 className="editorial-title text-7xl md:text-9xl mb-8">
              Digital <span className="text-white/20 italic">Artifacts</span> & <br />
              Experimental <span className="italic">Systems</span>
            </h1>
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <p className="text-white/40 max-w-lg text-xl font-serif italic border-l border-white/10 pl-8 leading-snug">
                A curated collection of human-made digital sculptures. Each entry is a unique refraction of technology and design.
              </p>
              <div className="flex gap-4">
                {["all", "next.js", "react", "three.js"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`technical-mono text-[10px] px-4 py-2 border rounded-full transition-all ${filter === f ? "border-white text-white" : "border-white/10 text-white/30 hover:text-white/60"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* The Bento Grid */}
      <main className="max-w-7xl mx-auto px-12">
        <div className="bento-grid">
          {PROJECTS.filter(p => filter === "all" || p.tags.some(t => t.toLowerCase() === filter)).map((project) => (
            <div key={project.title} className={project.size}>
              <CrystalProjectCard project={project} />
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-60 border-t border-white/5 py-20 px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 opacity-20">
          <div>
            <p className="technical-mono text-[10px] mb-2">System Status</p>
            <p className="text-xs uppercase font-bold tracking-[0.3em]">All Systems Nominal</p>
          </div>
          <div className="text-right">
            <p className="technical-mono text-[10px] mb-2">Coordinates</p>
            <p className="text-xs uppercase font-bold tracking-[0.3em]">α-Centauri // Sector 7G</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
