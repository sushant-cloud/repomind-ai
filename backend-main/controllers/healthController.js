import { datastore } from "../models/datastore.js";

/**
 * Calculates a premium, highly realistic repository health score from 0 to 100
 * based on concrete software engineering metrics extracted from our datastore.
 * 
 * Logic Weightings:
 * - Commit Activity Status (30% weight) - Counts commits in last 14 days
 * - Resolving issues efficiency (25% weight) - Ratio of closed issues vs total
 * - Code review processes integration (20% weight) - Ratio of merged quality PRs
 * - Work ticket burden overload (15% weight) - Deducts points for high backlog priority
 * - Quality standards documentation (10% weight) - Checks for non-empty README content
 */
export const getRepositoryHealth = async (req, res) => {
  try {
    const { repoId } = req.params;
    const repo = datastore.getRepository(repoId);

    if (!repo) {
      res.status(404).json({ error: "Repository workspace not found" });
      return;
    }

    const report = {
      score: 100, // starting state
      factors: {
        activity: { score: 0, text: "No recent commit activity" },
        issues: { score: 0, text: "No issue tracking active" },
        prs: { score: 0, text: "No integration pulls" },
        backlog: { score: 0, text: "No backlog burden detected" },
        documentation: { score: 0, text: "Missing code standards" },
      },
    };

    const now = new Date();

    // 1. Commit Activity (30 Points Max)
    const commitsCount = repo.commits?.length || 0;
    if (commitsCount > 0) {
      const recentCommits = repo.commits.filter(c => {
        const cDate = new Date(c.timestamp);
        const diffMs = Math.abs(now.getTime() - cDate.getTime());
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return diffDays <= 14; // within 2 weeks
      }).length;

      if (recentCommits >= 5) {
        report.factors.activity = { score: 30, text: "Highly active: Excellent multi-commit cadence in last 14d." };
      } else if (recentCommits > 0) {
        report.factors.activity = { score: 20, text: "Moderately active: Steady steady-state pipeline commits." };
      } else {
        report.factors.activity = { score: 5, text: "Inactive: Stale development branch with no 14d inputs." };
      }
    } else {
      report.factors.activity = { score: 0, text: "Critical: Bare branch, zero commit references recorded." };
    }

    // 2. Issue Resolution Ratio (25 Points Max)
    const totalIssues = repo.issues?.length || 0;
    if (totalIssues > 0) {
      const closedCount = repo.issues.filter(i => i.status === "closed").length;
      const ratio = closedCount / totalIssues;

      if (ratio >= 0.7) {
        report.factors.issues = { score: 25, text: `Exceptional resolution: ${closedCount}/${totalIssues} tickets processed.` };
      } else if (ratio >= 0.3) {
        report.factors.issues = { score: 15, text: `Active resolution state: ${closedCount}/${totalIssues} tickets closed.` };
      } else {
        report.factors.issues = { score: 5, text: `Struggling resolution: high unresolved backlog volumes.` };
      }
    } else {
      report.factors.issues = { score: 25, text: "Stable tracking: No outstanding bugs or defect backlogs reported." };
    }

    // 3. PR Integration Cadence (20 Points Max)
    const totalPRs = repo.pullRequests?.length || 0;
    if (totalPRs > 0) {
      const mergedPRs = repo.pullRequests.filter(p => p.status === "merged").length;
      const ratio = mergedPRs / totalPRs;

      if (ratio >= 0.6) {
        report.factors.prs = { score: 20, text: "Robust integration: healthy code review & merge practices." };
      } else if (ratio > 0) {
        report.factors.prs = { score: 12, text: "Slow gates: Multiple open, unmerged draft branches." };
      } else {
        report.factors.prs = { score: 4, text: "Congested: Draft branches sitting without formal merges." };
      }
    } else {
      report.factors.prs = { score: 10, text: "No feature branching: directly committing to master branch." };
    }

    // 4. Backlog Burden Deductions (15 Points Max)
    const openHighPriority = repo.issues?.filter(i => i.status === "open" && i.priority === "high").length || 0;
    if (openHighPriority > 2) {
      report.factors.backlog = { score: 5, text: `High alert burden: ${openHighPriority} unresolved high priority tickets.` };
    } else if (openHighPriority > 0) {
      report.factors.backlog = { score: 10, text: "Moderate burden: few critical issues outstanding." };
    } else {
      report.factors.backlog = { score: 15, text: "Clean operations: Zero critical blocker backlogs." };
    }

    // 5. Documentation Standards (10 Points Max)
    const hasReadme = !!(repo.readme && repo.readme.trim().length > 20);
    if (hasReadme) {
      report.factors.documentation = { score: 10, text: "Informed framework: Standard descriptive repository README active." };
    } else {
      report.factors.documentation = { score: 0, text: "Undocumented code: Missing core project README file." };
    }

    // Accumulate total score
    const finalScore =
      report.factors.activity.score +
      report.factors.issues.score +
      report.factors.prs.score +
      report.factors.backlog.score +
      report.factors.documentation.score;

    report.score = Math.min(100, Math.max(0, finalScore));

    res.json({
      repoId: repo.id,
      repoName: repo.name,
      ...report
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to solve health metrics report" });
  }
};
