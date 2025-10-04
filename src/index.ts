import express from "express";
import http from "http";
import { AddressInfo } from "net";
import { config } from "./config";
import suggestionsRouter from "./controllers/suggestions/controller";
import getIP from "./middleware/get-ip";

const app = express();
app.use(getIP);
app.use(express.json());
app.use("/api/suggestions", suggestionsRouter);

const server = http.createServer(app);
server.listen(
  {
    port: config.port,
    host: config.host,
  },
  () => {
    const address = server.address() as AddressInfo;
    console.log(`Server running at ${address.address}:${address.port}`);
  },
);
