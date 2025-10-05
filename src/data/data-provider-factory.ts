import { InMemoryDataProvider } from "./concrete/in-memory/in-memory-data-provider";
import { IDataProvider } from "./contract";
import { PgPrismaDataProvider } from "./concrete/pg-prisma/pg-prisma-data-provider";
import { config } from "../config";

export const dataProviderFactoryFn: () => IDataProvider = () => {
  return config.databaseUrl ? new PgPrismaDataProvider() : new InMemoryDataProvider();
};
