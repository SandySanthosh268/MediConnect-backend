import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

/* ================= CREATE APPOINTMENT (PATIENT) ================= */
export const createAppointment = async (req, res) => {
  try {
    if (req.user.role !== 'PATIENT') {
      return res.status(403).json({ message: 'Only patients can book appointments' });
    }

    const { doctorId, date } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'DOCTOR' || !doctor.isApproved) {
      return res.status(400).json({ message: 'Invalid or unapproved doctor' });
    }

    // Prevent double booking
    const existing = await Appointment.findOne({
      doctor: doctorId,
      date,
      status: { $ne: 'CANCELLED' },
    });

    if (existing) {
      return res.status(400).json({ message: 'Doctor already booked for this slot' });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
    });

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= PATIENT APPOINTMENTS ================= */
export const getPatientAppointments = async (req, res) => {
  try {
    if (req.user.role !== 'PATIENT') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const appointments = await Appointment.find({
      patient: req.user.id,
    })
      .populate('doctor', 'name email specialization')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DOCTOR APPOINTMENTS ================= */
export const getDoctorAppointments = async (req, res) => {
  try {
    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!req.user.isApproved) {
      return res.status(403).json({ message: 'Doctor approval pending' });
    }

    const appointments = await Appointment.find({
      doctor: req.user.id,
    })
      .populate('patient', 'name email')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE APPOINTMENT STATUS (DOCTOR) ================= */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['CONFIRMED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ message: 'Only doctors can update status' });
    }

    if (!req.user.isApproved) {
      return res.status(403).json({ message: 'Doctor approval pending' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CANCEL APPOINTMENT (PATIENT) ================= */
export const cancelAppointment = async (req, res) => {
  try {
    if (req.user.role !== 'PATIENT') {
      return res.status(403).json({ message: 'Only patients can cancel appointments' });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = 'CANCELLED';
    await appointment.save();

    res.json({
      message: 'Appointment cancelled',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
