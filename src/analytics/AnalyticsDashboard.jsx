import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from "recharts";
import { GitCommit, AlertTriangle, GitPullRequest, Code, Laptop } from "lucide-react";
import MetricTrend from "./MetricTrend";

export default function AnalyticsDashboard({ data }) {
  const { metrics, commitTrends, issueStats, prStats, language } = data;

  // Colors mapping
  const COLORS = {
    cyan: "#6366f1",
    indigo: "#6366f1",
    emerald: "#10b981",
    amber: "#f59e0b",
    rose: "#f43f5e",
    zinc: "#cbd5e1"
  };

  const issuePriorityData = [
    { name: "High", count: issueStats.priority.high, fill: COLORS.rose },
    { name: "Medium", count: issueStats.priority.medium, fill: COLORS.amber },
    { name: "Low", count: issueStats.priority.low, fill: COLORS.cyan },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row Grid */}
      <div id="analytics-dashboard-metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Weekly Commits */}
        <MetricTrend
          metricId="weekly-commits"
          title="Weekly Activity"
          icon={GitCommit}
          displayValue={metrics.commitsThisWeek}
          baseValue={metrics.commitsThisWeek}
          subtext="Commits past 7 days"
          trendType="volatile"
          themeColor="#6366f1"
        />

        {/* Monthly Speed */}
        <MetricTrend
          metricId="monthly-speed"
          title="Monthly Speed"
          icon={Laptop}
          displayValue={metrics.commitsThisMonth}
          baseValue={metrics.commitsThisMonth}
          subtext="Commits this month"
          trendType="up"
          themeColor="#6366f1"
        />

        {/* PR Metrics */}
        <MetricTrend
          metricId="active-prs"
          title="Active Pulls"
          icon={GitPullRequest}
          displayValue={`${metrics.openPRs} / ${metrics.totalPRs}`}
          baseValue={metrics.openPRs}
          subtext={`${metrics.mergedPRs} merged in history`}
          trendType="stable"
          themeColor="#6366f1"
        />

        {/* Standing Tickets */}
        <MetricTrend
          metricId="open-tickets"
          title="Open Tickets"
          icon={AlertTriangle}
          displayValue={`${metrics.openIssues} / ${metrics.totalIssues}`}
          baseValue={metrics.openIssues}
          subtext={`${metrics.closedIssues} issues closed`}
          trendType="down"
          themeColor="#f59e0b"
          reverseTrendSentiment={true} // Lower ticket counts indicate positive progress
        />
      </div>

      {/* Advanced Charting System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Commit Trends Line/Area */}
        <div className="lg:col-span-8 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 font-sans tracking-tight">Ecosystem Code Activity</h3>
              <p className="text-xs text-zinc-400 font-mono">Trace volume additions (green) vs deletions (red)</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-500"></span> Additions</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-rose-500"></span> Deletions</span>
            </div>
          </div>

          <div className="h-68">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={commitTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorDel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.rose} stopOpacity={0.15}/>
                    <stop offset="95%" stopColor={COLORS.rose} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.4} />
                <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                  labelStyle={{ color: "#e4e4e7", fontFamily: "monospace", fontSize: "12px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="additions" stroke={COLORS.emerald} strokeWidth={1.5} fillOpacity={1} fill="url(#colorAdd)" />
                <Area type="monotone" dataKey="deletions" stroke={COLORS.rose} strokeWidth={1.5} fillOpacity={1} fill="url(#colorDel)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority and Stack Distributions */}
        <div className="lg:col-span-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 font-sans tracking-tight">Standing Issue Priority</h3>
            <p className="text-xs text-zinc-400 font-mono mb-4">Breakdown of pending ticket severity levels</p>
            
            <div className="h-36">
              {repoHasActiveIssues(issuePriorityData) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={issuePriorityData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} opacity={0.4} />
                    <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      cursor={{ fill: '#27272a', opacity: 0.2 }}
                      contentStyle={{ backgroundColor: "#18181b", borderColor: "#27272a", borderRadius: "8px" }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {issuePriorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center border border-dashed border-zinc-800 rounded-lg text-zinc-500 font-mono text-xs">
                  0 pending tickets discovered!
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">Primary Ecosystem</div>
                <div className="text-sm font-bold text-zinc-200 mt-0.5">{language.name}</div>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-950/40 border border-indigo-900/45 text-[10px] font-mono text-indigo-400 font-medium">
                <Code className="w-3 h-3" /> Base Codebase
              </div>
            </div>
            <div className="w-full bg-zinc-950 h-2 mt-2.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-full"></div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

function repoHasActiveIssues(items) {
  return items.some(item => item.count > 0);
}
