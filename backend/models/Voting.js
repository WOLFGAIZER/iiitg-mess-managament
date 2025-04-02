const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  electionId: { type: String, required: true },
  candidate: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Voting = mongoose.model("Voting", voteSchema);
module.exports = Voting;