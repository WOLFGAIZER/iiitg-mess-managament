const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  EmailID: { type: String, required: true, unique: true },
  course: { type: String, enum: ["B.Tech", "M.Tech", "PhD"], required: true }
});

// Use existing model if already compiled, otherwise create a new one
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
