import { datastore } from "../models/datastore.js";

export const getRepositoryAnalytics = async (req, res) => {
  try {
    const { repoId } = req.params;
    const repo = datastore.getRepository(repoId);

    if (!repo) {
      res.status(404).json({ error: "Repository not found" });
      return;
    }

    // 1. Commits trend (last 7 days)
    const commitTrends = [];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    }).reverse();

    last7Days.forEach(dateStr => {
      const commitsOnDay = repo.commits.filter(c => c.timestamp.startsWith(dateStr));
      const additions = commitsOnDay.reduce((acc, c) => acc + c.insertions, 0);
      const deletions = commitsOnDay.reduce((acc, c) => acc + c.deletions, 0);
      
      const parts = dateStr.split("-");
      const shortDate = `${parts[1]}/${parts[2]}`; // MM/DD
      
      commitTrends.push({
        date: shortDate,
        count: commitsOnDay.length,
        additions,
        deletions,
      });
    });

    // 2. Commits by week and month estimates for comparison
    const now = new Date();
    const commitsThisWeek = repo.commits.filter(c => {
      const cDate = new Date(c.timestamp);
      const diffTime = Math.abs(now.getTime() - cDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;

    const commitsThisMonth = repo.commits.filter(c => {
      const cDate = new Date(c.timestamp);
      return cDate.getMonth() === now.getMonth() && cDate.getFullYear() === now.getFullYear();
    }).length;

    // 3. Issue Statistics
    const totalIssues = repo.issues.length;
    const openIssues = repo.issues.filter(i => i.status === "open").length;
    const closedIssues = repo.issues.filter(i => i.status === "closed").length;
    
    const issuePriorityBreakdown = {
      high: repo.issues.filter(i => i.priority === "high").length,
      medium: repo.issues.filter(i => i.priority === "medium").length,
      low: repo.issues.filter(i => i.priority === "low").length,
    };

    // 4. PR Statistics
    const totalPRs = repo.pullRequests.length;
    const openPRs = repo.pullRequests.filter(p => p.status === "open").length;
    const mergedPRs = repo.pullRequests.filter(p => p.status === "merged").length;
    const closedPRs = repo.pullRequests.filter(p => p.status === "closed").length;

    // 5. Contributors aggregate stats
    const contributorStats = {};
    
    // Seed contributors
    repo.contributors.forEach(username => {
      contributorStats[username] = { commits: 0, additions: 0, deletions: 0 };
    });

    // Accumulate
    repo.commits.forEach(c => {
      if (!contributorStats[c.author]) {
        contributorStats[c.author] = { commits: 0, additions: 0, deletions: 0 };
      }
      contributorStats[c.author].commits += 1;
      contributorStats[c.author].additions += c.insertions;
      contributorStats[c.author].deletions += c.deletions;
    });

    const topContributors = Object.entries(contributorStats).map(([username, stats]) => {
      const u = datastore.getUser(username);
      return {
        username,
        name: u ? u.name : username,
        avatar: u ? u.avatar : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
        role: u ? u.role : "Contributor",
        ...stats
      };
    }).sort((a, b) => b.commits - a.commits);

    // 6. Language Distribution
    const languageStats = {
      name: repo.language,
      value: 100
    };

    res.json({
      repoId: repo.id,
      repoName: repo.name,
      metrics: {
        commitsThisWeek,
        commitsThisMonth,
        totalCommits: repo.commits.length,
        totalIssues,
        openIssues,
        closedIssues,
        totalPRs,
        openPRs,
        mergedPRs,
      },
      commitTrends,
      issueStats: {
        open: openIssues,
        closed: closedIssues,
        priority: issuePriorityBreakdown,
      },
      prStats: {
        open: openPRs,
        merged: mergedPRs,
        closed: closedPRs,
      },
      topContributors,
      language: languageStats
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to compile repository analytics" });
  }
};
