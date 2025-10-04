import { demoData } from "../../../demo/demo-data";
import { ISuggestionsService, Suggestion } from "../../contract";

type StoreSuggestion = Omit<Suggestion, "votes" | "voted">;

export class SuggestionService implements ISuggestionsService {
  private readonly _items: Map<string, StoreSuggestion> = new Map();
  private readonly _itemVotes: Map<string, Set<string>> = new Map();
  private readonly _ipVotes: Map<string, number> = new Map();

  constructor(private readonly voteLimit: number) {
    this.fillDemoData();
  }

  public getAll(clientIp: string): Promise<ReadonlyArray<Suggestion>> {
    return this.withPromise(() => {
      const array = Array.from(this._items.values());
      return array.map((item) => ({
        ...item,
        votes: this.computeItemVotes(item.id),
        voted: this._itemVotes.get(item.id)?.has(clientIp) ?? false,
      }));
    });
  }

  public getOne(id: string, clientIp: string): Promise<Suggestion | null> {
    return this.withPromise(() => {
      const item = this._items.get(id);

      return item
        ? {
            ...item,
            votes: this.computeItemVotes(item.id),
            voted: this._itemVotes.get(item.id)?.has(clientIp) ?? false,
          }
        : null;
    });
  }

  public vote(id: string, clientIp: string): Promise<boolean> {
    return this.withPromise(() => {
      const item = this._items.get(id);
      if (!item) {
        return false;
      }

      const totalVotes = this.computeIpVotes(clientIp);
      console.log(totalVotes);
      if (totalVotes >= this.voteLimit) {
        return false;
      }

      const itemVotes = this._itemVotes.get(id);

      if (!itemVotes) {
        this._itemVotes.set(id, new Set([clientIp]));
      } else {
        if (itemVotes.has(clientIp)) {
          return false;
        } else {
          itemVotes.add(clientIp);
        }
      }

      this._ipVotes.set(clientIp, totalVotes + 1);

      console.log(JSON.stringify(Array.from(this._ipVotes.entries()), null, 2));

      return true;
    });
  }

  private computeItemVotes(id: string): number {
    return this._itemVotes.get(id)?.size ?? 0;
  }

  private computeIpVotes(clientIp: string): number {
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
