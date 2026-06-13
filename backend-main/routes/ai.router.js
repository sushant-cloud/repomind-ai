import { Router } from "express";
import { reviewCodeSnippet } from "../ai/codeReview.js";
import { generateCommitMessages } from "../ai/commitGenerator.js";
import { generateReadme } from "../ai/readmeGenerator.js";
import { datastore } from "../models/datastore.js";

const router = Router();

// 1. AI Code Review
router.post("/review", async (req, res) => {
  try {
    const { code, fileName } = req.body;
    if (!code) {
      res.status(400).json({ error: "Missing required parameter 'code'." });
      return;
    }
    const review = await reviewCodeSnippet(code, fileName || "index.js");
    res.json({ review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. AI Commit Suggestion
router.post(["/commit-suggestions", "/commit-generator"], async (req, res) => {
  try {
    const { changedFiles, context, diffSnippet } = req.body;
    if (!changedFiles || !Array.isArray(changedFiles)) {
      res.status(400).json({ error: "Missing or invalid parameter 'changedFiles' (must be array)." });
      return;
    }
    const suggestions = await generateCommitMessages({
      changedFiles,
      context,
      diffSnippet,
    });
    res.json({ suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. AI README Generation
router.post("/readme", async (req, res) => {
  try {
    const { repoId, repoName, description, language } = req.body;
    const finalName = repoName || "My Project";
    
    const readme = await generateReadme(finalName, description || "", language || "JavaScript");
    
    // Auto-update datastore's README if repoId matches!
    if (repoId) {
      const repo = datastore.getRepository(repoId);
      if (repo) {
        repo.readme = readme;
        datastore.save();
      }
    }

    res.json({ readme });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
