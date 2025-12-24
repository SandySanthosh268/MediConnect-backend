import mongoose from 'mongoose';
import { type } from 'os';

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
      default: 'PENDING',
    },
    documents: [{type:String}],
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
