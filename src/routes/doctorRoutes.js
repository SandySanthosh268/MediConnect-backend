import express from 'express';
import {
  getApprovedDoctors,
  getDoctorById,
  updateDoctorProfile,
  getDoctorProfile,
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getApprovedDoctors);

/* 🔹 SELF EDIT PROFILE */
router.get('/profile', protect, getDoctorProfile);
router.put('/profile/update', protect, updateDoctorProfile);

router.get('/:id', protect, getDoctorById);

export default router;
