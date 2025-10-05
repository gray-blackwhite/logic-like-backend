import express from "express";
import http from "http";
import { AddressInfo } from "net";
import { config } from "./config";
import { suggestionsController } from "./controllers";
import { getIP } from "./middleware";

const app = express();
app.use(getIP);
app.use(express.json());
app.use("/api/suggestions", suggestionsController);

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
