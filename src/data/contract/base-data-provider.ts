import { IDataProvider } from "./data-provider.intf";
import { ISuggestionsService } from "./suggestions/suggestions-service.intf";

export abstract class BaseDataProvider implements IDataProvider {
  private _suggestions: ISuggestionsService | null = null;

  public get suggestions(): ISuggestionsService {
    return this._suggestions || (this._suggestions = this.createSuggestionsService());
  }

  protected abstract createSuggestionsServiceOverride(): ISuggestionsService;

  private createSuggestionsService(): ISuggestionsService {
    return this.createSuggestionsServiceOverride();
  }
}
