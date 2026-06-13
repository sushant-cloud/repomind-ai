import React, { useState, useEffect } from "react";
import { 
  Terminal, ShieldCheck, Trophy, Sparkles, MessageSquare, Bell, 
  GitBranch, Code, AlertTriangle, Play, RefreshCw, Send, GitPullRequest, 
  LayoutDashboard, Laptop, UserCheck, Flame 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Components imports
import RepoHealth from "./analytics/RepoHealth";
import AnalyticsDashboard from "./analytics/AnalyticsDashboard";
import Leaderboard from "./analytics/Leaderboard";
import CommitGenerator from "./ai/CommitGenerator";
import TeamChat from "./chat/TeamChat";
import NotificationPanel from "./notifications/NotificationPanel";

export default function App() {
  const [repos, setRepos] = useState([]);
  const [selectedRepoId, setSelectedRepoId] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  
  // Platform User switches
  const [users, setUsers] = useState([]);
  const [currentUserIdx, setCurrentUserIdx] = useState(0);

  // Dynamic Metrics states
  const [healthData, setHealthData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Controls
  const [repoDetails, setRepoDetails] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock controls triggers
  const [issueTitle, setIssueTitle] = useState("");
  const [issuePriority, setIssuePriority] = useState("medium");
  const [prTitle, setPrTitle] = useState("");

  const activeUser = users[currentUserIdx] || {
    username: "bhargav",
    name: "Bhargav Badhe",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    role: "Founder & Product Architect",
    xp: 2450
  };

  // 1. Initial mounts
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const uRes = await fetch("/api/users");
        const uData = await uRes.json();
        setUsers(uData);

        const rRes = await fetch("/api/repos");
        const rData = await rRes.json();
        setRepos(rData);
        if (rData.length > 0) {
          setSelectedRepoId(rData[0].id);
        }
      } catch (err) {
        console.error("Bootstrapping failed:", err);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  // 2. Refresh target metrics whenever repo shifts or actions occur
  useEffect(() => {
    if (!selectedRepoId) return;

    const pullMetrics = async () => {
      try {
        // Detailed data
        const detRes = await fetch(`/api/repos/${selectedRepoId}`);
        const detData = await detRes.json();
        setRepoDetails(detData);

        // Feature 1: Health Score calculation
        const hRes = await fetch(`/api/analytics/${selectedRepoId}/health`);
        const hData = await hRes.json();
        setHealthData(hData);

        // Feature 2: Advanced advanced analytical dashboards
        const aRes = await fetch(`/api/analytics/${selectedRepoId}`);
        const aData = await aRes.json();
        setAnalyticsData(aData);

        // Feature 3: Contributor leaderboard
        const lRes = await fetch(`/api/leaderboard?repoId=${selectedRepoId}`);
        const lData = await lRes.json();
        setLeaderboardData(lData.leaderboard);

        // Notifications log streams
        const nRes = await fetch("/api/notifications");
        const nData = await nRes.json();
        setNotifications(nData);
      } catch (err) {
        console.error("Failed to load repo statistics:", err);
      }
    };

    pullMetrics();
  }, [selectedRepoId, refreshKey]);

  // Force trigger metrics reload
  const reloadGrid = async () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Switch identity
  const handleUserSwap = () => {
    setCurrentUserIdx((prev) => (prev + 1) % users.length);
  };

  // Commit and write directly to repo
  const handleCommitApplied = async (commitMsg, files) => {
    try {
      const res = await fetch(`/api/repos/${selectedRepoId}/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: activeUser.username,
          message: commitMsg,
          filesChanged: files,
          insertions: Math.floor(Math.random() * 150) + 20,
          deletions: Math.floor(Math.random() * 40) + 2,
        }),
      });
      const data = await res.json();
      if (data.success) {
        reloadGrid();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create mock ticket
  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;

    try {
      const res = await fetch(`/api/repos/${selectedRepoId}/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: issueTitle.trim(),
          assignee: activeUser.username,
          priority: issuePriority,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIssueTitle("");
        reloadGrid();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Close outstanding issue
  const handleResolveIssue = async (issueId) => {
    try {
      const res = await fetch(`/api/repos/${selectedRepoId}/issues/${issueId}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolver: activeUser.username }),
      });
      const data = await res.json();
      if (data.success) {
        reloadGrid();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Raise mock draft PR
  const handleCreatePR = async (e) => {
    e.preventDefault();
    if (!prTitle.trim()) return;

    try {
      const res = await fetch(`/api/repos/${selectedRepoId}/pr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prTitle.trim(),
          author: activeUser.username,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPrTitle("");
        reloadGrid();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Merge PR draft
  const handleMergePR = async (prId) => {
    try {
      const res = await fetch(`/api/repos/${selectedRepoId}/pr/${prId}/merge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ merger: activeUser.username }),
      });
      const data = await res.json();
      if (data.success) {
        reloadGrid();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Mark alerts as read
  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications/read", { method: "POST" });
      reloadGrid();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 space-y-4">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <span className="font-mono text-sm tracking-wider uppercase">Booting RepoMind AI Workspace...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      
      {/* 1. Universal Top Navigation Rail */}
      <header className="border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
            R
          </div>
          <div>
            <div className="font-bold text-zinc-100 font-sans tracking-tight text-sm">RepoMind AI</div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wide">Enterprise Developer Collaboration OS</p>
          </div>
        </div>

        {/* Global actions control */}
        <div className="flex items-center gap-4">
          
          {/* Identity switcher controls */}
          <div className="flex items-center gap-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-1.5 hover:border-zinc-700 transition-all">
            <img src={activeUser.avatar} className="w-6 h-6 rounded-full border border-zinc-700 object-cover" alt="Avatar" />
            <div className="text-left hidden sm:block">
              <div className="text-[10px] font-bold text-zinc-200 leading-tight block">{activeUser.name}</div>
              <p className="text-[8px] text-zinc-500 font-mono">Role: {activeUser.role}</p>
            </div>
            <button 
              onClick={handleUserSwap}
              title="Switch Active Developer Identity"
              className="p-1 rounded bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 text-[10px] text-indigo-400 font-mono select-none"
            >
              <UserCheck className="w-3.5 h-3.5 inline mr-1" /> Swap
            </button>
          </div>

          {/* Quick Refresh metrics button */}
          <button 
            onClick={reloadGrid}
            title="Reload metrics data streams"
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500 hover:text-indigo-400 transition-all shrink-0"
          >
            <RefreshCw className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </header>

      {/* 2. Main Platform Grid */}
      <main className="max-w-[1600px] mx-auto p-4 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Repository selector & interactive actions (Col:3) */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Repos list card container */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest font-mono mb-3">
              Code Repositories
            </h3>
            
            <div className="space-y-2">
              {repos.map((repo) => {
                const isSelected = repo.id === selectedRepoId;
                return (
                  <button
                    key={repo.id}
                    onClick={() => setSelectedRepoId(repo.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-indigo-500/[0.04] border-indigo-500/40 text-zinc-100"
                        : "bg-zinc-950 border-zinc-850 hover:border-zinc-700 hover:bg-zinc-900/60 text-zinc-400"
                     }`}
                  >
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="font-bold text-xs truncate max-w-[80%] font-sans tracking-tight">
                        {repo.name}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-950 text-zinc-400 shrink-0">
                        {repo.language}
                      </span>
                    </div>
                    <p className="text-[10px] leading-relaxed line-clamp-2 text-zinc-400 mb-2">
                       {repo.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code ACTIONS Console */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-5">
            <div>
              <h3 className="text-xs font-semibold text-zinc-100 font-sans tracking-tight mb-1 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Actions Sandbox
              </h3>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-sans mt-0.5">
                Simulate active pull requests and ticket statuses instantly. Updates repository dashboards dynamically.
              </p>
            </div>

            {/* Form 1: Open an Issue */}
            <form onSubmit={handleCreateIssue} className="border-t border-zinc-850 pt-4 space-y-2.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                <span>Raise ticket</span>
                <span className="text-[9px] bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded text-rose-450 font-mono font-medium">TICKET</span>
              </div>
              <input
                type="text"
                placeholder="Issue title (e.g., memory leakage error)"
                value={issueTitle}
                onChange={(e) => setIssueTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
              />
              <div className="flex gap-2">
                <select
                  value={issuePriority}
                  onChange={(e) => setIssuePriority(e.target.value)}
                  className="grow bg-zinc-950 border border-zinc-805 rounded-lg px-2.5 py-1 text-[10px] text-zinc-400 focus:outline-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <button
                  type="submit"
                  className="bg-zinc-800 hover:bg-zinc-7 hover:border-zinc-650 border border-zinc-700 text-zinc-300 font-bold px-3 text-[10px] rounded-lg shrink-0"
                >
                  Post Task
                </button>
              </div>
            </form>

            {/* Form 2: Propose Pull Request */}
            <form onSubmit={handleCreatePR} className="border-t border-zinc-850 pt-4 space-y-2.5">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest flex items-center justify-between">
                <span>Propose draft code</span>
                <span className="text-[9px] bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-400 font-mono font-medium">PULL REQUEST</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PR title (e.g., feat: optimize indexing)"
                  value={prTitle}
                  onChange={(e) => setPrTitle(e.target.value)}
                  className="grow bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-305 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                />
                <button
                  type="submit"
                  className="bg-zinc-800 hover:bg-zinc-7 hover:border-zinc-650 border border-zinc-700 text-zinc-300 font-bold px-3 text-[10px] rounded-lg shrink-0"
                >
                  Open PR
                </button>
              </div>
            </form>

            {/* Active Standing Issue resolutions list */}
            {repoDetails && repoDetails.issues.filter((i) => i.status === "open").length > 0 && (
              <div className="border-t border-zinc-850 pt-4 space-y-2.5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Open Tickets Registry ({repoDetails.issues.filter((i) => i.status === "open").length})
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {repoDetails.issues
                    .filter((i) => i.status === "open")
                    .map((issue) => (
                      <div key={issue.id} className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850 text-[10px]">
                        <span className="truncate max-w-[65%] text-zinc-350">{issue.title}</span>
                        <button
                          onClick={() => handleResolveIssue(issue.id)}
                          className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:text-zinc-100 font-mono text-[9px] transition-colors"
                        >
                          Resolve
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Active outstanding PR mergers list */}
            {repoDetails && repoDetails.pullRequests.filter((p) => p.status === "open").length > 0 && (
              <div className="border-t border-zinc-850 pt-4 space-y-2.5">
                <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                  Open PR Drafts ({repoDetails.pullRequests.filter((p) => p.status === "open").length})
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {repoDetails.pullRequests
                    .filter((p) => p.status === "open")
                    .map((pr) => (
                      <div key={pr.id} className="flex justify-between items-center p-2 rounded bg-zinc-950 border border-zinc-850 text-[10px]">
                        <span className="truncate max-w-[65%] text-zinc-350">{pr.title}</span>
                        <button
                          onClick={() => handleMergePR(pr.id)}
                          className="px-1.5 py-0.5 rounded bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500/20 font-mono text-[9px] transition-colors font-medium"
                        >
                          Merge
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE COLUMN: Core application Workspace tabs (Col:6) */}
        <div className="xl:col-span-6 space-y-6">
          
          {/* Dashboard menu tab selectors */}
          <div className="flex border border-zinc-800 bg-zinc-900 p-1 rounded-xl gap-1">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 grow justify-center py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "analytics"
                  ? "bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Workspace Base
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`flex items-center gap-1.5 grow justify-center py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "leaderboard"
                  ? "bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> Standings
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`flex items-center gap-1.5 grow justify-center py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "ai"
                  ? "bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Commit Generator
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 grow justify-center py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "chat"
                  ? "bg-zinc-800 text-zinc-100 font-semibold border border-zinc-700/60 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Channels Hub
            </button>
          </div>

          {/* Dynamic Tab viewport content renderers with clean entry animations */}
          <div className="min-h-[480px]">
            <AnimatePresence mode="wait">
              {activeTab === "analytics" && analyticsData && healthData && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <RepoHealth 
                    score={healthData.score} 
                    status={healthData.status} 
                    breakdown={healthData.breakdown} 
                    repoName={healthData.repoId}
                  />
                  <AnalyticsDashboard data={analyticsData} />
                </motion.div>
              )}

              {activeTab === "leaderboard" && (
                <motion.div
                  key="leaderboard"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <Leaderboard leaderboard={leaderboardData} />
                </motion.div>
              )}

              {activeTab === "ai" && repoDetails && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <CommitGenerator
                    repoId={selectedRepoId}
                    repoName={repoDetails.name}
                    repoDescription={repoDetails.description}
                    onCommitApplied={handleCommitApplied}
                    currentUsername={activeUser.username}
                  />
                </motion.div>
              )}

              {activeTab === "chat" && repoDetails && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <TeamChat
                    repoId={selectedRepoId}
                    repoName={repoDetails.name}
                    currentUsername={activeUser.username}
                    currentUserProfile={activeUser}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-3 space-y-6">
          <NotificationPanel 
            notifications={notifications} 
            onMarkAllRead={handleMarkAllRead}
            onRefresh={reloadGrid}
          />
        </div>

      </main>

      {/* Footer credits info bar */}
      <footer className="border-t border-zinc-900 bg-zinc-950 mt-12 py-6 text-center text-xs font-mono text-zinc-650 flex flex-col md:flex-row justify-between max-w-[1600px] mx-auto px-6 gap-3">
        <div>RepoMind AI &copy; {new Date().getFullYear()} - Premium Repository Analytics and Workspace Platform. All rights reserved.</div>
        <div className="flex gap-4 items-center justify-center">
          <span>SYSTEM ENVIRONMENT: <span className="text-indigo-400">Enterprise Cloud Run Active</span></span>
        </div>
      </footer>
    </div>
  );
}
