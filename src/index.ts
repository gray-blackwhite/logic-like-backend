import express from "express";
import http from "http";
import { AddressInfo } from "net";
import { config } from "./config";
import { suggestionsController } from "./controllers";
import { cors, getFakeIP, getIP } from "./middleware";
import { errorHandler } from "./middleware/error-handler";

const app = express();
app.use(cors());
app.use(getIP);
// app.use(getFakeIP);
app.use(express.json());

app.use("/api/suggestions", suggestionsController);

app.use(errorHandler);

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
