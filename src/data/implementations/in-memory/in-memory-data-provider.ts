import { BaseDataProvider, ISuggestionsService } from "../../contract";
import { SuggestionOptions } from "../suggestion-options";
import { SuggestionService } from "./suggestions.service";

export class InMemoryDataProvider extends BaseDataProvider {
  constructor(private readonly suggestionOptions: SuggestionOptions) {
    super();
  }

  protected createSuggestionsServiceOverride(): ISuggestionsService {
    return new SuggestionService(this.suggestionOptions.voteLimit);
  }
}
