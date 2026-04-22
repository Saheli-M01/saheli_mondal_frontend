"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  CalendarIcon,
  PlayIcon,
  MessageIcon,
  RadioIcon,
  SettingsIcon,
} from "./icons/Icon";

export default function Navbar() {
  const pathname = usePathname();
  const items = [
    { name: "Saheli", href: "/", icon: <HomeIcon /> },
    // { name: "Today", href: "/today", icon: <CalendarIcon /> },
    // { name: "Play", href: "/play", icon: <PlayIcon /> },
    { name: "Ask Me", href: "/ask", icon: <MessageIcon /> },
    { name: "Live", href: "/live", icon: <RadioIcon /> },
  ];
  return (
    <div className="fixed top-6 w-full flex justify-center z-50">
      <div
        className="flex items-center gap-6 px-6 py-3 rounded-full 
                      bg-[#111] border border-gray-800 
                      shadow-lg backdrop-blur-md"
      >
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 text-xs transition-all duration-300 px-2 py-1 rounded-full body-content ${isActive ? "text-white bg-gray-800" : "text-gray-400 hover:text-gray-200"}`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
        {/* Settings Icon */}
        <button className="text-gray-400 hover:text-white p-2 rounded-full ml-2">
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
}
