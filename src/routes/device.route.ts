import {Router} from "express";
import { getDeviceDetail, getDevices } from "../controllers/device.controller";
import authMiddleware from "../middleware";


const router = Router();

router.get("/all", authMiddleware, getDevices)
router.get("/", authMiddleware, getDeviceDetail)


export default router;