import fs from "fs";
import path from "path";

const DATA_FILE_PATH = path.join(process.cwd(), "repomind-datastore.json");

// Initial seed data
const SEED_USERS = [
  {
    id: "u1",
    username: "bhargav",
    name: "Bhargav Badhe",
    email: "bhargavrambadhe2326@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    role: "Founder & Product Architect",
    xp: 2450,
  },
  {
    id: "u2",
    username: "alex_dev",
    name: "Alex Rivera",
    email: "alex@repomind.ai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    role: "Senior AI Engineer",
    xp: 1850,
  },
  {
    id: "u3",
    username: "sophie_q",
    name: "Sophie Chen",
    email: "sophie@repomind.ai",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    role: "Frontend Wizard",
    xp: 1620,
  },
  {
    id: "u4",
    username: "marcus_ops",
    name: "Marcus Vance",
    email: "marcus@repomind.ai",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    role: "DevOps Lead",
    xp: 1210,
  }
];

const SEED_REPOSITORIES = [
  {
    id: "repo-react-core",
    name: "react-core-dashboard",
    description: "RepoMind primary dashboard and visual analytics workspace with modern React 19.",
    readme: "# React Core Dashboard\n\nA beautiful dashboard for checking analytics systems, leaderboard charts, and other premium features.\n\n## Quick Start\n```bash\nnpm install\nnpm run dev\n```",
    ownerString: "bhargav",
    language: "TypeScript",
    createdAt: new Date("2026-05-01T10:00:00Z").toISOString(),
    commits: [
      {
        id: "c1",
        hash: "e5a32b1",
        message: "feat: add analytics dashboard implementation",
        author: "bhargav",
        authorEmail: "bhargavrambadhe2326@gmail.com",
        filesChanged: ["src/analytics/AnalyticsDashboard.tsx", "package.json"],
        insertions: 420,
        deletions: 15,
        timestamp: new Date("2026-06-11T04:20:00Z").toISOString(),
      },
      {
        id: "c2",
        hash: "7fd12c9",
        message: "fix: resolve authentication security issue",
        author: "alex_dev",
        authorEmail: "alex@repomind.ai",
        filesChanged: ["backend-main/middleware/authMiddleware.ts"],
        insertions: 12,
        deletions: 2,
        timestamp: new Date("2026-06-10T15:30:00Z").toISOString(),
      },
      {
        id: "c3",
        hash: "b02d61a",
        message: "refactor: optimize repository health score service pipeline",
        author: "sophie_q",
        authorEmail: "sophie@repomind.ai",
        filesChanged: ["backend-main/controllers/healthController.ts"],
        insertions: 54,
        deletions: 21,
        timestamp: new Date("2026-06-09T09:15:00Z").toISOString(),
      },
      {
        id: "c4",
        hash: "ff8312e",
        message: "docs: update README with installation instructions",
        author: "marcus_ops",
        authorEmail: "marcus@repomind.ai",
        filesChanged: ["README.md"],
        insertions: 25,
        deletions: 0,
        timestamp: new Date("2026-06-08T18:40:00Z").toISOString(),
      },
      {
        id: "c5",
        hash: "aa2991b",
        message: "feat: establish TeamChat component with websockets",
        author: "bhargav",
        authorEmail: "bhargavrambadhe2326@gmail.com",
        filesChanged: ["src/chat/TeamChat.tsx"],
        insertions: 198,
        deletions: 4,
        timestamp: new Date("2026-06-07T11:10:00Z").toISOString(),
      }
    ],
    issues: [
      {
        id: "i1",
        title: "Database connection pools leak in production",
        status: "closed",
        priority: "high",
        assignee: "marcus_ops",
        createdAt: new Date("2026-06-01T08:00:00Z").toISOString(),
        closedAt: new Date("2026-06-03T14:30:00Z").toISOString(),
      },
      {
        id: "i2",
        title: "HMR socket fails under custom proxy headers",
        status: "open",
        priority: "medium",
        assignee: "sophie_q",
        createdAt: new Date("2026-06-05T12:00:00Z").toISOString(),
      },
      {
        id: "i3",
        title: "Integrate model caching for AI Commit Generator",
        status: "closed",
        priority: "low",
        assignee: "alex_dev",
        createdAt: new Date("2026-06-08T10:00:00Z").toISOString(),
        closedAt: new Date("2026-06-09T17:15:00Z").toISOString(),
      },
      {
        id: "i4",
        title: "Add dark mode aesthetic switches to repository listing screen",
        status: "open",
        priority: "low",
        assignee: "sophie_q",
        createdAt: new Date("2026-06-10T14:00:00Z").toISOString(),
      }
    ],
    pullRequests: [
      {
        id: "pr1",
        title: "Feature/analytics engine integrated with recharts",
        status: "merged",
        author: "bhargav",
        createdAt: new Date("2026-06-04T09:00:00Z").toISOString(),
        mergedAt: new Date("2026-06-06T11:00:00Z").toISOString(),
      },
      {
        id: "pr2",
        title: "Fix/auth tokens secure cookie flags set",
        status: "merged",
        author: "alex_dev",
        createdAt: new Date("2026-06-09T14:00:00Z").toISOString(),
        mergedAt: new Date("2026-06-10T16:00:00Z").toISOString(),
      },
      {
        id: "pr3",
        title: "Draft/AI Review Assistant prompts optimized",
        status: "open",
        author: "alex_dev",
        createdAt: new Date("2026-06-10T18:00:05Z").toISOString(),
      }
    ],
    contributors: ["bhargav", "alex_dev", "sophie_q", "marcus_ops"],
  },
  {
    id: "repo-ai-engine",
    name: "repo-mind-ai-engine",
    description: "Core AI integration framework wrapping Google GenAI SDK interface models.",
    readme: "# RepoMind AI Engine\n\nTranslating commit diff files with high-quality Gemini 3.5 instructions.",
    ownerString: "alex_dev",
    language: "TypeScript",
    createdAt: new Date("2026-05-15T09:00:00Z").toISOString(),
    commits: [
      {
        id: "c6",
        hash: "3c912bb",
        message: "feat: initialize gemini client integrations",
        author: "alex_dev",
        authorEmail: "alex@repomind.ai",
        filesChanged: ["backend-main/ai/commitGenerator.ts"],
        insertions: 110,
        deletions: 0,
        timestamp: new Date("2026-06-11T01:10:00Z").toISOString(),
      },
      {
        id: "c7",
        hash: "da983bc",
        message: "docs: update API descriptions and keys guideline",
        author: "bhargav",
        authorEmail: "bhargavrambadhe2326@gmail.com",
        filesChanged: ["README.md", "docs/APIs.md"],
        insertions: 48,
        deletions: 2,
        timestamp: new Date("2026-06-10T22:30:00Z").toISOString(),
      }
    ],
    issues: [
      {
        id: "i5",
        title: "Exceeded quota limits with massive diff sequences",
        status: "open",
        priority: "high",
        assignee: "alex_dev",
        createdAt: new Date("2026-06-09T11:00:00Z").toISOString(),
      }
    ],
    pullRequests: [
      {
        id: "pr4",
        title: "Feature/fine-tuned repository parameters for Gemini-3.5-flash",
        status: "open",
        author: "alex_dev",
        createdAt: new Date("2026-06-10T10:00:00Z").toISOString(),
      }
    ],
    contributors: ["alex_dev", "bhargav"],
  },
  {
    id: "repo-legacy-system",
    name: "legacy-monolith-java",
    description: "Old codebase needing serious rehabilitation. No recent activity and multiple active tickets.",
    readme: "", // Empty to demonstrate 0 points for missing README
    ownerString: "marcus_ops",
    language: "Java",
    createdAt: new Date("2024-01-10T08:00:00Z").toISOString(),
    commits: [
      {
        id: "c8",
        hash: "9aa8813",
        message: "maintenance: last update before freeze",
        author: "marcus_ops",
        authorEmail: "marcus@repomind.ai",
        filesChanged: ["pom.xml"],
        insertions: 1,
        deletions: 1,
        timestamp: new Date("2026-04-01T08:00:00Z").toISOString(), // Over 2 months ago (No recent commits)
      }
    ],
    issues: [
      {
        id: "i6",
        title: "Memory leak on heavy XML parsing procedures",
        status: "open",
        priority: "high",
        assignee: "marcus_ops",
        createdAt: new Date("2026-05-01T09:00:00Z").toISOString(), // Open for a long time
      },
      {
        id: "i7",
        title: "Deprecate spring boot security v1 handlers",
        status: "open",
        priority: "medium",
        assignee: "marcus_ops",
        createdAt: new Date("2026-05-15T10:00:00Z").toISOString(),
      }
    ],
    pullRequests: [], // 0 PR activity
    contributors: ["marcus_ops"], // 1 Contributor
  }
];

