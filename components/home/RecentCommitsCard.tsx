"use client";

import { motion } from "framer-motion";
import { CommitInfo, RepoCommitInfo } from "@/lib/github/types";

interface RecentCommitsCardProps {
  commits: CommitInfo[];
  topRepos?: RepoCommitInfo[];
  isLoading?: boolean;
}

function SkeletonRow({ wide = false }: { wide?: boolean }) {
  return (
    <div className="space-y-2 p-3 border border-white/5 rounded-lg">
      <div
        className={`h-4 ${wide ? "w-3/4" : "w-1/2"} bg-white/10 rounded animate-pulse`}
      />
      <div className="flex gap-3">
        <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
        <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function RecentCommitsCard({
  commits,
  topRepos = [],
  isLoading = false,
}: RecentCommitsCardProps) {
  const cardClass =
    "w-full max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl shadow-[0_30px_100px_rgba(0,0,0,0.7)] overflow-hidden p-6";

  if (isLoading) {
    return (
      <div className={cardClass}>
        <div className="space-y-6">
          <div>
            <div className="h-5 w-40 bg-white/10 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <SkeletonRow key={i} wide={i % 2 === 0} />
              ))}
            </div>
          </div>
          <div>
            <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <SkeletonRow key={i} wide={i % 2 !== 0} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      {/* ── Top Repos by Commits ── */}
      {topRepos.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-white">
            Top Repos by Commits
            <span className="ml-2 text-xs font-normal text-slate-500">
              (last ~3 months)
            </span>
          </h3>
          <div className="space-y-2">
            {topRepos.map((repo, index) => (
              <motion.a
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.07 }}
                className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-emerald-500/30 hover:bg-white/5 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-slate-500 w-4 shrink-0">
                    {index + 1}.
                  </span>
                  <span className="font-mono text-sm text-slate-300 group-hover:text-emerald-400 transition-colors truncate">
                    {repo.name.split("/")[1] ?? repo.name}
                  </span>
                  <span className="text-xs text-slate-600 hidden sm:inline truncate">
                    {repo.name.split("/")[0]}/
                  </span>
                </div>
                <span className="ml-3 shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                  {repo.commits} {repo.commits === 1 ? "commit" : "commits"}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent Commits ── */}
      <div>
        <h3 className="text-lg md:text-xl font-semibold mb-4 text-white">
          Recent Commits
        </h3>
        <div className="space-y-2">
          {commits.length === 0 ? (
            <p className="text-slate-400 text-sm">No recent commits found.</p>
          ) : (
            commits.map((commit, index) => (
              <motion.a
                key={commit.sha}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.07 }}
                className="block p-3 rounded-lg border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all duration-200 group"
              >
                <p className="text-white text-sm mb-1.5 group-hover:text-emerald-400 transition-colors truncate">
                  {truncate(commit.message, 72)}
                </p>
                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                  <span className="font-mono">
                    {commit.repo.split("/")[1] ?? commit.repo}
                  </span>
                  <span>·</span>
                  <span>{relativeTime(commit.timestamp)}</span>
                </div>
              </motion.a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max) + "…";
}

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const w = Math.floor(d / 7);
  if (w < 4) return `${w}w ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(d / 365)}y ago`;
}
