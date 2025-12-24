import express from 'express';
import {
  getAllUsers,
  getPendingDoctors,
  updateDoctorStatus,
} from '../controllers/adminController.js';

import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/users', protect, adminOnly, getAllUsers);
router.get('/doctors/pending', protect, adminOnly, getPendingDoctors);
router.put('/doctors/:id/status', protect, adminOnly, updateDoctorStatus);

export default router;
