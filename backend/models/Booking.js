import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
  seatsBooked: { type: [Number], required: true },
  totalFare: { type: Number, required: true },
  travelDate: { type: String },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
