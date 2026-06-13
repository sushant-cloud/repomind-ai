import { awardMedalColor, developerLevelBadgeStyle } from "./helperBadge";
import { Trophy, Award, GitCommit, TicketCheck, GitPullRequest, Flame } from "lucide-react";
import { motion } from "motion/react";

export default function Leaderboard({ leaderboard }) {
  // Extract top 3 for podium visualization
  const podiumUsers = leaderboard.slice(0, 3);
  const tableUsers = leaderboard.slice(3);

  return (
    <div className="space-y-8">
      {/* Formula description header */}
      <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex gap-3">
          <Trophy className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 font-sans tracking-tight">Contributor Activity Index</h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-xl font-sans mt-0.5">
              Identities are prioritized dynamically relative to contributions on code. Promote pull requests, close tickets, and commit frequently.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-805 text-[11px] font-mono font-medium text-zinc-350 self-start md:self-auto">
          Formula: Commits + Closed Issues + Merged PRs
        </div>
      </div>

      {/* Podium segment */}
      {podiumUsers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {podiumUsers.map((user) => {
            const medal = awardMedalColor(user.rank);
            const badge = developerLevelBadgeStyle(user.DeveloperLevel);

            return (
              <motion.div
                key={user.username}
                whileHover={{ y: -3 }}
                className={`relative bg-zinc-900 border rounded-2xl p-6 flex flex-col items-center justify-center text-center overflow-hidden ${
                  user.rank === 1 ? "border-indigo-500/30" : "border-zinc-800"
                }`}
              >

                {/* Score medal indicator */}
                <div className={`absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border bg-zinc-950 font-mono text-xs font-bold ${medal.text} ${medal.bg} ${medal.border}`}>
                  {user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : "🥉"}
                </div>

                <div className="relative">
                  <img src={user.avatar} className="w-16 h-16 rounded-full border border-zinc-700 object-cover" alt={user.name} />
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-zinc-950 text-[10px] font-mono text-zinc-400 font-bold border border-zinc-800">
                    #{user.rank}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-zinc-100 mt-3 font-sans tracking-tight">{user.name}</h4>
                <p className="text-[10px] text-zinc-400 font-mono font-medium">{user.role}</p>

                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-medium font-mono border ${badge}`}>
                    {user.DeveloperLevel}
                  </span>
                </div>

                {/* Performance stats row */}
                <div className="grid grid-cols-3 gap-4 w-full border-t border-zinc-800/80 mt-4 pt-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-500 font-mono">
                      <GitCommit className="w-3 h-3 text-indigo-400" /> Commits
                    </div>
                    <div className="text-xs font-bold text-zinc-300 font-mono mt-0.5">{user.commitsCount}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-500 font-mono">
                      <TicketCheck className="w-3 h-3 text-indigo-400" /> Closed
                    </div>
                    <div className="text-xs font-bold text-zinc-300 font-mono mt-0.5">{user.issuesClosedCount}</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-500 font-mono">
                      <GitPullRequest className="w-3 h-3 text-indigo-400" /> Merges
                    </div>
                    <div className="text-xs font-bold text-zinc-300 font-mono mt-0.5">{user.prsMergedCount}</div>
                  </div>
                </div>

                {/* Unified Ranking score */}
                <div className="mt-4 w-full bg-zinc-950/70 border border-zinc-850 rounded-xl px-4 py-2 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono font-bold">Score</span>
                  <span className="text-sm font-bold font-mono text-indigo-400">{user.totalScore}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Remaining entries table list */}
      {tableUsers.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-850 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono">Team Ranking Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/40 text-[10px] font-mono tracking-wider text-zinc-500 uppercase">
                  <th className="py-3 px-5 text-center">Rank</th>
                  <th className="py-3 px-5">Developer</th>
                  <th className="py-3 px-5 text-center">Platform Level</th>
                  <th className="py-3 px-5 text-center">Commits</th>
                  <th className="py-3 px-5 text-center">Issues Resolved</th>
                  <th className="py-3 px-5 text-center">PRs Merged</th>
                  <th className="py-3 px-5 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-85">
                {tableUsers.map((user) => {
                  const badge = developerLevelBadgeStyle(user.DeveloperLevel);
                  return (
                    <tr key={user.username} className="hover:bg-zinc-850/20 transition-colors text-xs text-zinc-300">
                      <td className="py-4 px-5 text-center font-mono font-bold text-zinc-500">#{user.rank}</td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} className="w-8 h-8 rounded-full border border-zinc-700 object-cover" alt={user.name} />
                          <div>
                            <div className="font-bold text-zinc-200">{user.name}</div>
                            <div className="text-[10px] text-zinc-405 font-mono">{user.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-sans font-medium border ${badge}`}>
                          {user.DeveloperLevel}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-center font-mono text-zinc-400">{user.commitsCount}</td>
                      <td className="py-4 px-5 text-center font-mono text-zinc-400">{user.issuesClosedCount}</td>
                      <td className="py-4 px-5 text-center font-mono text-zinc-400">{user.prsMergedCount}</td>
                      <td className="py-4 px-5 text-right font-mono font-bold text-indigo-400 pr-5">{user.totalScore}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
