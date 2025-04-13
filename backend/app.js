const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path'); // ✅ Required to serve static image files
const razorRoutes = require('./routes/razorRoutes');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// ✅ Static folder for image serving (important for frontend to display images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());
app.use(cookieParser());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body Parser
app.use(express.json({ limit: '10kb' }));

// ✅ Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/qrcodes', require('./routes/qrRoutes'));
app.use('/api/tokens', require('./routes/tokenRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/voting', require('./routes/votingRoutes'));
app.use('/api/receipts', require('./routes/receiptRoutes'));
app.use('/api/payment', paymentRoutes);

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Welcome to the IIITG Mess Management Backend API');
});

// ✅ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Can't find ${req.originalUrl} on this server`
  });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
