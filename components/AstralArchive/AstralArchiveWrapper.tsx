"use client";

import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const AstralArchive = dynamic(() => import("./AstralArchive"), {
  ssr: false,
});

export default function AstralArchiveWrapper() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-[#020202] flex items-center justify-center text-white/20 font-bold tracking-widest animate-pulse">CREATING ASTRAL CORE...</div>}>
      <AstralArchive />
    </Suspense>
  );
}
