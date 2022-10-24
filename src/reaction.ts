const reactionTypes = [
  "+1",
  "-1",
  "laugh",
  "confused",
  "heart",
  "hooray",
  "rocket",
  "eyes",
] as const;

export type reactionValue = typeof reactionTypes[number];

export class Reaction {
  private _type: reactionValue;

  constructor(type: string) {
    this._type = this.sanitize(type);
  }

  get type() : reactionValue {
    return this._type;
  }

  private sanitize(name: string): reactionValue {
    if (reactionTypes.includes(name as any)) {
      return name as reactionValue;
    }

    return "+1";
  }
}
