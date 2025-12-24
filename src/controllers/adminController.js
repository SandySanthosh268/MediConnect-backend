import User from '../models/User.js';

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
    const doctors = await User.find({
      role: 'DOCTOR',
      isApproved: false,
    }).select('-password');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= APPROVE / REJECT DOCTOR ================= */
export const updateDoctorStatus = async (req, res) => {
  try {
    const { approved } = req.query;

    const doctor = await User.findById(req.params.id);
    if (!doctor || doctor.role !== 'DOCTOR') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isApproved = approved === 'true';
    await doctor.save();

    res.json({
      message: `Doctor ${approved === 'true' ? 'approved' : 'rejected'}`,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        isApproved: doctor.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
