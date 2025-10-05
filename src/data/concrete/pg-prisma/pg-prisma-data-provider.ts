import { PgPrismaSuggestionsService } from "./pg-prisma-suggestions.service";
import { VoteBalancer } from "./vote-balancer.service";
import { BaseDataProvider, ISuggestionsService } from "../../contract";
import { PrismaClient } from "@prisma/client";

export class PgPrismaDataProvider extends BaseDataProvider {
  private _client: PrismaClient | null = null;

  protected createSuggestionsServiceOverride(): ISuggestionsService {
    return new VoteBalancer(new PgPrismaSuggestionsService(this.getClient()));
  }

  private getClient(): PrismaClient {
    return this._client || (this._client = new PrismaClient());
  }
}
