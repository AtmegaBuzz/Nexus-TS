import {Request, Response} from "express"



export const offchainNotarization = async (req: Request, res: Response) => {

    try {

        console.log(req.body)
        res.send("OK")

    } catch (e: any) {
        console.log(e)
    }
}