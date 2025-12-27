import Doctor from '../models/Doctor.js';

/* ================= GET ALL APPROVED DOCTORS ================= */
export const getApprovedDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isApproved: true })
      .populate('user', 'name email')
      .select('specialization experience rating isAvailable location qualifications');

    const formatted = doctors.map((doc) => ({
      _id: doc._id,
      name: doc.user.name,
      email: doc.user.email,
      specialization: doc.specialization,
      experience: doc.experience,
      rating: doc.rating,
      isAvailable: doc.isAvailable,
      location: doc.location,
      qualifications: doc.qualifications,
    }));

    res.json(formatted);
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

    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'name email');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({
      id: doctor._id,
      name: doctor.user.name,
      email: doctor.user.email,
      specialization: doctor.specialization,
      experience: doctor.experience,
      bio: doctor.bio,
      qualifications: doctor.qualifications,
      isAvailable: doctor.isAvailable,
      location: doctor.location,
      rating: doctor.rating,
      isApproved: doctor.isApproved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE DOCTOR (PATIENT VIEW) ================= */
export const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({
      _id: req.params.id,
      isApproved: true,
    }).populate('user', 'name email');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({
      id: doctor._id,
      name: doctor.user.name,
      email: doctor.user.email,
      specialization: doctor.specialization,
      experience: doctor.experience,
      rating: doctor.rating,
      isAvailable: doctor.isAvailable,
      bio: doctor.bio,
      qualifications: doctor.qualifications,
      location: doctor.location,
    });
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

    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const { specialization, experience, isAvailable, bio, qualifications, location } = req.body;

    if (specialization !== undefined) doctor.specialization = specialization;
    if (experience !== undefined) doctor.experience = experience;
    if (isAvailable !== undefined) doctor.isAvailable = isAvailable;
    if (bio !== undefined) doctor.bio = bio;

    if (qualifications !== undefined) {
      doctor.qualifications = Array.isArray(qualifications)
        ? qualifications
        : qualifications.split(',').map((q) => q.trim());
    }

    if (location?.city && location?.state) {
      doctor.location = location;
    }

    await doctor.save();

    res.json({
      message: 'Profile updated successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
