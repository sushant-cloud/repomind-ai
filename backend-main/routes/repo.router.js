import { Router } from "express";
import { datastore } from "../models/datastore.js";

const router = Router();

// GET /api/repos
router.get("/", (req, res) => {
  res.json(datastore.getRepositories());
});

// GET /api/repos/:id
router.get("/:id", (req, res) => {
  const repo = datastore.getRepository(req.params.id);
  if (!repo) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }
  res.json(repo);
});

// POST /api/repos/:id/commit
router.post("/:id/commit", (req, res) => {
  const { author, message, filesChanged, insertions, deletions } = req.body;
  const newCommit = datastore.addCommit(req.params.id, {
    author: author || "bhargav",
    authorEmail: `${author || "bhargav"}@repomind.ai`,
    message: message || "feat: operational revisions",
    filesChanged: filesChanged || ["src/index.js"],
    insertions: insertions || 12,
    deletions: deletions || 2,
  });

  if (!newCommit) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }
  res.json({ success: true, commit: newCommit });
});

// POST /api/repos/:id/issue
router.post("/:id/issue", (req, res) => {
  const { title, assignee, priority } = req.body;
  const newIssue = datastore.addIssue(
    req.params.id,
    title || "Issue discovered",
    assignee || "sophie_q",
    priority || "medium"
  );

  if (!newIssue) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }
  res.json({ success: true, issue: newIssue });
});

// POST /api/repos/:id/issues/:issueId/close
router.post("/:id/issues/:issueId/close", (req, res) => {
  const { resolver } = req.body;
  const closedIssue = datastore.closeIssue(req.params.id, req.params.issueId, resolver || "bhargav");
  if (!closedIssue) {
    res.status(404).json({ error: "Issue or repository not found" });
    return;
  }
  res.json({ success: true, issue: closedIssue });
});

// POST /api/repos/:id/pr
router.post("/:id/pr", (req, res) => {
  const { title, author } = req.body;
  const newPR = datastore.addPullRequest(req.params.id, title || "feat: propose code draft", author || "bhargav");
  if (!newPR) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }
  res.json({ success: true, pullRequest: newPR });
});

// POST /api/repos/:id/pr/:prId/merge
router.post("/:id/pr/:prId/merge", (req, res) => {
  const { merger } = req.body;
  const mergedPR = datastore.mergePullRequest(req.params.id, req.params.prId, merger || "bhargav");
  if (!mergedPR) {
    res.status(404).json({ error: "Pull request or repository not found" });
    return;
  }
  res.json({ success: true, pullRequest: mergedPR });
});

// POST /api/repos/:id/chat-message-fallback
router.post("/:id/chat-message-fallback", (req, res) => {
  const { username, content } = req.body;
  const newMessage = datastore.addMessage(req.params.id, username, content);
  if (!newMessage) {
    res.status(404).json({ error: "Failed to create message" });
    return;
  }
  res.json({ success: true, message: newMessage });
});

export default router;
