import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    /* ================= COMMON FIELDS ================= */
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

    /* ================= DOCTOR APPROVAL ================= */
    isApproved: {
      type: Boolean,
      default: false,
    },

    /* ================= DOCTOR PROFILE ================= */
    specialization: {
      type: String,
      default: 'General Physician',
    },

    experience: {
      type: Number,
      default: 1,
      min: 0,
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
    },

    location: {
      city: {
        type: String,
        default: '',
      },
      state: {
        type: String,
        default: '',
      },
    },

    /* ================= OPTIONAL EXTENSIONS ================= */
    bio: {
      type: String,
      default: '',
    },

    qualifications: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
