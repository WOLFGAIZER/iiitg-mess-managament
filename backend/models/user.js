const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true,
    unique: true 
  },
  rollNo: { 
    type: String, 
    required: true, 
    unique: true 
  },
  contact: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);  // Validates 10-digit phone numbers
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student' 
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    code: String,
    expiresAt: Date
  },
  USERID: { type: String, required: true, unique: true }, // Unique user identifier (e.g., roll number)
  course: { 
    type: String, 
    required: true, 
    enum: ['B.Tech', 'M.Tech', 'PhD'], 
    default: 'B.Tech' 
  },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite error
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
