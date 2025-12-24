import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();

/* ================= CORS ================= */
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://medi-connect-frontend.vercel.app', // ✅ REAL VERCEL URL
    ],
    credentials: true,
  })
);

/* ================= MIDDLEWARE ================= */
app.use(express.json());

/* ================= ROUTES ================= */
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', uploadRoutes);
app.use('/uploads', express.static(path.resolve('uploads')));

/* ================= TEST ROUTES ================= */
app.get('/', (req, res) => {
  res.send('Book a Doctor API is running');
});

app.get('/api/test/protected', protect, (req, res) => {
  res.json({
    message: 'Access granted',
    user: req.user,
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
