import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    specialization: {
      type: String,
      required: true,
    },

    experience: {
      type: Number,
      default: 1,
    },

    qualifications: [String],

    bio: String,

    rating: {
      type: Number,
      default: 4,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    clinicAddress: String,
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
