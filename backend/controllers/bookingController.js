import Booking from '../models/Booking.js';
import Bus from '../models/bus.js';
import Tour from '../models/Tour.js';
import User from '../models/user.js';

export const bookTicket = async (req, res) => {
  const { userId, busId, seatsBooked } = req.body;

  try {
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });

    const isConflict = seatsBooked.some(seat => bus.bookedSeats.includes(seat));
    if (isConflict) return res.status(400).json({ message: 'Some seats are already booked' });

    const totalFare = bus.fare * seatsBooked.length;

    const booking = await Booking.create({
      userId, busId, seatsBooked, totalFare, travelDate: bus.travelDate
    });

    bus.bookedSeats.push(...seatsBooked);
    await bus.save();

    await User.findByIdAndUpdate(userId, { $push: { pastBookings: booking._id } });

    res.status(201).json({ message: 'Bus booking successful', booking });
  } catch (err) {
    res.status(500).json({ message: 'Bus booking failed', error: err.message });
  }
};

export const bookTour = async (req, res) => {
  const { userId, tourId, seatsBooked } = req.body;

  try {
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const conflict = seatsBooked.some(seat => tour.bookedSeats.includes(seat));
    if (conflict) return res.status(400).json({ message: 'Some seats are already booked' });

    const totalFare = tour.fare * seatsBooked.length;

    const booking = await Booking.create({
      userId, tourId, seatsBooked, totalFare,
      travelDate: new Date().toISOString().split('T')[0]
    });

    tour.bookedSeats.push(...seatsBooked);
    await tour.save();

    await User.findByIdAndUpdate(userId, { $push: { pastBookings: booking._id } });

    res.status(201).json({ message: 'Tour booking successful', booking });
  } catch (err) {
    res.status(500).json({ message: 'Tour booking failed', error: err.message });
  }
};




// controllers/bookingController.js
export const getMyBookings = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const bookings = await Booking.find({ userId })
      .populate('busId')
      .populate('tourId')
      .populate('userId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history', error: err.message });
  }
};



export const cancelBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    const bus = await Bus.findById(booking.busId);
    bus.bookedSeats = bus.bookedSeats.filter(seat => !booking.seatsBooked.includes(seat));
    await bus.save();

    res.json({ message: 'Cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed', error: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name emailId')
      .populate('busId')
      .populate('tourId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error getting all bookings', error: err.message });
  }
};
