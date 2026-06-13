import { datastore } from "../models/datastore.js";

export const getHistoryByRepo = async (req, res) => {
  try {
    const { repoId } = req.params;
    const history = datastore.getMessagesByRepo(repoId);
    res.json({ repoId, history });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve history" });
  }
};

export const postFallbackMessage = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { username, content } = req.body;
    const newMessage = datastore.addMessage(repoId, username, content);
    if (!newMessage) {
      res.status(404).json({ error: "Context or user identity not recognized" });
      return;
    }
    res.json({ success: true, message: newMessage });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to save message" });
  }
};
