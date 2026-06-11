import { Router } from 'express';
import { getDriftAnalogy } from '../controllers/driftController';

const router = Router();

// POST /api/drift/analogy
// Body: { problem: string }
router.post('/analogy', getDriftAnalogy);

export default router;
