import { Router } from "express";
import { datastore } from "../models/datastore.js";

const router = Router();

// GET /api/users
router.get("/", (req, res) => {
  res.json(datastore.getUsers());
});

// GET /api/users/:username
router.get("/:username", (req, res) => {
  const user = datastore.getUser(req.params.username);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

export default router;