const SEED_MESSAGES = [
  {
    id: "m1",
    repoId: "repo-react-core",
    username: "bhargav",
    name: "Bhargav Badhe",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    content: "Hey team! I just merged the new dashboard analytics endpoints. Everything is running fully local with extreme speed.",
    timestamp: new Date("2026-06-11T05:00:00Z").toISOString(),
  },
  {
    id: "m2",
    repoId: "repo-react-core",
    username: "alex_dev",
    name: "Alex Rivera",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    content: "That's awesome Bhargav! Checked the health score trends dashboard, it gives super deep insights. I will plug in the AI Commit Generator now.",
    timestamp: new Date("2026-06-11T05:15:00Z").toISOString(),
  },
  {
    id: "m3",
    repoId: "repo-react-core",
    username: "sophie_q",
    name: "Sophie Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    content: "Design team loves the Linear/Vercel visual mood! The negative spacing and micro-animations are super satisfying.",
    timestamp: new Date("2026-06-11T05:20:00Z").toISOString(),
  }
];

const SEED_NOTIFICATIONS = [
  {
    id: "n1",
    repoId: "repo-react-core",
    title: "New Commit",
    text: "bhargav pushed e5a32b1 'feat: add analytics dashboard implementation'",
    type: "pr",
    isRead: false,
    timestamp: new Date("2026-06-11T04:20:00Z").toISOString(),
  },
  {
    id: "n2",
    repoId: "repo-react-core",
    title: "Issue Closed",
    text: "alex_dev resolved 'Integrate model caching for AI Commit Generator'",
    type: "issue",
    isRead: true,
    timestamp: new Date("2026-06-09T17:15:00Z").toISOString(),
  },
  {
    id: "n3",
    repoId: "repo-react-core",
    title: "Pull Request Opened",
    text: "alex_dev opened draft PR #3: AI Review Assistant",
    type: "pr",
    isRead: false,
    timestamp: new Date("2026-06-10T18:00:00Z").toISOString(),
  }
];

