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
      trim: true,
    },

    experience: {
      type: Number,
      default: 1,
      min: 0,
    },

    qualifications: {
      type: [String],
      default: [],
    },

    bio: {
      type: String,
      default: '',
    },

    rating: {
      type: Number,
      default: 4,
      min: 0,
      max: 5,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    location: {
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
