import Review from '../models/Review.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

/* ================= ADD REVIEW ================= */
export const addReview = async (req, res) => {
  const { appointmentId, rating, comment } = req.body;

  try {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment || appointment.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (appointment.status !== 'CONFIRMED') {
      return res.status(400).json({ message: 'Appointment not completed' });
    }

    const existing = await Review.findOne({ appointment: appointmentId });
    if (existing) {
      return res.status(400).json({ message: 'Review already submitted' });
    }

    const review = await Review.create({
      doctor: appointment.doctor,
      patient: req.user.id,
      appointment: appointmentId,
      rating,
      comment,
    });

    /* ===== Update Doctor Rating ===== */
    const reviews = await Review.find({ doctor: appointment.doctor });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await User.findByIdAndUpdate(appointment.doctor, {
      rating: avgRating.toFixed(1),
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET DOCTOR REVIEWS ================= */
export const getDoctorReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ doctor: req.params.id })
      .populate('patient', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
