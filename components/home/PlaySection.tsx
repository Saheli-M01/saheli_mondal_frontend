"use client";

import Image from "next/image";
import Link from "next/link";
import { MoveUpRight } from "lucide-react";

const featuredProject = {
  title: "GridFrodge",
  description:
    "A real-time multiplayer grid game. Claim cells, build streaks, drop bombs — all live with other players.",
  href: "/play/grid-frodge",
  image: "/assets/play/gridfrodge.png",
};

export default function PlaySection() {
  return (
    <section
      id="play"
      className="bg-black text-white px-6 py-20 max-w-7xl mx-auto"
    >
      <div className="max-w-7xl mx-auto border-t border-slate-700/70 pt-10">
        {/* HEADING */}
        <div className="mb-16 text-center">
          <div className="arcade-title text-slate-400 text-[0.6rem] md:text-[0.8rem]">
            <h2>[ PLAY ]</h2>
          </div>
          <p className="mt-3 text-center max-w-full text-sm md:text-base text-slate-400 body-content">
            Small experiments, live on the web.
          </p>
        </div>

        {/* CARD */}
        <div className="flex justify-center">
          <Link
            href={featuredProject.href}
            className="group block w-full max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:border-white/20"
          >
            <div className="grid md:grid-cols-[1.15fr_0.85fr] min-h-[520px]">
              {/* IMAGE */}
              <div className="relative bg-[#0c0d12] border-b md:border-b-0 md:border-r border-white/10 min-h-[320px] md:min-h-full">
                <Image
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="p-8 md:p-10 flex flex-col justify-between gap-8">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">
                    Featured Experiment
                  </div>
                  <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                    {featuredProject.title}
                  </h2>
                  <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-md">
                    {featuredProject.description}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <span className="text-sm text-slate-500">
                    Play live, right here.
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors group-hover:bg-white/10">
                    Play GridFrodge
                    <MoveUpRight size={15} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
