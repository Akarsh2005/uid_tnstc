import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  busName: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  fare: { type: Number, required: true },
  seats: { type: Number, required: true },
  travelDate: { type: String, required: true }, // 'YYYY-MM-DD'
  bookedSeats: {
    type: [Number],
    default: []
  }
});

const Bus = mongoose.model('Bus', busSchema);
export default Bus;
