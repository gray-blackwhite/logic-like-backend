import { Suggestion } from "./models/suggestion";

export interface IApplicationService {
  getAll(clientIp: string): Promise<ReadonlyArray<Suggestion>>;
  getOne(id: string, clientIp: string): Promise<Suggestion | null>;
  vote(id: string, clientIp: string): Promise<Suggestion | null>;
}
