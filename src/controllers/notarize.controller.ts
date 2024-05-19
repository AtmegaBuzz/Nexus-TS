import { Request, Response } from "express"
import { prisma } from "../Prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { generateCID } from "../utils";
import { mintInfo } from "../contracts";


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
        const address = req.body.address;
        const data = req.body.data;
        let reconstructed_json = `{"Time":"${data.Time}","ANALOG":{"Temperature1":${data.ANALOG.Temperature1.toFixed(1)}},"ENERGY":{"TotalStartTime":"${data.ENERGY.TotalStartTime}","Total":${data.ENERGY.Total.toFixed(3)},"Yesterday":${data.ENERGY.Yesterday.toFixed(3)},"Today":${data.ENERGY.Today.toFixed(3)},"Power":${data.ENERGY.Power},"ApparentPower":${data.ENERGY.ApparentPower},"ReactivePower":${data.ENERGY.ApparentPower},"Factor":${data.ENERGY.Factor.toFixed(2)},"Voltage":${data.ENERGY.Voltage},"Current":${data.ENERGY.Current.toFixed(3)}},"TempUnit":"C"}`
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
                    raw: reconstructed_json
                }
            })
            
            let data_cid = await generateCID(reconstructed_json);
            
            res.send("OK")
            await mintInfo(device.address,device.machineId,data_cid,"MH",data.Time,data.ENERGY.Total);

        }

    } catch (e: any) {
        console.log(e)
    }
}



export interface NotarizedData {
    Time: string,
    ANALOG: { Temperature1: Decimal },
    ENERGY: {
        TotalStartTime: string,
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
    TempUnit: string
}


export const verifyNotarizedData = async (req: Request, res: Response) => {

    try {

        const address = req.body.address?.toString();

        let data: NotarizedData = JSON.parse(req.body.data);
        let reconstructed_json = `{"Time":"${data.Time}","ANALOG":{"Temperature1":${data.ANALOG.Temperature1.toFixed(1)}},"ENERGY":{"TotalStartTime":"${data.ENERGY.TotalStartTime}","Total":${data.ENERGY.Total.toFixed(3)},"Yesterday":${data.ENERGY.Yesterday.toFixed(3)},"Today":${data.ENERGY.Today.toFixed(3)},"Power":${data.ENERGY.Power},"ApparentPower":${data.ENERGY.ApparentPower},"ReactivePower":${data.ENERGY.ApparentPower},"Factor":${data.ENERGY.Factor.toFixed(2)},"Voltage":${data.ENERGY.Voltage},"Current":${data.ENERGY.Current.toFixed(3)}},"TempUnit":"C"}`
        console.log(reconstructed_json)
        let data_cid = await generateCID(reconstructed_json);
        console.log(data_cid)
        let resp = await fetch(`https://testnet-api.rddl.io/planetmint/asset/address/${address}/3`, {
            method: "GET"
        })

        let js = await resp.json();
        
        let cids: string[] = js.cids;

        if (cids.indexOf(data_cid) !== -1) {
            res.send("true").status(200);
        } else {
            res.send("false").status(200);
        }

    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}