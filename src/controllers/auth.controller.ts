import { Request, Response } from "express"
import { prisma } from "../Prisma";
import * as jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {

    try {

        const {email,password} = req.body;
        console.log(email,password,req.body)
        if (email === undefined || password === undefined ) {
            return res.status(400).json("Invalid Request, need email and password")
        }

        const user = await prisma.user.findFirst({
            where:{
                email,
                password
            }
        })

        if (!user) {
            return res.status(401).json("Wrong credentials");
        }

        const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY!,{expiresIn: '100h'})
        res.status(200).json({ token });

    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}


export const me = async (req: Request, res: Response) => {

    try {

        const {userId} = req.body;
        const user = await prisma.user.findFirst({
            where:{
                id: userId
            }
        })

        if (!user) {
            return res.status(401).json("Wrong credentials");
        }

        res.status(200).json(user);

    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}