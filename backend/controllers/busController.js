import Bus from '../models/bus.js';

// Add a new bus (Admin)
export const addBus = async (req, res) => {
  const { busName, source, destination, departureTime, arrivalTime, fare, seats, travelDate } = req.body;

  try {
    const newBus = new Bus({
      busName, source, destination, departureTime, arrivalTime, fare, seats, travelDate
    });

    const savedBus = await newBus.save();
    res.status(201).json(savedBus);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add bus', error: err.message });
  }
};


// Get all buses
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching buses', error: err.message });
  }
};

// Search buses by source, destination, and optional travelDate
export const searchBuses = async (req, res) => {
  const { source, destination, travelDate } = req.body;

  try {
    const buses = await Bus.find({
      source: { $regex: source, $options: 'i' },
      destination: { $regex: destination, $options: 'i' },
      travelDate
    });

    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: 'Error searching buses', error: err.message });
  }
};



// Update bus (Admin)
export const updateBus = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBus = await Bus.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedBus);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update bus', error: err.message });
  }
};

// Delete bus (Admin)
export const deleteBus = async (req, res) => {
  const { id } = req.params;

  try {
    await Bus.findByIdAndDelete(id);
    res.json({ message: 'Bus deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete bus', error: err.message });
  }
};
