import express from "express"
import { editprop ,editprof} from "../controllers/edit.controllers.js";
import { checkToken} from "../utils/jwt.utils.js"

const router  = express.Router();

router.post("/editprop",checkToken,editprop);
router.post("/editprof",checkToken,editprof);

export default router;