import {Router} from "express";
import { addDevice, deleteDevice, getDeviceDetail, getDevices } from "../controllers/device.controller";
import authMiddleware from "../middleware";


const router = Router();

router.get("/all", authMiddleware, getDevices)
router.get("/", authMiddleware, getDeviceDetail)
router.post("/add", authMiddleware, addDevice)
router.post("/delete", authMiddleware, deleteDevice)


export default router;