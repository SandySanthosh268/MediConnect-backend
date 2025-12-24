import express from 'express';
import {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment
} from '../controllers/appointmentController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/* Patient */
router.post('/', protect, createAppointment);
router.get('/patient', protect, getPatientAppointments);
router.delete('/:id', protect, cancelAppointment);

/* Doctor */
router.get('/doctor', protect, getDoctorAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);

export default router;
