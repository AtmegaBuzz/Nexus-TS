import {Router} from "express";
import { login, me, setAuthToken } from "../controllers/auth.controller";
import authMiddleware from "../middleware";


const router = Router();

router.post("/login", login)
router.get("/me", authMiddleware, me)
router.get("/set-auth-token", authMiddleware, setAuthToken)


export default router;