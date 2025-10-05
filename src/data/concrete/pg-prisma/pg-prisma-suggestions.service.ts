import { PrismaClient } from "@prisma/client";
import { ISuggestionsService, SuggestionModel } from "../../contract";

export type ItemQueryResult = {
  id: string;
  name: string;
  description: string;
  votes: {
    value: string;
  }[];
};

export class PgPrismaSuggestionsService implements ISuggestionsService {
  constructor(private readonly client: PrismaClient) {}

  public async getAll(): Promise<ReadonlyArray<SuggestionModel>> {
    const items = (await this.client.suggestion.findMany({
      select: {
        id: true,
        description: true,
        name: true,
        votes: {
          select: {
            value: true,
          },
        },
      },
      orderBy: {
        votes: {
          _count: "desc",
        },
      },
    })) satisfies ItemQueryResult[];

    return items.map(this.mapModel);
  }

  public async getOne(id: string): Promise<SuggestionModel | null> {
    const item = (await this.client.suggestion.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        description: true,
        name: true,
        votes: {
          select: {
            value: true,
          },
        },
      },
    })) satisfies ItemQueryResult | null;

    return item ? this.mapModel(item) : null;
  }

  public async vote(id: string, clientIp: string): Promise<boolean> {
    const existingItem = await this.client.suggestion.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingItem) {
      return false;
    }

    const existingIP = await this.client.iP.findUnique({
      where: {
        value: clientIp,
      },
      select: {
        value: true,
        votes: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingIP) {
      await this.client.iP.create({
        data: {
          value: clientIp,
          votes: {
            connect: {
              id: id,
            },
          },
        },
      });

      return true;
    }

    if (existingIP?.votes.some((v) => v.id === id)) {
      return false;
    }

    await this.client.iP.update({
      where: {
        value: clientIp,
      },
      data: {
        votes: {
          connect: {
            id: id,
          },
        },
      },
    });

    return true;
  }

  public async getIpVotesNumber(clientIp: string): Promise<number> {
    const item = await this.client.iP.findUnique({
      where: {
        value: clientIp,
      },
      select: {
        _count: {
          select: {
            votes: true,
          },
        },
      },
    });

    return item ? item._count.votes : 0;
  }

  private mapModel(item: ItemQueryResult): SuggestionModel {
    return {
      id: item.id,
      description: item.description,
      name: item.name,
      votedIPs: new Set(item.votes.map((v) => v.value)),
    };
  }
}
