import {Router} from "express";
import { login, me, setAuthToken, register } from "../controllers/auth.controller";
import authMiddleware from "../middleware";


const router = Router();

router.post("/login", login)
router.post("/register", register)
router.get("/me", authMiddleware, me)
router.get("/set-auth-token", authMiddleware, setAuthToken)



export default router;