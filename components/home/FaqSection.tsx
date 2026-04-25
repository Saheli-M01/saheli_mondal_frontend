"use client";
import { useState } from "react";

const faqs = [
  {
    question: "C:\\Users\\Guest> whoami",
    answer:
      "Saheli Mondal — Full-stack developer focused on building scalable, performant, and user-centric web applications."
  },
  {
    question: "C:\\Users\\Guest> cat skills.json",
    answer:
      "{\n  frontend: [React, Next.js, TailwindCSS, Framer Motion],\n  backend: [Node.js, Spring Boot],\n  databases: [PostgreSQL],\n  core: [DSA, OOPS, LLD]\n}"
  },
  {
    question: "C:\\Users\\Guest> ls projects/",
    answer:
      "- GetDoIt → Full-stack task manager with live deployment\n- Portfolio → Terminal-inspired personal site\n- Visco → Algorithm visualizer with animations\n- Soeak-Your-Mond → Role based latform for therapist\nMore coming soon..."
  },
  {
    question: "C:\\Users\\Guest> ping mindset -n 1",
    answer:
      "Reply from mindset: growth-focused\nStatus: Consistently learning, building, and improving."
  },
  {
    question: "C:\\Users\\Guest> grep -i \"goal\" career.txt",
    answer:
      "→ Crack a SDE role\n→ Build impactful products \n→ Master system design + scalable architectures"
  },
  {
    question: "C:\\Users\\Guest> ./hire_me.sh",
    answer:
      "Initializing...\n\n✔ Problem solver mindset\n✔ Strong frontend + backend foundation\n✔ Fast learner, team player\n\nReady to contribute from Day 0."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-black text-white px-6 py-20 max-w-7xl mx-auto border-t border-slate-700/70">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <div className="arcade-title text-slate-400 text-[0.6rem] md:text-[0.8rem]">
            [ F.A.Q ]
          </div>
          <p className="mt-3 text-center max-w-full text-sm md:text-base text-slate-400 body-content">
            System Queries
          </p>
        </div>

        <div className="rounded-lg border border-gray-700 bg-[#0c0c0c] overflow-hidden shadow-2xl font-mono text-sm md:text-base">
          {/* Terminal Header - Windows CMD Style */}
          <div className="bg-[#1f1f1f] px-3 py-2 flex items-center justify-between border-b border-gray-700">

            {/* Left: Icon + Title */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-black border border-gray-500 flex items-center justify-center text-[10px] font-bold">
                C
              </div>
              <span className="text-xs text-gray-300 font-sans">
                Command Prompt
              </span>
            </div>

            {/* Right: Window Controls */}
           
          </div>
          {/* Terminal Body */}
          <div className="p-4 md:p-6 space-y-4">
            <div className="text-gray-400 mb-6">
              Microsoft Windows [Version 10.0.19045.4291]<br />
              (c) Microsoft Corporation. All rights reserved.
            </div>

            {faqs.map((faq, index) => (
              <div key={index} className="space-y-2">
                <button
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                  className="w-full text-left flex items-start hover:text-gray-300 transition-colors focus:outline-none"
                >
                  <span className="text-white">{faq.question}</span>
                  {openIndex === index ? null : (
                    <span className="ml-2 animate-pulse text-gray-500">
                      _
                    </span>
                  )}
                </button>

                {openIndex === index && (
                  <div className="text-gray-400 pl-4 border-l-2 border-gray-700 ml-2 whitespace-pre-line">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center mt-4">
              <span className="text-white">C:\Users\Guest&gt;</span>
              <span className="ml-2 w-2 h-4 bg-gray-400 animate-pulse inline-block"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}