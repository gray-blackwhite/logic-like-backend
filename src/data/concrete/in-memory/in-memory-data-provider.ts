import { BaseDataProvider, ISuggestionsService } from "../../contract";
import { SuggestionService } from "./suggestions.service";

export class InMemoryDataProvider extends BaseDataProvider {
  protected createSuggestionsServiceOverride(): ISuggestionsService {
    return new SuggestionService();
  }
}
