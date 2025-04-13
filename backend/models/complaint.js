const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  responderName: { type: String, required: true },
  responseText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  responderRole: { type: String, enum: ['admin', 'staff', 'supervisor'], required: true }
});

const complaintSchema = new mongoose.Schema({
  userID: { type: String, required: false, index: true },
  tokenID: { type: String, required: false, index: true },
  complaintNo: { type: String, required: true, unique: true, index: true },
  complaintText: {
    type: String,
    required: [true, 'Complaint text is required'],
    trim: true,
    minlength: [10, 'Complaint must be at least 10 characters long'],
    maxlength: [1000, 'Complaint cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending',
    index: true
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  timestamp: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  responses: [responseSchema],
  imageAttachments: [
    { fileName: String, fileUrl: String, uploadedAt: { type: Date, default: Date.now } }
  ],
  assignedTo: { type: String, default: null },
  resolvedAt: { type: Date },
  isAnonymous: { type: Boolean, default: false }
});

// Pre-save middleware for unique complaint number
complaintSchema.pre('save', async function (next) {
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

// Pre-update middleware for auto-updating lastUpdated
complaintSchema.pre('findOneAndUpdate', function (next) {
  this.set({ lastUpdated: new Date() });
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
