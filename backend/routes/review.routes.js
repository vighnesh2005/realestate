import express from 'express'
import {checkToken} from "../utils/jwt.utils.js"
import {addreview} from "../controllers/review.controllers.js"

const router = express.Router();

router.post('/addreview',checkToken,addreview); 

export default router;