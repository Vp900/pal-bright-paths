import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import enquiryRoutes from './routes/enquiry';
import contactRoutes from './routes/contact';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

/* 🔥 CORS CONFIG */
app.use(cors({
  origin: [
    'https://pal-bright-paths-1.onrender.com',
    'http://localhost:5173',
    'http://localhost:8080'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

/* 🔥 PRE-FLIGHT FIX */
app.options('*', cors());

app.use(express.json());

/* ROUTES */
app.use('/api/auth', authRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

/* DB */
mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection failed', err);
  });
