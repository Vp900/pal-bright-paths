const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

// FORCE Google DNS to fix MongoDB SRV resolution issues on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = require('./config/db');

// Load env vars
dotenv.config();

const authRoutes = require('./routes/auth');
const enquiryRoutes = require('./routes/enquiry');
const contactRoutes = require('./routes/contact');

const app = express();
const port = Number(process.env.PORT) || 5000;

/* ==================================
   CORS CONFIG (strict env based)
================================== */
const allowedOrigins = (process.env.FRONTEND_URL || '').split(',').map(url => url.trim()).filter(Boolean);

if (allowedOrigins.length === 0) {
  console.warn('⚠️ FRONTEND_URL is not defined in .env. Defaulting to local ports for development.');
  allowedOrigins.push('http://localhost:5173', 'http://localhost:8080');
}

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

/* ROUTES */
app.use('/api/auth', authRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server running on http://0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
