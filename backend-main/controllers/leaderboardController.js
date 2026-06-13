import { datastore } from "../models/datastore.js";

export const getLeaderboard = async (req, res) => {
  try {
    const users = datastore.getUsers();
    
    // Sort developers based on XP score rank
    const leaderboard = users
      .map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        avatar: u.avatar,
        role: u.role,
        xp: u.xp,
      }))
      .sort((a, b) => b.xp - a.xp);

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to lookup leaderboards" });
  }
};
