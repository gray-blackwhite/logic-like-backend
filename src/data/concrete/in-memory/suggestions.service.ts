import { demoData } from "../../../seed/demo-data";
import { ISuggestionsService, SuggestionModel } from "../../contract";

type SuggestionData = {
  id: string;
  name: string;
  description: string;
};

export class SuggestionService implements ISuggestionsService {
  private readonly _items: Map<string, SuggestionData> = new Map();
  private readonly _itemVotes: Map<string, Set<string>> = new Map();
  private readonly _ipVotes: Map<string, number> = new Map();

  constructor() {
    this.fillDemoData();
  }
  public async getIpVotesNumber(clientIp: string): Promise<number> {
    return this._ipVotes.get(clientIp) ?? 0;
  }

  public getAll(): Promise<ReadonlyArray<SuggestionModel>> {
    return this.withPromise(() => {
      const array = Array.from(this._items.values());
      return array.map(this.mapModel);
    });
  }

  public getOne(id: string): Promise<SuggestionModel | null> {
    return this.withPromise(() => {
      const item = this._items.get(id);
      if (!item) {
        return null;
      }

      return this.mapModel(item);
    });
  }

  public vote(id: string, clientIp: string): Promise<boolean> {
    return this.withPromise(() => {
      const item = this._items.get(id);
      if (!item) {
        return false;
      }

      const itemVotes = this._itemVotes.get(id);

      if (!itemVotes) {
        this._itemVotes.set(id, new Set([clientIp]));
      } else {
        itemVotes.add(clientIp);
      }

      this._ipVotes.set(clientIp, this.getIpVotes(clientIp) + 1);
      console.log(JSON.stringify(Array.from(this._ipVotes.entries()), null, 2));
      return true;
    });
  }

  private mapModel(model: SuggestionData): SuggestionModel {
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      votedIPs: this._itemVotes.get(model.id) || new Set(),
    };
  }

  private getIpVotes(clientIp: string): number {
    return this._ipVotes.get(clientIp) ?? 0;
  }

  private withPromise<T>(fn: () => T): Promise<T> {
    try {
      return Promise.resolve(fn());
    } catch (e) {
      return Promise.reject(e);
    }
  }

  private fillDemoData(): void {
    const items = demoData.map((item) => {
      return {
        ...item,
      };
    });

    items.forEach((item) => {
      this._items.set(item.id, item);
    });
  }
}
