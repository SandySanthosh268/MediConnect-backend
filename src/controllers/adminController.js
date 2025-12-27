import User from '../models/User.js';
import Doctor from '../models/Doctor.js';

/* ================= GET ALL USERS ================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET PENDING DOCTORS ================= */
export const getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: false })
      .populate('user', 'name email')
      .select('specialization experience isApproved createdAt');

    const formatted = doctors.map((doc) => ({
      id: doc._id,
      name: doc.user.name,
      email: doc.user.email,
      specialization: doc.specialization,
      experience: doc.experience,
      isApproved: doc.isApproved,
      registeredAt: doc.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= APPROVE / REJECT DOCTOR ================= */
export const updateDoctorStatus = async (req, res) => {
  try {
    const { approved } = req.query;

    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isApproved = approved === 'true';
    await doctor.save();

    res.json({
      message: `Doctor ${approved === 'true' ? 'approved' : 'rejected'} successfully`,
      doctor: {
        id: doctor._id,
        name: doctor.user.name,
        email: doctor.user.email,
        isApproved: doctor.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
