import { Request, Response } from "express"
import { prisma } from "../Prisma";
import { Decimal } from "@prisma/client/runtime/library";


interface NotarizedDataInterface {

    Time: String,
    ANALOG: {
        Temperature1: Decimal
    },
    ENERGY: {
        TotalStartTime: String,
        Total: Decimal,
        Yesterday: Decimal,
        Today: Decimal,
        Power: number,
        ApparentPower: number,
        ReactivePower: number,
        Factor: Decimal,
        Voltage: number,
        Current: Decimal
    },
    TempUnit: String
}

export const offchainNotarization = async (req: Request, res: Response) => {

    try {

        console.log(req.body)
        const address = req.body.address;
        const data: NotarizedDataInterface = JSON.parse(req.body.data);

        const device = await prisma.device.findFirst({
            where: {
                address: address
            }
        })

        if (device === null) {
            res.send("DEVICE DOESN'T EXISTS")
        }

        else {

            await prisma.notarizedData.create({
                data: {
                    deviceId: device?.id!,
                    time: new Date(data.Time.toString()),
                    temprature: data.ANALOG.Temperature1,
                    totalEnergy: data.ENERGY.Total,
                    today: data.ENERGY.Today,
                    power: data.ENERGY.Power,
                    apparentPower: data.ENERGY.ApparentPower,
                    reactivePower: data.ENERGY.ReactivePower, 
                    factor: data.ENERGY.Factor,
                    voltage: data.ENERGY.Voltage,
                    current: data.ENERGY.Current,
                }
            })


            res.send("OK")
            
        }

    } catch (e: any) {
        console.log(e)
    }
}