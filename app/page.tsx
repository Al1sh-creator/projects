"use client";

import { useState } from "react";
import ProjectsVault from "@/components/ProjectsVault";
import SkillsLibrary from "@/components/SkillsLibrary";
import AstralArchiveWrapper from "@/components/AstralArchive/AstralArchiveWrapper";

export default function Home() {
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');

  return (
    <main className="bg-[#0a0e16] min-h-screen text-white pb-24 font-sans antialiased selection:bg-[#abc7ff]/30">
      <ProjectsVault />
      
      {viewMode === '2D' ? (
        <SkillsLibrary onToggle3D={() => setViewMode('3D')} />
      ) : (
        <div className="relative group">
          <AstralArchiveWrapper />
          <button 
            onClick={() => setViewMode('2D')}
            className="absolute top-12 right-12 z-50 flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
          >
            <span className="text-xs font-bold uppercase tracking-widest">Digital Grid</span>
          </button>
        </div>
      )}
    </main>
  );
}
