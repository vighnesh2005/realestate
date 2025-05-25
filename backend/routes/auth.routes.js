import express from 'express';
import {checkToken} from '../utils/jwt.utils.js'
import { login, signup, logout } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/login',login);
router.post('/signup',signup);
router.post('/logout',checkToken,logout);

export default router;