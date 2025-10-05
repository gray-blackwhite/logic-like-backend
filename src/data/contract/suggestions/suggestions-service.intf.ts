import { SuggestionModel } from "./models/suggestion.model";

export interface ISuggestionsService {
  getAll(): Promise<ReadonlyArray<SuggestionModel>>;
  getOne(id: string): Promise<SuggestionModel | null>;
  vote(id: string, clientIp: string): Promise<boolean>;
  getIpVotesNumber(clientIp: string): Promise<number>;
}
