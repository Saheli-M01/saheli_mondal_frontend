"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { GithubIcon, ArrowRightIcon } from "@/components/icons/Icon";

type LiveProject = {
  name: string;
  status: string;
  stack: string[];
  description: string;
  image: string;
  live: string;
  github: string;
};

const liveProjects: LiveProject[] = [
  {
    name: "Portfolio Terminal",
    status: "Live",
    stack: ["Next.js", "Tailwind"],
    description:
      "Interactive personal site with terminal-inspired UI and dynamic sections.",
    image: "/projects/portfolio.png",
    live: "#",
    github: "#",
  },
  {
    name: "Chat Notes",
    status: "In Progress",
    stack: ["React", "Firebase"],
    description:
      "Thread-based notes app with fast search and structured conversations.",
    image: "/projects/chatnotes.png",
    live: "#",
    github: "#",
  },
  {
    name: "Focus Sprint",
    status: "Live",
    stack: ["TypeScript", "Framer Motion"],
    description:
      "Productivity timer with analytics and weekly performance tracking.",
    image: "/projects/focus.png",
    live: "#",
    github: "#",
  },
  {
    name: "API Monitor",
    status: "Planned",
    stack: ["Node.js", "PostgreSQL"],
    description: "Monitor uptime, latency, and incidents across your services.",
    image: "/projects/api.png",
    live: "#",
    github: "#",
  },
];

// ─── Each card is its own component so hooks are called at the top level ───────
function ProjectCard({
  project,
  index,
  total,
  containerRef,
}: {
  project: LiveProject;
  index: number;
  total: number;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Cards compress toward a smaller scale as scroll progresses
  const scale = useTransform(
    scrollYProgress,
    [index / total, 1],
    [1, 1 - (total - index) * 0.04],
  );

  // Cards drift slightly upward as later cards stack over them
  const y = useTransform(
    scrollYProgress,
    [index / total, 1],
    [0, -(total - index) * 12],
  );

  return (
    <div className="sticky top-24 flex justify-center pb-8">
      <motion.div
        style={{ scale, y }}
        className="w-full max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] overflow-hidden origin-top"
      >
        {/* IMAGE */}
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>

        {/* CONTENT */}
        <div className="p-5 md:p-6">
          {/* TITLE + STATUS */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg md:text-xl font-semibold">{project.name}</h3>
            <span className="text-[10px] uppercase tracking-wider border border-white/20 px-2 py-0.5 rounded-full text-slate-300">
              {project.status}
            </span>
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm text-slate-400 mb-4">{project.description}</p>

          {/* STACK */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* LINKS */}
          <div className="flex items-center gap-4">
            <Link
              href={project.live}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-white hover:opacity-80"
            >
              Live
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
            <Link
              href={project.github}
              className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-white"
            >
              <GithubIcon className="w-4 h-4" />
              Code
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function LiveSection() {
  // This ref wraps the entire card stack — scroll progress is derived from it
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="bg-black text-white px-6 py-20  max-w-7xl mx-auto"
      id="live"
    >
      <div className="max-w-7xl mx-auto border-t border-slate-700/70 pt-10">
        {/* HEADING */}
        <div className="mb-16 text-center">
          <div className="arcade-title text-slate-400 text-[0.6rem] md:text-[0.8rem]">
            [ LIVE PROJECTS ]
          </div>
          <p className="mt-3 text-center max-w-full text-sm md:text-base text-slate-400 body-content">
            Things I'm Building & Shipping
          </p>
        </div>

        {/*
          The container's natural height drives the scroll distance.
          Each card is `sticky`, so they layer on top of one another
          as the user scrolls through the section.
        */}
        <div ref={containerRef}>
          {liveProjects.map((project, i) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={i}
              total={liveProjects.length}
              containerRef={containerRef}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
