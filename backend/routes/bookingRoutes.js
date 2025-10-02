// routes/bookingRoutes.js
import express from 'express';
const router = express.Router();
import {
  bookTicket,
  bookTour,
  getMyBookings,
  cancelBooking,
  getAllBookings
} from '../controllers/bookingController.js';

router.post('/', bookTicket); // Bus booking
router.post('/tour', bookTour); // ✅ Tour booking
router.post('/mybookings', getMyBookings);
router.delete('/:id', cancelBooking);
router.get('/', getAllBookings);

export default router;