class Datastore {
  constructor() {
    this.data = {
      users: [],
      repositories: [],
      messages: [],
      notifications: [],
    };
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const raw = fs.readFileSync(DATA_FILE_PATH, "utf-8");
        this.data = JSON.parse(raw);
        console.log("Datastore loaded successfully with", this.data.repositories.length, "repositories.");
      } else {
        this.data = {
          users: SEED_USERS,
          repositories: SEED_REPOSITORIES,
          messages: SEED_MESSAGES,
          notifications: SEED_NOTIFICATIONS,
        };
        this.save();
        console.log("Datastore pre-seeded and saved to disks.");
      }
    } catch (e) {
      console.error("Error loading datastore:", e);
      // Fallback
      this.data = {
        users: SEED_USERS,
        repositories: SEED_REPOSITORIES,
        messages: SEED_MESSAGES,
        notifications: SEED_NOTIFICATIONS,
      };
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error saving datastore:", e);
    }
  }

  // Users Collection
  getUsers() {
    return this.data.users;
  }

  getUser(username) {
    return this.data.users.find(u => u.username === username);
  }

  updateUserXp(username, xpGain) {
    const user = this.getUser(username);
    if (user) {
      user.xp += xpGain;
      this.save();
    }
    return user;
  }

  // Repositories Collection
  getRepositories() {
    return this.data.repositories;
  }

  getRepository(id) {
    return this.data.repositories.find(r => r.id === id);
  }

  addCommit(repoId, commit) {
    const repo = this.getRepository(repoId);
    if (repo) {
      const newCommit = {
        ...commit,
        id: "commit-" + Math.random().toString(36).substring(2, 9),
        hash: "hash" + Math.random().toString(36).substring(2, 9).slice(0, 7),
        timestamp: new Date().toISOString(),
      };
      repo.commits.unshift(newCommit); // newest first
      
      // Award XP to user on commit!
      this.updateUserXp(commit.author, 50);

      // Create a notification
      this.addNotification({
        repoId,
        title: "New Commit Created",
        text: `${commit.author} committed: "${commit.message}"`,
        type: "pr",
      });

      this.save();
      return newCommit;
    }
    return undefined;
  }

  addIssue(repoId, title, assignee, priority) {
    const repo = this.getRepository(repoId);
    if (repo) {
      const newIssue = {
        id: "issue-" + Math.random().toString(36).substring(2, 9),
        title,
        status: "open",
        priority,
        assignee,
        createdAt: new Date().toISOString(),
      };
      repo.issues.unshift(newIssue);

      this.addNotification({
        repoId,
        title: "New Issue Created",
        text: `Issue opened by system and assigned to ${assignee}`,
        type: "issue",
      });

      this.save();
      return newIssue;
    }
    return undefined;
  }

  addPullRequest(repoId, title, author) {
    const repo = this.getRepository(repoId);
    if (repo) {
      const newPR = {
        id: "pr-" + Math.random().toString(36).substring(2, 9),
        title,
        status: "open",
        author,
        createdAt: new Date().toISOString(),
      };
      repo.pullRequests.unshift(newPR);

      this.addNotification({
        repoId,
        title: "New PR Opened",
        text: `${author} opened PR: "${title}"`,
        type: "pr",
      });

      this.save();
      return newPR;
    }
    return undefined;
  }

  closeIssue(repoId, issueId, resolverUsername) {
    const repo = this.getRepository(repoId);
    if (repo) {
      const issue = repo.issues.find(i => i.id === issueId);
      if (issue) {
        issue.status = "closed";
        issue.closedAt = new Date().toISOString();
        this.updateUserXp(resolverUsername, 100);

        this.addNotification({
          repoId,
          title: "Issue Closed",
          text: `${resolverUsername} resolved issue: "${issue.title}"`,
          type: "issue",
        });

        this.save();
        return issue;
      }
    }
    return undefined;
  }

  mergePullRequest(repoId, prId, mergerUsername) {
    const repo = this.getRepository(repoId);
    if (repo) {
      const pr = repo.pullRequests.find(p => p.id === prId);
      if (pr) {
        pr.status = "merged";
        pr.mergedAt = new Date().toISOString();
        this.updateUserXp(mergerUsername, 150);

        this.addNotification({
          repoId,
          title: "PR Merged",
          text: `${mergerUsername} merged pull request: "${pr.title}"`,
          type: "pr",
        });

        this.save();
        return pr;
      }
    }
    return undefined;
  }

  // Messages Collection
  getMessagesByRepo(repoId) {
    return this.data.messages.filter(m => m.repoId === repoId);
  }

  addMessage(repoId, username, content) {
    const user = this.getUser(username);
    if (!user) return undefined;

    const newMessage = {
      id: "msg-" + Math.random().toString(36).substring(2, 9),
      repoId,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      content,
      timestamp: new Date().toISOString(),
    };

    this.data.messages.push(newMessage);
    this.updateUserXp(username, 10); // small engagement reward
    this.save();
    return newMessage;
  }

  // Notifications Collection
  getNotifications() {
    return this.data.notifications;
  }

  addNotification(notification) {
    const newNotif = {
      ...notification,
      id: "notif-" + Math.random().toString(36).substring(2, 9),
      isRead: false,
      timestamp: new Date().toISOString(),
    };
    this.data.notifications.unshift(newNotif);
    
    // limit notifications list to 50 items
    if (this.data.notifications.length > 50) {
      this.data.notifications = this.data.notifications.slice(0, 50);
    }

    this.save();
    return newNotif;
  }

  markNotificationsAsRead() {
    this.data.notifications.forEach(n => n.isRead = true);
    this.save();
  }
}

export const datastore = new Datastore();
