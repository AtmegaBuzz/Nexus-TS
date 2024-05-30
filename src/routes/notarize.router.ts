import {Router} from "express";
import { checkNewDevice, cidExists, offchainNotarization, verifyNotarizedData } from "../controllers/notarize.controller";

const router = Router();

router.post("/", offchainNotarization)
router.post("/verify", verifyNotarizedData)
router.get("/check-device", checkNewDevice)
router.get("/verify-cid", cidExists)


export default router;