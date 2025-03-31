const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  responderName: {
    type: String,
    required: true
  },
  responseText: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  responderRole: {
    type: String,
    enum: ['admin', 'staff', 'supervisor'],
    required: true
  }
});

const complaintSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  userID: {
    type: String,
    required: [true, 'User ID is required'],
    index: true // Add index for faster queries
  },
  complaintNo: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  complaintText: {
    type: String,
    required: [true, 'Complaint text is required'],
    trim: true,
    minlength: [10, 'Complaint must be at least 10 characters long'],
    maxlength: [1000, 'Complaint cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Academic', 'Infrastructure', 'Hostel', 'Mess', 'Other'],
    index: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending',
    index: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  responses: [responseSchema],
  attachments: [{
    fileName: String,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  assignedTo: {
    type: String,
    default: null
  },
  resolvedAt: {
    type: Date
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
});

// Pre-save middleware to update lastUpdated
complaintSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Pre-save middleware to generate complaint number
complaintSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const count = await this.constructor.countDocuments();
      const year = new Date().getFullYear();
      this.complaintNo = `COMP${year}${(count + 1).toString().padStart(4, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Instance method to add response
complaintSchema.methods.addResponse = function(response) {
  this.responses.push(response);
  this.lastUpdated = new Date();
  return this.save();
};

// Instance method to update status
complaintSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  this.lastUpdated = new Date();
  if (newStatus === 'Resolved') {
    this.resolvedAt = new Date();
  }
  return this.save();
};

// Static method to find complaints by status
complaintSchema.statics.findByStatus = function(status) {
  return this.find({ status }).sort({ timestamp: -1 });
};

// Static method to find user's complaints
complaintSchema.statics.findUserComplaints = function(userID) {
  return this.find({ userID }).sort({ timestamp: -1 });
};

// Virtual for time since creation
complaintSchema.virtual('timeSinceCreation').get(function() {
  return Math.floor((Date.now() - this.timestamp) / 1000 / 60 / 60 / 24);
});

// Indexes for common queries
complaintSchema.index({ timestamp: -1 });
complaintSchema.index({ userID: 1, timestamp: -1 });
complaintSchema.index({ status: 1, timestamp: -1 });

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;