import { Command } from "../src/command";

describe("command", () => {
  let command: Command;

  beforeEach(() => {
    command = new Command("test");
  });

  it("sets the command name", () => {
    expect(command.name).toEqual("test");
  });

  describe("checkComment", () => {
    it("handles an undefined comment", () => {
      const results = command.checkComment();

      expect(results).toEqual(undefined);
    });

    it("matches a command without arguments", () => {
      const results = command.checkComment("/test");

      expect(results).toEqual({ name: "test" });
    });

    it("matches a command with single argument", () => {
      const results = command.checkComment("/test now");

      expect(results).toEqual({ name: "test", arguments: "now" });
    });

    it("matches a command with trailing whitespace", () => {
      const results = command.checkComment("/test    ");

      expect(results).toEqual({ name: "test" });
    });

    it("matches a command with multiple argument", () => {
      const results = command.checkComment("/test right now");

      expect(results).toEqual({ name: "test", arguments: "right now" });
    });

    it("matches a command in multi-line comment", () => {
      const results = command.checkComment(`
line of text 1
line of text 2
/test this
line of text 3"`);

      expect(results).toEqual({ name: "test", arguments: "this" });
    });
  });
});
