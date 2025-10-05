import Queue from "queue";
import { ISuggestionsService, SuggestionModel } from "../../contract";

export class VoteBalancer implements ISuggestionsService {
  private queue: Queue = new Queue({ autostart: true, concurrency: 1 });

  constructor(private readonly wrappedService: ISuggestionsService) {}

  public getAll(): Promise<ReadonlyArray<SuggestionModel>> {
    console.log("getAll");
    return this.wrappedService.getAll();
  }

  public getOne(id: string): Promise<SuggestionModel | null> {
    console.log("getOne");
    return this.wrappedService.getOne(id);
  }

  public vote(id: string, clientIp: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.queue.push(async () => {
        const result = await this.wrappedService.vote(id, clientIp);
        resolve(result);
      });
    });
  }
  public getIpVotesNumber(clientIp: string): Promise<number> {
    return this.wrappedService.getIpVotesNumber(clientIp);
  }
}
