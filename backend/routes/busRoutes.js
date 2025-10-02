import express from 'express';
import { addBus, getAllBuses, updateBus, deleteBus ,searchBuses} from '../controllers/busController.js';

const router = express.Router();

router.post('/', addBus);
router.get('/', getAllBuses);
router.put('/:id', updateBus);
router.delete('/:id', deleteBus);
router.post('/search', searchBuses); // POST /api/buses/search


export default router;
