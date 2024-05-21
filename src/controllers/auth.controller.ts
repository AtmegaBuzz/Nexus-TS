import { Request, Response } from "express"
import { prisma } from "../Prisma";


export const login = async (req: Request, res: Response) => {

    try {

        const address = req.query.address;

        let resp = await fetch("https://testnet-api.rddl.io/planetmint/asset/address/plmnt1sqlv2x8rjvxdjv87uh5l47erpazx8umwhd7t90/3", {
            method: "GET"
        })

        let js = await resp.json();

        console.log(js)

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