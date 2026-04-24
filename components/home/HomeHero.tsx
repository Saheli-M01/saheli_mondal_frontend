"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRightIcon,
  MailIcon,
  LinkedinIcon,
  GithubIcon,
  XIcon,
} from "@/components/icons/Icon";
import portrait from "@/public/assets/portrait.png";
import ContactModal from "@/components/ContactModal";

const lines = [
  ">> whoami",
  "Saheli Mondal — Full Stack Developer",
  "",
  ">> location",
  "Kolkata, India",
  "",
  ">> status",
  "Building real projects. Learning. Improving daily.",
];

const getTypingDelay = (line: string, charIndex: number) => {
  if (line === "") return 300;

  const char = line[charIndex] ?? "";

  let base = line.startsWith(">") ? 18 : 32;
  base += Math.random() * 40;

  if (char === " ") return base + 20;
  if (",.:;!".includes(char)) return base + 120;

  if (charIndex === line.length - 1 && line.startsWith(">")) {
    return base + 250;
  }

  return base;
};

export default function HomeHero() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    if (lineIndex >= lines.length) return;

    const currentLine = lines[lineIndex];
    const speed = getTypingDelay(currentLine, charIndex);

    const timeout = setTimeout(() => {
      if (charIndex < currentLine.length) {
        setText((prev) => prev + currentLine[charIndex]);
        setCharIndex(charIndex + 1);
      } else {
        setText((prev) => prev + "\n");
        setLineIndex(lineIndex + 1);
        setCharIndex(0);
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, lineIndex]);

  return (
    <section className="min-h-screen bg-black text-white relative overflow-hidden md:py-25 ">
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgb(122, 143, 166) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row items-center relative z-10 px-6 gap-12 md:gap-0 pt-24 md:pt-0">
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-72 h-[400px] md:w-96 md:h-[600px] group">
            <Image
              src={portrait}
              alt="Saheli"
              fill
              className="rounded-3xl grayscale contrast-110 transition duration-500 group-hover:brightness-110 object-cover"
            />
            <div className="absolute inset-0 rounded-3xl shadow-[0_0_100px_rgba(255,255,255,0.1)]" />
          </div>
        </div>

        <div className="w-full md:w-1/2 md:pl-12 space-y-8">
          <div className="arcade-title text-slate-400 text-[0.6rem] md:text-[0.8rem] mb-6">
            [ PORTFOLIO TERMINAL ]
          </div>

          <div className="bg-[#0D0D0D] h-60 terminal-content border border-slate-400/40 rounded-lg p-5 max-w-xl whitespace-pre-wrap overflow-hidden text-slate-300 bg-gray-900/50 text-sm md:text-md">
            {text}
            <span className="cursor-blink">▌</span>
          </div>

          <div className="flex gap-4 pt-4 body-content">
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className=" px-8 py-3 cursor-pointer rounded-full bg-slate-600 text-black sm:text-md hover:bg-slate-500 transition flex items-center gap-2"
            >
              Contact Me
              <ArrowRightIcon className="w-4 h-4" />
            </button>

            {/* <button
              type="button"
              onClick={() => router.push("/today")}
              className="px-8 py-3 rounded-full border border-slate-500 text-slate-400  sm:text-md hover:bg-slate-900 hover:text-white transition flex items-center gap-2 ar"
            >
              See Today
              <ArrowRightIcon className="w-4 h-4" />
            </button> */}
          </div>

          <div className="flex items-center gap-6 border-t border-zinc-700 mt-8 pt-2">
            <span className="text-slate-400 text-[0.55rem] md:text-[0.65rem] arcade-title">
              {">>>"} CONNECT:
            </span>
            <a
              href="https://github.com/Saheli-M01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-green-400 transition duration-300 transform hover:scale-125"
              title="GitHub"
            >
              <GithubIcon className="w-6 h-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/saheli-mondal-b9387729b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition duration-300 transform hover:scale-125"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-6 h-6" />
            </a>
            <a
              href="https://x.com/Mond_Saheli"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-cyan-400 transition duration-300 transform hover:scale-125"
              title="X (Twitter)"
            >
              <XIcon className="w-6 h-6" />
            </a>
            <a
              href="mailto:saheli.mondal.prof@gmail.com"
              className="text-gray-400 hover:text-red-400 transition duration-300 transform hover:scale-125"
              title="Email"
            >
              <MailIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </section>
  );
}
