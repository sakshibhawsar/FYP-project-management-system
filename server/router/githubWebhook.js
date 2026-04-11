import express from "express";
import { Project } from "../models/project.js";
import { Notification } from "../models/notification.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    const repoUrl = payload.repository?.html_url;
    const commits = payload.commits || [];

    if (!repoUrl) return res.sendStatus(400);

    // project find
    const project = await Project.findOne({ githubRepo: repoUrl });

    if (!project) return res.sendStatus(404);

    const latestCommit = commits[0];

    const message = latestCommit?.message || "New commit";
    const author = latestCommit?.author?.name || "Someone";

    await Notification.create({
      type: "github",
      message: `${author} pushed: "${message}"`,
      project: project._id,
    });

    res.sendStatus(200);
  } catch (err) {
    console.log("Webhook error:", err);
    res.sendStatus(500);
  }
  console.log("Webhook hit:", req.body);
  console.log("🔥 Webhook HIT");
});

export default router;