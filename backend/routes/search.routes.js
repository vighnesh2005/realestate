import express from 'express'
import { search , view } from '../controllers/search.controllers.js';

const router = express.Router();

router.post("/search",search);
router.post("/view",view);

export default router;