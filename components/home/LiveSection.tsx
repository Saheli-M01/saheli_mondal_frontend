"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRightIcon } from "@/components/icons/Icon";

type LiveProject = {
  name: string;
  status: string;
  stack: string[];
  description: string;
  image: string;
  live: string;
};

const liveProjects: LiveProject[] = [
  {
    name: "Visco",
    status: "1st phase deployed",
    stack: ["React", "Tailwind", "Vite"],
    description:
      "An interactive platform for visualizing data structures and algorithms through smooth animations and real-time code representation, making complex concepts easier to understand.",
    image: "/assets/project/visco.png",
    live: "https://visualizecode.vercel.app/",
  },
  {
    name: "Speak Your Mind",
    status: "deployed",
    stack: ["Next.js", "Tailwind", "Firebase"],
    description:
      "A modern social platform that allows users to share thoughts, stories, and ideas in a clean, distraction-free environment while enabling real-time interaction.",
    image: "/assets/project/speak_your_mind.png",
    live: "https://speak-your-mind-three.vercel.app/",
  },
  {
    name: "Portfolio Terminal",
    status: "1st phase deployed",
    stack: ["Next.js", "Tailwind", "Framer Motion", "Springboot",],
    description:
      "A unique terminal-inspired portfolio featuring interactive commands, dynamic transitions, and a developer-centric user experience.",
    image: "/assets/project/portfolio.png",
    live: "https://sahelimondal.in",
  },
  {
    name: "GetDoIt",
    status: "working",
    stack: ["Next.js", "PostgreSQL", "OpenAI API", "Springboot", "Firebase"],
    description:
      "A full-featured task management application designed to streamline productivity with structured workflows, intuitive UI, and scalable backend integration.",
    image: "/assets/project/get_do_it.png",
    live: "https://getdoit.in",
  },
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "deployed":
      return "text-emerald-400 border-emerald-400/30 bg-emerald-400/10";
    case "1st phase deployed":
      return "text-blue-400 border-blue-400/30 bg-blue-400/10";
    case "working":
      return "text-amber-400 border-amber-400/30 bg-amber-400/10";
    default:
      return "text-slate-300 border-white/20 bg-white/5";
  }
};

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
  containerRef: React.RefObject<HTMLDivElement | null>;
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
            <span className={`text-[10px] uppercase tracking-wider border px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
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
                className="text-[12px] px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
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
