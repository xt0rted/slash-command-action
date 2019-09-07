export type reactionValue =
  | "+1"
  | "-1"
  | "laugh"
  | "confused"
  | "heart"
  | "hooray"
  | "rocket"
  | "eyes";

export const reactionTypes = [
  "+1",
  "-1",
  "laugh",
  "confused",
  "heart",
  "hooray",
  "rocket",
  "eyes",
];

export class Reaction {
  private _type: reactionValue;

  constructor(type: string) {
    this._type = this.sanitize(type);
  }

  get type() : reactionValue {
    return this._type;
  }

  private sanitize(name: string): reactionValue {
    if (reactionTypes.includes(name)) {
      return name as reactionValue;
    }

    return "+1";
  }
}
