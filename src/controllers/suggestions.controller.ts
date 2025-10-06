import { NextFunction, Request, Response, Router } from "express";
import { applicationService } from "../domain/services";

const appService = applicationService();

const withCatch: (fn: () => Promise<void>, next: NextFunction) => Promise<void> = async (fn, next) => {
  try {
    return await fn();
  } catch (e) {
    next(e);
  }
};

const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await withCatch(async () => {
    const result = await appService.getAll(req.clientIp);
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

    const result = await appService.getOne(id, req.clientIp);
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

    const voteResult = await appService.vote(id, req.clientIp);
    if (!voteResult) {
      res.status(409).send("Unable to vote right now").end();
      return;
    }

    res.json(voteResult).end();
  }, next);
};

export const suggestionsController = Router();
suggestionsController.get("/", getAll);
suggestionsController.get("/:id", getOne);
suggestionsController.get("/vote/:id", vote);
