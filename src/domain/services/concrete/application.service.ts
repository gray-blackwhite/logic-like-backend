import { IApplicationService } from "../contract/application-service.intf";
import { ApplicationServiceOptions } from "./application-service-options";
import { Suggestion } from "../contract/models/suggestion";
import { IDataProvider, SuggestionModel } from "../../../data";

export class ApplicationService implements IApplicationService {
  constructor(
    private readonly options: ApplicationServiceOptions,
    private readonly dataProvider: IDataProvider,
  ) {}

  public async getAll(clientIp: string): Promise<ReadonlyArray<Suggestion>> {
    const items = await this.dataProvider.suggestions.getAll();
    return items.map((item) => this.mapModel(item, clientIp));
  }

  public async getOne(id: string, clientIp: string): Promise<Suggestion | null> {
    const item = await this.dataProvider.suggestions.getOne(id);
    return item ? this.mapModel(item, clientIp) : null;
  }

  public async vote(id: string, clientIp: string): Promise<Suggestion | null> {
    const item = await this.dataProvider.suggestions.getOne(id);
    if (!item) {
      return null;
    }

    if (item.votedIPs.has(clientIp)) {
      return null;
    }

    const ipVotes = await this.dataProvider.suggestions.getIpVotesNumber(clientIp);
    if (ipVotes >= this.options.voteLimit) {
      return null;
    }

    const voteResult = await this.dataProvider.suggestions.vote(id, clientIp);
    if (!voteResult) {
      return null;
    }

    const updatedItem = await this.dataProvider.suggestions.getOne(id);
    return updatedItem ? this.mapModel(updatedItem, clientIp) : null;
  }

  private mapModel(model: SuggestionModel, clientIp: string): Suggestion {
    return {
      id: model.id,
      description: model.description,
      name: model.name,
      voted: model.votedIPs.has(clientIp),
      votes: model.votedIPs.size,
    };
  }
}
