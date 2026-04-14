// import express from "express";
// import { Project } from "../models/project.js";
// import { Notification } from "../models/notification.js";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     console.log("🔥 Webhook HIT");

//     const repoFullName = req.body.repository?.full_name; //  best
//     const commits = req.body.commits || [];

//     console.log("Repo Full Name:", repoFullName);

//     // project find (using includes / regex)
//     const project = await Project.findOne({
//       githubRepo: { $regex: repoFullName, $options: "i" },
//     });

//     console.log("Found Project:", project);

//     if (!project) return res.sendStatus(404);

//     const latestCommit = commits[0];

//     const message = latestCommit?.message || "New commit";
//     const author = latestCommit?.author?.name || "Someone";

//     await Notification.create({
//       type: "github",
//       message: `🚀 ${author} pushed: "${message}"`,
//       project: project._id,
//     });

//     res.sendStatus(200);
//   } catch (err) {
//     console.log("Webhook error:", err);
//     res.sendStatus(500);
//   }
// });

// export default router;