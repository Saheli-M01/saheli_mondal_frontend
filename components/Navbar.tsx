"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const router = useRouter();
  const items = [
    { name: "Saheli", href: "/", icon: <HomeIcon /> },
    // { name: "Today", href: "/today", icon: <CalendarIcon /> },
    // { name: "Play", href: "/play", icon: <PlayIcon /> },
    { name: "Ask Me", href: "/ask", icon: <MessageIcon /> },
    { name: "Live", href: "#live", icon: <RadioIcon /> },
  ];
  return (
    <div className="fixed top-6 w-full flex justify-center z-50 body-content">
      <div
        className="flex items-center gap-6 px-6 py-3 rounded-full 
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

        <button className="text-gray-400 hover:text-white p-2 rounded-full ml-2">
          <SettingsIcon />
        </button>
      </div>
    </div>
  );
}
