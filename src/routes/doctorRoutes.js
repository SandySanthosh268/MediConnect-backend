import express from 'express';
import {
  getApprovedDoctors,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorById,
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/* Public / Patient */
router.get('/', protect, getApprovedDoctors);
router.get('/:id', protect, getDoctorById);

/* Doctor */
router.get('/profile/me', protect, getDoctorProfile);
router.put('/profile/update', protect, updateDoctorProfile);

export default router;
