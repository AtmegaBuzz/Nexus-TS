import express, {Express, Request, Response} from "express";
import * as bodyParser from "body-parser";
import cors = require("cors");

import notarizeRouter from "./routes/notarize.router";

const app: Express = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

// routes
app.use("/api/notarize", notarizeRouter);



app.listen(PORT,()=>{
    console.log(`Server running on port 3001`);
})