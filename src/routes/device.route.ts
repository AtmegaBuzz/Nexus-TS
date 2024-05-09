import {Router} from "express";
import { getDeviceDetail, getDevices } from "../controllers/device.controller";


const router = Router();

router.get("/all", getDevices)
router.get("/", getDeviceDetail)


export default router;