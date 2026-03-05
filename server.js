const express = require("express");
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const statusMonitor = require('express-status-monitor');
const logger = require('./utils/logger');
const { connectRedis } = require('./utils/cache');

// load env vars and validate
dotenv.config({ path: "./backend/.env" });
connectDB();

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// create http server for socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || '*' }
});

// simple socket connection logging
io.on('connection', (socket) => {
  logger.info('Socket connected', { id: socket.id });
  socket.on('disconnect', () => {
    logger.info('Socket disconnected', { id: socket.id });
  });
});

// make io available through request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// connect to Redis (for caching, sessions, etc.) - optional
connectRedis()
  .then(() => logger.info('Redis connected'))
  .catch(err => logger.warn('Redis unavailable (caching disabled)', { error: err.message }));

// monitoring
app.use(statusMonitor());

// --- global middleware ---
const analytics = require('./middleware/analyticsMiddleware');
app.use(analytics);
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// serve uploaded files
app.use('/uploads', express.static('uploads'));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// --- routes ---
app.get("/", (req, res) => {
    res.send("API is running...");
});

app.get("/api/v1", (req, res) => {
    res.json({
      version: "1.0.0",
      message: "KAT-MERN Project API",
      endpoints: {
        users: "/api/v1/users (register, login, profile)",
        packages: "/api/v1/packages (list, CRUD)",
        hotels: "/api/v1/hotels (list, CRUD)",
        bookings: "/api/v1/bookings (list, create, manage)",
        airlines: "/api/v1/airlines (list, CRUD)",
        guides: "/api/v1/guides (list, CRUD)",
        payments: "/api/v1/payments (list, CRUD)",
        analytics: "/api/v1/analytics (admin only, metrics)"
      },
      status: "/status"
    });
});

app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/packages', require('./routes/packageRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/hotels', require('./routes/hotelRoutes'));
app.use('/api/v1/airlines', require('./routes/airlineRoutes'));
app.use('/api/v1/guides', require('./routes/guideRoutes'));
app.use('/api/v1/payments', require('./routes/paymentRoutes'));
app.use('/api/v1/upload', require('./routes/uploadRoutes'));
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'));

// expose status page at /status
app.get('/status', statusMonitor().pageRoute);

// --- error handlers ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});