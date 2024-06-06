import { Request, Response } from "express"
import { prisma } from "../Prisma";
import * as jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { hash } from "../utils";

export const login = async (req: Request, res: Response) => {

    try {

        const {email,password} = req.body;
        console.log(email)
        console.log(email,password,req.body)
        if (email === undefined || password === undefined ) {
            return res.status(400).json("Invalid Request, need email and password")
        }

        let passHash = await hash(password);

        const user = await prisma.user.findFirst({
            where:{
                email,
                password: passHash
            }
        })

        if (!user) {
            return res.status(401).json("Wrong credentials");
        }

        const token = jwt.sign({userId: user.id}, process.env.SECRET_KEY!,{expiresIn: '100h'})
        res.status(200).json({ token, authToken: user.machineAuthToken });

    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}

export const register = async (req: Request, res: Response) => {

    try {

        const {name,email,password,publicKey} = req.body;
        console.log(name,password)
        if (email === undefined || password === undefined ) {
            return res.status(400).json("Invalid Request, need email and password")
        }

        let userExists = await prisma.user.findFirst({
            where: {
                email,
            }
        })

        if (userExists) {
            return res.status(400).json("User with this email already exists")
        }

        let passHash = await hash(password);
        
        await prisma.user.create({
            data:{
                name,
                email,
                password: passHash,
                machineAuthToken: randomUUID().toString(),
                publicKey
            }
        })        

        res.status(201).json();

    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}


export const me = async (req: Request, res: Response) => {

    try {

        const {userId} = req.body;
        const user = await prisma.user.findFirstOrThrow({
            where:{
                id: userId
            }
        })

        res.status(200).json(user);

    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}


export const setAuthToken = async (req: Request, res: Response) => {

    try {

        const {userId} = req.body;
        const user = await prisma.user.update({
            where:{
                id: userId
            },
            data: {
                machineAuthToken: randomUUID().toString(),
            }
        })

        res.status(200).json(user);

    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}