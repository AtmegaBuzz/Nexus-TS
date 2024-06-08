import { Request, Response } from "express"
import { prisma } from "../Prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { generateCID } from "../utils";
import { safeMint } from "../contracts";


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


export async function checkNewDevice(req: Request, res: Response) {

    
    // check user auth     
    let user = await prisma.user.findFirst({
        where: {
            machineAuthToken: req.header('Authorization')
        }
    })

    console.log(user, "====")
    
    if (user === null) {
        return res.status(400).send("User doen't exist")
    }

    const address = req.body.address;
    const meter_phase = req.body.meter

    if (address === undefined || address === null) {
        return res.status(400).send("address is required")
    }

    const device = await prisma.device.findFirst({
        where: {
            address: address,
        }
    })

    if (device !== null) {
        return ""
    }

    let resp = await fetch("https://testnet-api.rddl.io/planetmint/machine/address/" + address, {
        method: "GET"
    })

    if (resp.status !== 200) {
        return res.status(resp.status).send("Device Doesn't exists")
    }

    let js = await resp.json();

    const gps = JSON.parse(js.machine.metadata.gps)
    const device_info = JSON.parse(js.machine.metadata.device)

    console.log(gps,device_info)

    await prisma.device.create({
        data: {
            address: address,
            machineId: js.machine.machineId,
            userId: user.id,
            country: gps.Country,
            region: gps.Region,
            city: gps.City,
            meter_phase: meter_phase,
            category: device_info.Category,
            manufacturer: device_info.Manufacturer
        }
    })


    return ""


}


export const offchainNotarization = async (req: Request, res: Response) => {

    try {

        let reslt = await checkNewDevice(req, res);

        if (typeof(reslt) !== typeof("")) {
            return reslt
        }

        const address = req.body.address;
        const data = JSON.parse(req.body.data);


        const device = await prisma.device.findFirst({
            where: {
                address: address
            }
        })
        if (device === null) {
            res.send("DEVICE DOESN'T EXISTS")
        }
        
        else {
            
            let user = await prisma.user.findFirst({
                where: {
                    id: device.userId
                }
            })
            
            let reconstructed_json = "";

            if (req.body["meter"] === "elite") {
                

                reconstructed_json = req.body.data
                await prisma.notarizedData.create({
                    data: {
                        deviceId: device?.id!,
                        time: new Date(),
                        voltage_phase_1: data.voltage.voltage_phase_1,
                        voltage_phase_2: data.voltage.voltage_phase_2,
                        voltage_phase_3: data.voltage.voltage_phase_3,
                        voltage_phase_avg: data.voltage.voltage_phase_avg,

                        current_phase_1: data.current.current_phase_1,
                        current_phase_2: data.current.current_phase_2,
                        current_phase_3: data.current.current_phase_3,
                        current_phase_avg: data.current.current_phase_avg,

                        power_factor_phase_1: data.power_factor.power_factor_phase_1,
                        power_factor_phase_2: data.power_factor.power_factor_phase_2,
                        power_factor_phase_3: data.power_factor.power_factor_phase_3,
                        power_factor_phase_avg: data.power_factor.power_factor_phase_avg,

                        active_power_phase_1: data.active_power.active_power_phase_1,
                        active_power_phase_2: data.active_power.active_power_phase_2,
                        active_power_phase_3: data.active_power.active_power_phase_3,
                        active_power_phase_avg: data.active_power.active_power_phase_avg,

                        apparent_power_phase_1: data.apparent_power.apparent_power_phase_1,
                        apparent_power_phase_2: data.apparent_power.apparent_power_phase_2,
                        apparent_power_phase_3: data.apparent_power.apparent_power_phase_3,
                        apparent_power_phase_avg: data.apparent_power.apparent_power_phase_avg,

                        raw: reconstructed_json
                    }
                })
            }

            else {
                reconstructed_json = `{"Time":"${data.Time}","ENERGY":{"TotalStartTime":"${data.ENERGY.TotalStartTime}","Total":${data.ENERGY.Total.toFixed(3)},"Yesterday":${data.ENERGY.Yesterday.toFixed(3)},"Today":${data.ENERGY.Today.toFixed(3)},"Power":${data.ENERGY.Power},"ApparentPower":${data.ENERGY.ApparentPower},"ReactivePower":${data.ENERGY.ReactivePower},"Factor":${data.ENERGY.Factor.toFixed(2)},"Voltage":${data.ENERGY.Voltage},"Current":${data.ENERGY.Current.toFixed(3)}}}`
                await prisma.notarizedData.create({
                    data: {
                        deviceId: device?.id!,
                        time: new Date(data.Time.toString()),
                        temprature: "0",
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
            }
            let data_cid = await generateCID(reconstructed_json);
            console.log(data_cid)

            res.send("OK")

            if (typeof user?.publicKey === 'string' && device.meter_phase !== "elite") {
                await safeMint(user?.publicKey,device.address, device.machineId, data_cid, "MH", data.Time, data.ENERGY.Total);
            } else {
                console.log("no pub key")
            }

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

        // let reconstructed_json = `{"Time":"${data.Time}","ENERGY":{"TotalStartTime":"${data.ENERGY.TotalStartTime}","Total":${data.ENERGY.Total.toFixed(3)},"Yesterday":${data.ENERGY.Yesterday.toFixed(3)},"Today":${data.ENERGY.Today.toFixed(3)},"Power":${data.ENERGY.Power},"ApparentPower":${data.ENERGY.ApparentPower},"ReactivePower":${data.ENERGY.ReactivePower},"Factor":${data.ENERGY.Factor.toFixed(2)},"Voltage":${data.ENERGY.Voltage},"Current":${data.ENERGY.Current.toFixed(3)}}}`
        console.log(req.body.data)

        let data_cid = await generateCID(req.body.data);
        console.log(data_cid)

        let resp = await fetch(`https://testnet-api.rddl.io/planetmint/asset/cid/${data_cid}`, {
            method: "GET"
        })

        if (resp.status === 200) {
            res.send("true").status(200);
        } else {
            res.send("false").status(200);
        }

        // let resp = await fetch(`https://testnet-api.rddl.io/planetmint/asset/address/${address}/3`, {
        //     method: "GET"
        // })

        // let js = await resp.json();

        // if (typeof js.cids === undefined) {
        //     return;
        // }
        
        // console.log(resp.status)
        // let cids: string[] = js.cids;


        // if (cids.indexOf(data_cid) !== -1) {
        //     res.send("true").status(200);
        // } else {
        //     res.send("false").status(200);
        // }

    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}



export const cidExists = async (req: Request, res: Response) => {

    try {

        let resp = await fetch(`https://testnet-api.rddl.io/planetmint/asset/cid/${req.query.cid}`, {
            method: "GET"
        })
        console.log(resp.status)
        if (resp.status === 200) {
            res.send("true").status(200);
        } else {
            res.send("false").status(404);
        }

    } catch (e: any) {
        console.log(e)
        res.send("Something went wrong").status(500)
    }
}