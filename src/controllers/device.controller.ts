import { Request, Response } from "express"
import { prisma } from "../Prisma";

export const getDevices = async (req: Request, res: Response) => {

    try {

        let devices = await prisma.device.findMany({
            where: {
                userId: req.body.userId
            }
        });

        res.send(devices).status(200)

    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}


export const getDeviceDetail = async (req: Request, res: Response) => {

    try {

        const address = req.query.address;

        let resp = await fetch("https://testnet-api.rddl.io/planetmint/asset/address/plmnt1sqlv2x8rjvxdjv87uh5l47erpazx8umwhd7t90/3", {
            method: "GET"
        })

        let js = await resp.json();

        if (typeof(address) === typeof("")) {
            let device = await prisma.device.findFirst({
                where: {
                    address: address?.toString()
                },
                include: {
                    data: true
                }
            });
            

            res.send(device).status(200)
        }
        
        else {
            res.send("Device Address not passed").status(400);
        }
            
    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}

export const addDevice = async (req: Request, res: Response) => {

    try {

        console.log(req.body)

        let device = await prisma.device.create({
            data: {
                address: req.body.address,
                machineId: req.body.machineId,
                userId: req.body.userId
            }
        })

        res.status(201).json(device)
            
    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}

export const deleteDevice = async (req: Request, res: Response) => {

    try {

        await prisma.device.delete({
            where: {
                id: parseInt(req.body.id),
                userId: req.body.userId
            }
        })

        res.status(200).json("Deleted")
            
    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}