const express = require("express");
const router = express.Router();
const Voting = require("../models/Voting");
const { authenticateToken, restrictToAdmin } = require("../middleware/auth");

// Cast a vote (authenticated users)
router.post("/", authenticateToken, async (req, res) => {
  const { electionId, candidate } = req.body;
  try {
    const vote = new Voting({
      userId: req.user._id, // From authenticateToken
      electionId,
      candidate,
    });
    await vote.save();
    res.status(201).json({ message: "Vote cast successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error casting vote", error: error.message });
  }
});

// Get all votes (admin only)
router.get("/", authenticateToken, restrictToAdmin, async (req, res) => {
  try {
    const votes = await Voting.find();
    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching votes", error: error.message });
  }
});

module.exports = router;