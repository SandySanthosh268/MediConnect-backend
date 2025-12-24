import Appointment from '../models/Appointment.js';

/* ================= UPLOAD DOCUMENT ================= */
export const uploadDocument = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Only patient or doctor of this appointment
    if (
      appointment.patient.toString() !== req.user.id &&
      appointment.doctor.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.documents.push(req.file.filename);
    await appointment.save();

    res.json({
      message: 'Document uploaded successfully',
      file: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
