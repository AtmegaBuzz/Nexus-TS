import {Router} from "express";
import { offchainNotarization, verifyNotarizedData } from "../controllers/notarize.controller";

const router = Router();

router.post("/", offchainNotarization)
router.post("/verify", verifyNotarizedData)



export default router;