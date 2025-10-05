import { IApplicationService } from "./contract/application-service.intf";
import { ApplicationServiceOptions } from "./concrete/application-service-options";
import { ApplicationService } from "./concrete/application.service";
import { config } from "../../config";
import { dataProviderFactoryFn } from "../../data";

let instance: IApplicationService | null = null;

export const applicationService: () => IApplicationService = () => {
  if (instance) {
    return instance;
  }

  const dataProvider = dataProviderFactoryFn();
  const options: ApplicationServiceOptions = {
    voteLimit: config.voteLimit,
  };

  instance = new ApplicationService(options, dataProvider);
  return instance;
};
