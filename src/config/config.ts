import dotenv from "dotenv";
import { AppConfig } from "./app-config";

dotenv.config();

export const config: AppConfig = {
  port: Number(process.env.PORT) || 3000,
  voteLimit: Number(process.env.VOTE_LIMIT) || 10,
  host: String(process.env.HOST) || "0.0.0.0",
  nodeEnv: process.env.NODE_ENV || "development",
};
