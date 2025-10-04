import { NextFunction, Request, Response, Router } from "express";
import { dataProvider } from "../../data/data-provider";

const { suggestions } = dataProvider;

const withCatch: (fn: () => Promise<void>, next: NextFunction) => Promise<void> = async (fn, next) => {
  try {
    return await fn();
  } catch (e) {
    next(e);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await withCatch(async () => {
    const result = await suggestions.getAll(req.clientIp);
    res.json(result).end();
  }, next);
};

const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return withCatch(async () => {
    const id = req.params.id;
    if (!id) {
      res.status(400).send("Invalid id").end();
      return;
    }

    const result = await suggestions.getOne(id, req.clientIp);
    if (result === null) {
      res.status(404).send(`Suggestion with id ${id} not found`).end();
      return;
    }

    res.json(result).end();
  }, next);
};

const vote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  return withCatch(async () => {
    const id = req.params.id;
    if (!id) {
      res.status(400).send("Invalid id").end();
      return;
    }

    const voteResult = await suggestions.vote(id, req.clientIp);
    if (!voteResult) {
      res.status(409).send("Conflict").end();
      return;
    }

    const result = await suggestions.getOne(id, req.clientIp);
    if (result === null) {
      res.status(404).send(`Suggestion with id ${id} not found`).end();
      return;
    }

    res.json(result).end();
  }, next);
};

const suggestionsRouter = Router();
suggestionsRouter.get("/", getAll);
suggestionsRouter.get("/:id", getOne);
suggestionsRouter.get("/vote/:id", vote);

export default suggestionsRouter;
