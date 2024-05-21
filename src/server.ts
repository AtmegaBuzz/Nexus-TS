import express, { Express, Request, Response } from "express";
import * as bodyParser from "body-parser";
import cors = require("cors");

import notarizeRouter from "./routes/notarize.router";
import deviceRouter from "./routes/device.route";
import authRouter from "./routes/auth.route";

const app: Express = express();
const PORT = 3001;

app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      console.log(buf.toString());
    },
  })
);
app.use(express.json());
app.use(cors());

// routes
app.use("/api/notarize", notarizeRouter);
app.use("/api/device", deviceRouter);
app.use("/api/auth", authRouter);


app.listen(PORT, () => {
  console.log(`Server running on port 3001`);
});
