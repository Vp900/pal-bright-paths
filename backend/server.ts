// src/index.ts  (or backend/index.ts)
// ===============================
// FINAL UPDATED SERVER FILE
// ===============================

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import enquiryRoutes from './routes/enquiry';
import contactRoutes from './routes/contact';

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;

/* ==================================
   CORS CONFIG (PRODUCTION + LOCAL)
================================== */

const allowedOrigins = [
  process.env.FRONTEND_URL,                 // ✅ keep in Render env
  'https://pal-bright-paths-1.onrender.com', // ✅ production frontend
  'http://localhost:5173',                  // ✅ local vite
  'http://localhost:8080',                  // ✅ local
].filter(Boolean) as string[];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/* NOTE:
   ❌ app.options('*', cors()) removed
   Because app.use(cors(...)) already handles preflight properly
*/

app.use(express.json());

/* ROUTES */
app.use('/api/auth', authRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Backend is running');
});

/* ==================================
   MONGODB CONNECT + START SERVER
================================== */

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('❌ MONGO_URI is missing in environment variables');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(port, '0.0.0.0', () => {
      console.log(`✅ Server running on http://0.0.0.0:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  });
