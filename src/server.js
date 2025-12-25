import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { protect } from './middleware/authMiddleware.js';

dotenv.config();
connectDB();

const app = express();

/* ================= MIDDLEWARE (ORDER MATTERS) ================= */

// ✅ CORS (OPEN – avoids Vercel domain issues)
app.use(cors());
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://medi-connect-frontend-tan.vercel.app/'],
    credentials: true,
  })
);

// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api', uploadRoutes);

// ✅ Static uploads
app.use('/uploads', express.static(path.resolve('uploads')));

/* ================= TEST ROUTES ================= */
app.get('/', (req, res) => {
  res.send('MediConnect API running');
});

app.get('/api/test/protected', protect, (req, res) => {
  res.json({
    message: 'Access granted',
    user: req.user,
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
