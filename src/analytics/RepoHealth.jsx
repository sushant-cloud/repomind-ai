import { motion } from "motion/react";
import { ShieldCheck, CircleAlert, FileText, GitCommit, Users, TicketCheck, GitPullRequest, Info } from "lucide-react";

export default function RepoHealth({ score, status, breakdown, repoName }) {
  // Score styling
  const getScoreColors = (val) => {
    if (val >= 85) return { text: "text-emerald-400", border: "border-emerald-500/20", progress: "bg-emerald-500", glow: "shadow-emerald-500/10" };
    if (val >= 70) return { text: "text-amber-400", border: "border-amber-500/20", progress: "bg-amber-500", glow: "shadow-amber-500/10" };
    if (val >= 45) return { text: "text-orange-400", border: "border-orange-500/20", progress: "bg-orange-500", glow: "shadow-orange-500/10" };
    return { text: "text-rose-400", border: "border-rose-500/20", progress: "bg-rose-500", glow: "shadow-rose-500/10" };
  };

  const style = getScoreColors(score);

  // SVG Gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div id="repo-health-card" className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 premium-shadow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 font-sans tracking-tight">Repository Health</h2>
          <p className="text-xs text-zinc-400 font-mono">ID: {repoName}</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-zinc-950 text-xs font-medium font-mono border-zinc-800">
          {score >= 70 ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <CircleAlert className="w-3.5 h-3.5 text-rose-400" />
          )}
          <span className={style.text}>{status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* SVG Circular Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Outer background circle */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-zinc-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Active animated progress ring */}
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className={score >= 85 ? "stroke-emerald-500" : score >= 70 ? "stroke-amber-500" : "stroke-rose-500"}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-bold font-mono tracking-tighter ${style.text}`}>{score}</span>
              <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Score</span>
            </div>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="md:col-span-7 space-y-4">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono">Factor Analysis</h3>
          
          {/* README Exists */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> README Documentation
              </span>
              <span className="font-mono text-zinc-400 font-medium">{breakdown.readme}/20</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${(breakdown.readme / 20) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Recent Commits */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <GitCommit className="w-3.5 h-3.5 text-indigo-400" /> Commit Consistency (14d)
              </span>
              <span className="font-mono text-zinc-400 font-medium">{breakdown.commits}/20</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${(breakdown.commits / 20) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Contributors count */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Contributor Diversity
              </span>
              <span className="font-mono text-zinc-400 font-medium">{breakdown.contributors}/20</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${(breakdown.contributors / 20) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Issue Resolution */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <TicketCheck className="w-3.5 h-3.5 text-indigo-400" /> Issue Resolution Ratio
              </span>
              <span className="font-mono text-zinc-400 font-medium">{breakdown.issues}/20</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${(breakdown.issues / 20) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          {/* Pull Request Activity */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" /> Pull Request Merge Ratio
              </span>
              <span className="font-mono text-zinc-400 font-medium">{breakdown.pullRequests}/20</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${(breakdown.pullRequests / 20) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Advisory Insight */}
      <div className="mt-6 flex items-start gap-3 bg-zinc-950/60 border border-zinc-850 p-3 rounded-lg">
        <Info className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
          {score >= 85
            ? "Your repository has excellent vital systems. Consistently rich documentation paired with active merges keeps code quality high."
            : score >= 70
            ? "Good status. Think about solving lingering issues or adding a dedicated README documentation structure to boost your rating scores."
            : "Requires remediation. Boost documentation quality, resolve standing tickets, and promote frequent code integration commits to secure quality standards."}
        </p>
      </div>
    </div>
  );
}
