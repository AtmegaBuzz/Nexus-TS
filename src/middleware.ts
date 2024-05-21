import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export default function authMiddleware(req: Request,res: Response,next: NextFunction) {
    
    try{
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ error: 'Access denied' });
        }
    
        const decode: any = jwt.verify(token, process.env.SECRET_KEY!);
        req.body.userId = decode.userId;
    
        next();
    }

    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }

}