import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';
// import Appointment from '../models/Appointment.js';
// import Patient from '../models/Patient.js';

/* ================= CREATE APPOINTMENT (PATIENT) ================= */
export const createAppointment = async (req, res) => {
  try {
    const { doctorId, date } = req.body;

    /* 🔹 Get logged-in patient */
    if (req.user.role !== 'PATIENT') {
      return res.status(403).json({ message: 'Patient access only' });
    }

    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    /* 🔹 Validate doctor */
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isApproved) {
      return res.status(400).json({ message: 'Invalid or unapproved doctor' });
    }

    /* 🔹 Create appointment */
    const appointment = await Appointment.create({
      patient: patient._id,
      doctor: doctor._id,
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
    /* 🔐 Role check */
    if (req.user.role !== 'PATIENT') {
      return res.status(403).json({ message: 'Patient access only' });
    }

    /* 👤 Find patient profile */
    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    /* 📅 Fetch appointments */
    const appointments = await Appointment.find({
      patient: patient._id,
    })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email',
        },
      })
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
      return res.status(403).json({ message: 'Doctor access only' });
    }

    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointments = await Appointment.find({
      doctor: doctor._id,
    })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name email' },
      })
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE APPOINTMENT STATUS (DOCTOR) ================= */
export const updateAppointmentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ message: 'Doctor access only' });
    }

    const { status } = req.body;

    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.doctor.toString() !== doctor._id.toString()) {
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
      return res.status(403).json({ message: 'Patient access only' });
    }

    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = 'CANCELLED';
    await appointment.save();

    res.json({
      message: 'Appointment cancelled successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
