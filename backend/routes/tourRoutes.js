import express from 'express';
const router = express.Router();

import {
  addTour,
  getAllTours,
  bookTourSeat,
  deleteTour,
  updateTour
} from '../controllers/tourController.js';

router.post('/', addTour); // Admin
router.get('/', getAllTours);
router.post('/book', bookTourSeat);
router.delete('/:id', deleteTour); // Admin
router.put('/:id', updateTour);   // Admin

export default router;
