export type SuggestionModel = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly votedIPs: Set<string>;
};
