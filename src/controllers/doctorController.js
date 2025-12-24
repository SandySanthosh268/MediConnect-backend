import User from '../models/User.js';

/* ================= GET ALL APPROVED DOCTORS ================= */
export const getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await User.find({
      role: 'DOCTOR',
      isApproved: true,
    }).select('name email phone location specialization experience rating isAvailable');

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET LOGGED-IN DOCTOR PROFILE ================= */
export const getDoctorProfile = async (req, res) => {
  try {
    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ message: 'Doctor access only' });
    }

    const doctor = await User.findById(req.user.id).select(
      'name email phone location specialization experience bio qualifications isAvailable'
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE DOCTOR PROFILE ================= */
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'DOCTOR',
      isApproved: true,
    }).select(
      'name email phone location specialization experience rating isAvailable bio qualifications'
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE DOCTOR PROFILE ================= */
export const updateDoctorProfile = async (req, res) => {
  try {
    if (req.user.role !== 'DOCTOR') {
      return res.status(403).json({ message: 'Doctor access only' });
    }

    const doctor = await User.findById(req.user.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const { name, specialization, experience, isAvailable, bio, qualifications, phone, location } =
      req.body;

    if (name !== undefined) doctor.name = name;
    if (specialization !== undefined) doctor.specialization = specialization;
    if (experience !== undefined) doctor.experience = experience;
    if (isAvailable !== undefined) doctor.isAvailable = isAvailable;
    if (bio !== undefined) doctor.bio = bio;
    if (qualifications !== undefined) doctor.qualifications = qualifications;
    if (phone !== undefined) doctor.phone = phone;
    if (location !== undefined) doctor.location = location;

    await doctor.save();

    res.json({
      message: 'Profile updated successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
