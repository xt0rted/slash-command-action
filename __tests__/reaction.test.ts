import { Reaction } from "../src/reaction";

describe("reaction", () => {
  it("defaults to +1", () => {
    const reaction = new Reaction("no");

    expect(reaction.type).toEqual("+1");
  });

  it("allows +1", () => {
    const reaction = new Reaction("+1");

    expect(reaction.type).toEqual("+1");
  });

  it("allows -1", () => {
    const reaction = new Reaction("-1");

    expect(reaction.type).toEqual("-1");
  });

  it("allows laugh", () => {
    const reaction = new Reaction("laugh");

    expect(reaction.type).toEqual("laugh");
  });

  it("allows confused", () => {
    const reaction = new Reaction("confused");

    expect(reaction.type).toEqual("confused");
  });

  it("allows heart", () => {
    const reaction = new Reaction("heart");

    expect(reaction.type).toEqual("heart");
  });

  it("allows hooray", () => {
    const reaction = new Reaction("hooray");

    expect(reaction.type).toEqual("hooray");
  });

  it("allows rocket", () => {
    const reaction = new Reaction("rocket");

    expect(reaction.type).toEqual("rocket");
  });

  it("allows eyes", () => {
    const reaction = new Reaction("eyes");

    expect(reaction.type).toEqual("eyes");
  });
});
