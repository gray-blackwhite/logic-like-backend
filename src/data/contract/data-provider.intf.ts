import { ISuggestionsService } from "./suggestions/suggestions-service.intf";

export interface IDataProvider {
  readonly suggestions: ISuggestionsService;
}
