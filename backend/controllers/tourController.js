import Tour from '../models/Tour.js';

// Add a new tour
export const addTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add tour', error: err.message });
  }
};

// Get all tours
export const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json(tours);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tours', error: err.message });
  }
};

// Delete tour
export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete tour', error: err.message });
  }
};

// Update tour
export const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTour);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update tour', error: err.message });
  }
};

// Book tour seat
export const bookTourSeat = async (req, res) => {
  const { userId, tourId, seatsBooked } = req.body;

  try {
    const tour = await Tour.findById(tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });

    const conflict = seatsBooked.some(seat => tour.bookedSeats.includes(seat));
    if (conflict) return res.status(400).json({ message: 'Some seats are already booked' });

    tour.bookedSeats.push(...seatsBooked);
    await tour.save();

    res.status(200).json({ message: 'Tour booked successfully', tour });
  } catch (err) {
    res.status(500).json({ message: 'Booking failed', error: err.message });
  }
};
