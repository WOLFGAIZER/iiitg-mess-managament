const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  USERID: { type: String, default: () => uuidv4(), required: true },
  rollNo: { type: String, required: true }, // Make rollNo unique
  username: { type: String, required: true },
  password: { type: String, required: true },
  EmailID: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(email) {
        return /@iiitg\.ac\.in$/.test(email) || /@gmail\.com$/.test(email); // ✅ Allow @iiitg.ac.in or @gmail.com
      },
      message: "Invalid email format. Must be an @iiitg.ac.in or @gmail.com email."
    }
  },
  course: { type: String, enum: ["B.Tech", "M.Tech", "PhD"], required: true }
});

// Use existing model if already compiled, otherwise create a new one
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
