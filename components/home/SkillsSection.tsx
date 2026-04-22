"use client";

import { Fragment, useEffect, useState } from "react";
import StackIcon from "tech-stack-icons";

type SkillCell = {
  label: string;
};

const matrix: SkillCell[][] = [
  [{ label: "Frontend" }, { label: "Backend" }],
  [{ label: "Languages" }, { label: "Others" }],
];

const matrixOrder = [
  { row: 0, col: 0 },
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
];

const skillsMap: Record<string, string[]> = {
  Frontend: [
    "react",
    "vercel",
    "nextjs",
    "html5",
    "bootstrap5",
    "css3",
    "sass",
    "tailwindcss",
    "swiper",
    "framer",
    "gsap",
  ],
  Backend: ["spring"],
  Languages: ["java", "js", "c++"],
  Others: [
    "postgresql",
    "postman",
    "neon",
    "cloudinary",
    "git",
    "figma",
    "github",
  ],
};

export default function SkillsSection() {
  const [activeCell, setActiveCell] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActiveCell((prev) => (prev + 1) % matrixOrder.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [paused]);

  const activePosition = matrixOrder[activeCell];
  const activeSkill = matrix[activePosition.row][activePosition.col];
  const icons = skillsMap[activeSkill.label];

  return (
    <section className="bg-black px-6 py-10 text-white border-t border-slate-700/70 max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto mb-8  pt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="arcade-title text-slate-400 text-[0.6rem] md:text-[0.8rem]">
            [ SKILL MATRIX ]
          </div>
          <p className="mt-3 max-w-2xl text-sm md:text-base text-slate-400 body-content">
            A compact matrix of the stack I use most often.
          </p>
        </div>
        <div className="terminal-content text-xs md:text-sm text-slate-500">
          {">"} hover a cell to pin the icon set
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-2">
        {/* MATRIX */}
        <div
          className="relative rounded-2xl border border-slate-400/25 bg-[#0D0D0D]/95 p-6 shadow-[0_0_70px_rgba(255,255,255,0.04)] font-mono overflow-hidden"
          onMouseLeave={() => setPaused(false)}
        >
          <div className="px-14 ">
            {/* top index */}
            <div className="grid grid-cols-[1fr_1fr] text-center text-xs text-slate-400 mb-4 pl-8 pr-8 border-b border-slate-700/70 pb-3">
              <div>0</div>
              <div>1</div>
            </div>

            {/* matrix */}
            <div className="relative">
              <div className="pointer-events-none absolute left-[28px] top-0 bottom-0 w-px bg-slate-700/70" />
              <div className="grid grid-cols-[28px_repeat(2,1fr)] gap-x-8 gap-y-8 items-center">
                {matrix.map((row, r) => (
                  <Fragment key={r}>
                    <div className="text-xs text-slate-400 flex items-center justify-center min-h-24">
                      {r}
                    </div>
                    {row.map((cell, c) => {
                      const index = matrixOrder.findIndex(
                        (p) => p.row === r && p.col === c,
                      );
                      const isActive = index === activeCell;

                      return (
                        <div
                          key={cell.label}
                          onMouseEnter={() => {
                            setActiveCell(index);
                            setPaused(true);
                          }}
                          className={`relative min-h-20 flex items-center justify-center cursor-pointer transition-all duration-300 rounded-xl px-4 py-8 text-center
                          ${
                            isActive
                              ? "bg-slate-800/40 shadow-[0_0_18px_rgba(255,255,255,0.02)] text-white"
                              : "text-slate-200/90"
                          }`}
                        >
                          <span className="absolute top-2 left-3 text-[10px] text-slate-500">
                            [{r}][{c}]
                          </span>
                          <span className="text-sm md:text-base">
                            {cell.label}
                          </span>
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FLOATING ICONS */}
        <div className="relative min-h-[200px] overflow-hidden rounded-2xl border border-slate-200/60 bg-gray-800/40 p-6 shadow-[0_0_70px_rgba(255,255,255,0.08)]">
          <div className="relative z-10 mb-5 flex items-center justify-between gap-4">
            <div className="text-slate-300 font-mono text-sm">
              {"> " + activeSkill.label.toLowerCase()}
            </div>
            <div className="text-[10px] md:text-xs text-slate-500 terminal-content uppercase tracking-[0.25em]">
              floating stack
            </div>
          </div>

          <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(148,163,184,0.24)_1px,transparent_1px)] bg-[length:22px_22px]" />

          <div className="relative z-10 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4">
            {icons.map((icon, i) => (
              <div
                key={`${activeSkill.label}-${icon}-${i}`}
                className="flex h-14 w-14 items-center justify-center rounded-md border border-slate-300/60 bg-white/95 text-slate-900 shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                style={{
                  animation: "float 4.8s ease-in-out infinite",
                  animationDelay: `${(i % 6) * 0.18}s`,
                }}
                title={icon}
              >
                <StackIcon name={icon} className="h-9 w-9" variant="light" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FLOAT ANIMATION */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
}
