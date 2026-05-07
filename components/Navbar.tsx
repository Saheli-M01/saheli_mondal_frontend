"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  HomeIcon,
  CalendarIcon,
  PlayIcon,
  MessageIcon,
  RadioIcon,
  SettingsIcon,
} from "./icons/Icon";
import { useViewMode } from "@/context/ViewModeContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { viewMode, setViewMode } = useViewMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const items = [
    { name: "Saheli", href: "/", icon: <HomeIcon /> },
    // { name: "Today", href: "/today", icon: <CalendarIcon /> },
    { name: "Play", href: "/play", icon: <PlayIcon /> },
    // { name: "Ask Me", href: "/ask", icon: <MessageIcon /> },
    { name: "Live", href: "#live", icon: <RadioIcon /> },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);
  return (
    <div className="fixed top-6 w-full flex justify-center z-50 body-content">
      <div
        className="flex items-center gap-2 sm:gap-6 px-4 sm:px-6 py-3 rounded-full 
                 bg-[#111] border border-gray-800 
                 shadow-lg backdrop-blur-md"
      >
        {items.map((item) => {
          const isHash = item.href.startsWith("#");

          if (item.href === "/") {
            return (
              <button
                key={item.href}
                onClick={() => {
                  if (pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    router.push("/");
                  }
                }}
                className={`cursor-pointer flex items-center gap-1 text-xs px-2 py-1 rounded-full transition ${
                  pathname === "/"
                    ? "text-white bg-gray-800"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          }

          if (isHash) {
            return (
              <button
                key={item.href}
                onClick={() => {
                  const id = item.href.replace("#", "");

                  if (pathname !== "/") {
                    router.push("/"); // go to home first

                    // wait for page render then scroll
                    setTimeout(() => {
                      document
                        .getElementById(id)
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  } else {
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="cursor-pointer flex items-center gap-1 text-xs px-2 py-1 rounded-full text-gray-400 hover:text-gray-200 transition"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          }

          // 👉 NORMAL LINKS
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full transition ${
                isActive
                  ? "text-white bg-gray-800"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="relative ml-2" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="cursor-pointer text-gray-400 hover:text-white p-2 rounded-full transition"
          >
            <SettingsIcon />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    setViewMode("recruiter");
                    setIsDropdownOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`cursor-pointer w-full text-left px-4 py-2 text-sm transition ${
                    viewMode === "recruiter"
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  Recruiter View
                </button>
                <button
                  onClick={() => {
                    setViewMode("personal");
                    setIsDropdownOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`cursor-pointer w-full text-left px-4 py-2 text-sm transition ${
                    viewMode === "personal"
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  Personal View
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
