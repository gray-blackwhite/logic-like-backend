import { config } from "../config";
import { IDataProvider } from "./contract";
import { InMemoryDataProvider } from "./implementations/in-memory/in-memory-data-provider";

export const dataProviderFactoryFn: () => IDataProvider = () => {
  return new InMemoryDataProvider({
    voteLimit: config.voteLimit,
  });
};
