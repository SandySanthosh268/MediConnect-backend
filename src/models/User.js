import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ['PATIENT', 'DOCTOR', 'ADMIN'],
      default: 'PATIENT',
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    specialization: {
      type: String,
      default: 'General Physician',
    },

    experience: {
      type: Number,
      min: 0,
      default: 1,
    },

    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    phone: {
      type: String,
      required: function () {
        return this.role === 'DOCTOR';
      },
      trim: true,
      match: [/^\d{10}$/, 'Phone number must be exactly 10 digits'],
    },

    location: {
      city: { type: String, default: '' },
      state: { type: String, default: '' },
    },

    bio: {
      type: String,
      default: '',
    },

    qualifications: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
