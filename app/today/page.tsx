"use client";

import { motion } from "framer-motion";

const todayAgenda = [
  { time: "09:00 AM", title: "Deep Work", description: "Building new features for GetDoIt and optimizing database queries." },
  { time: "11:30 AM", title: "Learning", description: "Reading about System Design and exploring advanced Next.js patterns." },
  { time: "02:00 PM", title: "Open Source", description: "Reviewing PRs and contributing to community projects." },
  { time: "05:00 PM", title: "Fitness", description: "Evening workout session to stay healthy and active." },
  { time: "08:00 PM", title: "Side Project", description: "Prototyping a new interactive UI component library." },
];

export default function Today() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 pb-20 px-6 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(to right, rgb(122, 143, 166) 1px, transparent 1px), linear-gradient(to bottom, rgb(122, 143, 166) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="arcade-title text-slate-400 text-xs mb-4">[ TODAY'S LOG ]</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">What I'm doing today</h1>
          <p className="text-slate-400 text-lg">A glimpse into my daily routine and current focus.</p>
        </motion.div>

        <div className="relative pl-8 md:pl-0">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2" />
          <div className="md:hidden absolute left-[15px] top-0 bottom-0 w-px bg-slate-800" />

          {todayAgenda.map((item, i) => (
            <motion.div
              key={item.time}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 + 0.2 }}
              className={`relative mb-12 flex flex-col md:flex-row items-start ${
                i % 2 === 0 ? "md:justify-start" : "md:justify-end"
              }`}
            >
              <div className="absolute left-[-29px] md:left-1/2 md:-translate-x-1/2 top-1 w-4 h-4 rounded-full bg-[#111] border-2 border-slate-500 z-10" />
              
              <div
                className={`w-full md:w-5/12 ${
                  i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                }`}
              >
                <div className="text-sm text-slate-500 font-mono mb-2">{item.time}</div>
                <div className="bg-[#111] border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
