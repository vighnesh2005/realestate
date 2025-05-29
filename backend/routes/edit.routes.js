import express from "express"
import { deleteprop,editprop ,editprof, getprofile} from "../controllers/edit.controllers.js";
import { checkToken} from "../utils/jwt.utils.js"

const router  = express.Router();

router.post("/editprop",checkToken,editprop);
router.post("/editprof",checkToken,editprof);
router.post("/getprofile",checkToken,getprofile);
router.post("/deleteprop",checkToken,deleteprop);


export default router;