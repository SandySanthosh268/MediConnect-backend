import Review from '../models/Review.js';
import Appointment from '../models/Appointment.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

/* ================= ADD REVIEW (PATIENT) ================= */
export const addReview = async (req, res) => {
  try {
    const { appointmentId, rating, comment } = req.body;

    /* 🔹 Patient only */
    if (req.user.role !== 'PATIENT') {
      return res.status(403).json({ message: 'Patient access only' });
    }

    const patient = await Patient.findOne({ user: req.user.id });
    if (!patient) {
      return res.status(404).json({ message: 'Patient profile not found' });
    }

    /* 🔹 Validate appointment */
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient.toString() !== patient._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (appointment.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Appointment not completed yet' });
    }

    /* 🔹 Prevent duplicate review */
    const existing = await Review.findOne({ appointment: appointmentId });
    if (existing) {
      return res.status(400).json({ message: 'Review already submitted' });
    }

    /* 🔹 Create review */
    const review = await Review.create({
      doctor: appointment.doctor,
      patient: patient._id,
      appointment: appointmentId,
      rating,
      comment,
    });

    /* 🔹 Update doctor average rating */
    const reviews = await Review.find({ doctor: appointment.doctor });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Doctor.findByIdAndUpdate(appointment.doctor, {
      rating: Number(avgRating.toFixed(1)),
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET DOCTOR REVIEWS ================= */
export const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.id })
      .populate({
        path: 'patient',
        populate: { path: 'user', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
