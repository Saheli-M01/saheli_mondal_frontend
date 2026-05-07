import Image from "next/image";
import { MoveUpRight } from "lucide-react";

const featuredProject = {
  title: "GridFrodge",
  description:
    "A live frontend experience with a bold layout, sharp interactions, and a focused product showcase.",
  href: "https://gridforgefrontend-production.up.railway.app/",
  image: "/assets/play/gridfrodge.png",
};

export default function Play() {
  return (
    <main className="min-h-screen bg-[#07080c] text-white px-6 py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 30%), radial-gradient(circle at bottom right, rgba(255,255,255,0.06), transparent 28%)",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-10 max-w-2xl">
          <div className="text-[0.7rem] uppercase tracking-[0.35em] text-slate-400 mb-4">
            [ Play ]
          </div>
          <h1 className="text-lg md:text-xl  arcade-title ">
            Small experiments, live on the web.
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed">
            A place for interactive builds and shipped ideas. The featured card
            below links directly to GridFrodge.
          </p>
        </div>

        <a
          href={featuredProject.href}
          target="_blank"
          rel="noreferrer"
          className="group block max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:border-white/20"
        >
          <div className="grid md:grid-cols-[1.15fr_0.85fr] min-h-[520px]">
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

            <div className="p-8 md:p-10 flex flex-col justify-between gap-8">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">
                  Featured Project
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
                  Open the live build in a new tab.
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors group-hover:bg-white/10">
                  Visit GridFrodge
                  <MoveUpRight size={15} />
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </main>
  );
}
