import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    enum: ['1 Day', '2 Days', '3 Days'],
    required: true
  },
  places: {
    type: [String],
    required: true
  },
  fare: {
    type: Number,
    required: true
  },
  seats: {
    type: Number,
    required: true
  },
  bookedSeats: {
    type: [Number],
    default: []
  },
  departureTime: String,
  returnTime: String
}, { timestamps: true });

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
