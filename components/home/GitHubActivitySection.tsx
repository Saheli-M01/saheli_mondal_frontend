"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GitCommitHorizontal, FolderPlus } from "lucide-react";

import type { ActivityItem } from "../../lib/github/route";

type GitHubActivitySectionProps = {
  username?: string;
};

function Skeleton() {
  return (
    <div className="space-y-6 max-w-3xl border-l-[2px] border-white/10 ml-[19px] sm:ml-[23px] pl-6 sm:pl-8 py-4 min-h-[400px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="relative animate-pulse">
          <div className="absolute -left-[40px] sm:-left-[48px] top-0 w-7 h-7 rounded-full bg-white/5 shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-4 bg-white/5 rounded w-1/3" />
            <div className="h-4 bg-white/5 rounded w-2/3" />
            <div className="h-4 bg-white/5 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GitHubActivitySection({
  username = "Saheli-M01",
}: GitHubActivitySectionProps) {
  const [events, setEvents] = useState<ActivityItem[]>([]);
  const [totalRepos, setTotalRepos] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/github?username=${encodeURIComponent(username)}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events ?? []);
        setTotalRepos(data.totalRepos ?? 0);
      })
      .finally(() => setLoading(false));
  }, [username]);

  const allPushes = events.filter((e) => e.type === "push");
  const creates = events.filter((e) => e.type === "create");

  const totalCommits = allPushes.reduce(
    (acc, curr) => acc + (curr.commitCount || 0),
    0,
  );

  const pushes = allPushes.slice(0, 5);

  const maxCommit =
    pushes.length > 0
      ? Math.max(...pushes.map((p) => p.commitCount || 1), 1)
      : 1;

  return (
    <section
      className="bg-black text-white px-6 md:py-20 max-w-7xl mx-auto"
      id="github-activity"
    >
      <div className="max-w-7xl mx-auto border-t border-slate-700/70 pt-10 font-sans min-h-[600px]">
        {/* HEADING */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="arcade-title text-slate-400 text-[0.6rem] md:text-[0.8rem]">
              [ Github ]
            </div>
            <p className="mt-3 text-center max-w-full text-sm md:text-base text-slate-400 body-content">
              Recent GitHub Contributions & Activity
            </p>
            {totalRepos > 0 && (
              <p className="mt-2 text-center text-xs md:text-md text-slate-500 font-mono">
                Total Public Repositories: {totalRepos}
              </p>
            )}
          </motion.div>
        </div>

        {loading ? (
          <Skeleton />
        ) : events.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-slate-400 py-8 text-center"
          >
            No recent public activity found.
          </motion.p>
        ) : (
          <div className="max-w-3xl mx-auto">
            {/* Timeline Header (Month) */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-4"
            >
              <span className="text-xs font-semibold text-slate-300 shrink-0 uppercase tracking-widest">
                {new Date().toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </motion.div>

            <div className="relative pl-7 sm:pl-8">
              {/* Vertical Line spanning entire activity height */}
              <div className="absolute left-[13px] sm:left-[15px] top-6 bottom-0 w-[2px] bg-white/10" />

              <div className="space-y-12 pt-4 pb-6">
                {/* PUSHES GROUP */}
                {pushes.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="relative"
                  >
                    <div className="absolute -left-[38px] sm:-left-[42px] top-0 w-7 h-7 rounded-full bg-black border-[3px] border-white/20 flex items-center justify-center shrink-0 z-10 text-slate-400 shadow-sm">
                      <GitCommitHorizontal className="w-3.5 h-3.5" />
                    </div>

                    <div className="mb-6">
                      <h4 className="text-[14px] text-white flex items-center justify-between font-semibold sm:font-normal">
                        <span>
                          Created {totalCommits} commits across {allPushes.length} repositor{allPushes.length > 1 ? "ies" : "y"}
                        </span>
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {pushes.map((push, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between text-[13px] gap-2 sm:gap-4 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-center gap-3 truncate max-w-full">
                            <a
                              href={`https://github.com/${push.repo}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-200 hover:text-white hover:underline underline-offset-2 font-semibold flex-shrink-0"
                            >
                              {push.repoShort}
                            </a>
                            <span className="text-slate-500 whitespace-nowrap hidden sm:inline text-xs">
                              {push.commitCount} commits
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
                            <span className="text-slate-500 whitespace-nowrap sm:hidden flex-1 text-xs">
                              {push.commitCount} commits
                            </span>
                            <div className="w-[100px] md:w-[140px] h-[6px] rounded-full bg-white/10 shrink-0 overflow-hidden">
                              <div
                                className="h-full bg-slate-300 rounded-full transition-all duration-1000 ease-out"
                                style={{
                                  width: `${Math.max(8, ((push.commitCount || 1) / maxCommit) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* CREATES GROUP */}
                {creates.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative"
                  >
                    <div className="absolute -left-[38px] sm:-left-[42px] top-0 w-7 h-7 rounded-full bg-black border-[3px] border-white/20 flex items-center justify-center shrink-0 z-10 text-slate-400 shadow-sm">
                      <FolderPlus className="w-3.5 h-3.5" />
                    </div>

                    <div className="mb-6">
                      <h4 className="text-[14px] text-white flex items-center justify-between font-semibold sm:font-normal">
                        <span>
                          Created {creates.length} repositor
                          {creates.length > 1 ? "ies" : "y"}
                        </span>
                      </h4>
                    </div>

                    <div className="space-y-4 border">
                      {creates.map((create, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between text-[13px] gap-2 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <svg
                              className="w-4 h-4 text-slate-500 shrink-0"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                            >
                              <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1h-8a1 1 0 00-1 1v6.708A2.486 2.486 0 014.5 9h8V1.5z"></path>
                            </svg>
                            <a
                              href={`https://github.com/${create.repo}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-200 hover:text-white hover:underline underline-offset-2 font-semibold truncate"
                            >
                              {create.repoShort}
                            </a>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 text-slate-500">
                            {create.language && (
                              <span className="flex items-center gap-2 shrink-0">
                                <div
                                  className="w-2.5 h-2.5 rounded-full"
                                  style={{
                                    backgroundColor:
                                      create.languageColor ?? "#8b949e",
                                  }}
                                />
                                {create.language}
                              </span>
                            )}
                            <span className="text-right tabular-nums whitespace-nowrap text-[12px] sm:text-[13px]">
                              {new Date(create.timestamp).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Explore GitHub Link */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-12 flex justify-center sm:justify-end"
            >
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-slate-400 hover:text-white transition-colors group"
              >
                Explore GitHub
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
