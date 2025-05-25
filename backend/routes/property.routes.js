import express from "express"
import {checkToken } from "../utils/jwt.utils.js"
import { addproperty , getprops , like , dislike , getliked} from '../controllers/property.controllers.js';

const router = express.Router();

router.post('/addproperty',checkToken,addproperty);
router.post('/getprops',getprops);
router.post('/like',checkToken,like);
router.post('/dislike',checkToken,dislike);
router.post('/getliked',checkToken,getliked);


export default router;   