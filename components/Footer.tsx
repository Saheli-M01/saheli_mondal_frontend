import Link from "next/link";
import { GithubIcon, LinkedinIcon, XIcon, MailIcon } from "./icons/Icon";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black border-t border-slate-800 text-slate-400 py-8 z-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Copyright & Info */}
        <div className="text-center md:text-left">
          <p className="text-sm">
            &copy; {currentYear} Saheli Mondal. All rights reserved.
          </p>
          <p className="mt-1 text-xs opacity-60">
            Built with Next.js & Tailwind CSS.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/Saheli-M01"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-green-400 transition duration-300 transform hover:scale-110"
            title="GitHub"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/saheli-mondal-b9387729b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-400 transition duration-300 transform hover:scale-110"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/Mond_Saheli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan-400 transition duration-300 transform hover:scale-110"
            title="X (Twitter)"
          >
            <XIcon className="w-5 h-5" />
          </a>
          <a
            href="mailto:saheli.mondal.prof@gmail.com"
            className="text-gray-400 hover:text-red-400 transition duration-300 transform hover:scale-110"
            title="Email"
          >
            <MailIcon className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
