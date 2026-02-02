import mongoose, { Schema, Model } from 'mongoose';
import { Reservation } from '../types';

const ReservationSchema = new Schema<Reservation>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    specialRequests: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      required: false,
    },
    createdAt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ReservationModel: Model<Reservation> =
  mongoose.models.Reservation || mongoose.model<Reservation>('Reservation', ReservationSchema);

export default ReservationModel;
