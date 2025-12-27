import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    phone: String,
    age: Number,
    gender: String,
    address: String,
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);
