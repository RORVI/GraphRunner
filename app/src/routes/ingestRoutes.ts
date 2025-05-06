import { Router } from 'express';
import { ingestData } from '../controllers/ingestController';

const router = Router();

router.post('/ingest', ingestData);

export const ingestRoutes = router;
