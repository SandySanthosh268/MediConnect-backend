import express from 'express';
import {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/* PATIENT */
router.post('/', protect, createAppointment);
router.get('/patient', protect, getPatientAppointments);
router.put('/:id/cancel', protect, cancelAppointment);

/* DOCTOR */
router.get('/doctor', protect, getDoctorAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);

export default router;
