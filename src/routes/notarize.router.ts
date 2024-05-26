import {Router} from "express";
import { checkNewDevice, offchainNotarization, verifyNotarizedData } from "../controllers/notarize.controller";

const router = Router();

router.post("/", offchainNotarization)
router.post("/verify", verifyNotarizedData)
router.get("/check-device", checkNewDevice)


export default router;