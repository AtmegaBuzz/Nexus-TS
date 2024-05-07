import {Router} from "express";
import { offchainNotarization } from "../controllers/notarize.controller";

const router = Router();

router.post("/", offchainNotarization)


export default router;