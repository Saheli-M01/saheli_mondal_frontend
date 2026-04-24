"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "@/components/icons/Icon"; // Assuming XIcon works as close button, or we can use an SVG

export default function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/saheli.mondal.prof@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          onClose();
        }, 3000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-[#0a0a0a] border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Let's Connect</h2>
            <p className="text-slate-400 text-sm mb-6">
              Fill out the form below and I'll get back to you as soon as possible.
            </p>

            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center text-green-400"
              >
                <svg
                  className="w-12 h-12 mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="font-semibold">Message sent successfully!</p>
                <p className="text-sm mt-1 opacity-80">I'll be in touch soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Anti-spam honeypot */}
                <input type="text" name="_honey" style={{ display: "none" }} />
                {/* Disable captcha */}
                <input type="hidden" name="_captcha" value="false" />

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-[#111] border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-[#111] border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-[#111] border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 transition resize-none"
                    placeholder="Your message here..."
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm">Oops! Something went wrong. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-white text-black font-semibold rounded-lg px-4 py-3 hover:bg-slate-200 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {status === "submitting" ? (
                    <span className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
