import * as core from "@actions/core";

import * as main from "../src/main";
import { CommandHandler } from "../src/commandHandler";

jest.mock("../src/commandHandler");

const mockCommandHandler = CommandHandler as jest.MockedClass<typeof CommandHandler>;

describe("main", () => {
  beforeEach(() => {
    mockCommandHandler.mockClear();

    process.env["INPUT_REPO-TOKEN"] = "abc";
    process.env["INPUT_COMMAND"] = "test";
    process.env["INPUT_REACTION"] = "true";
    process.env["INPUT_REACTION-TYPE"] = "eyes";
    process.env["INPUT_ALLOW-EDITS"] = "true";
    process.env["INPUT_PERMISSION-LEVEL"] = "write";
  });

  afterEach(() => {
    delete process.env["INPUT_REPO-TOKEN"];
    delete process.env["INPUT_COMMAND"];
    delete process.env["INPUT_REACTION"];
    delete process.env["INPUT_REACTION-TYPE"];
    delete process.env["INPUT_ALLOW-EDITS"];
    delete process.env["INPUT_PERMISSION-LEVEL"];
  });

  it("throws if repo-token isn't provided", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");

    delete process.env["INPUT_REPO-TOKEN"];

    await main.run();

    expect(setFailedSpy).toHaveBeenCalledWith("Input required and not supplied: repo-token");
  });

  it("throws if command isn't provided", async () => {
    const setFailedSpy = jest.spyOn(core, "setFailed");

    delete process.env["INPUT_COMMAND"];

    await main.run();

    expect(setFailedSpy).toHaveBeenCalledWith("Input required and not supplied: command");
  });

  it("calls 'process'", async () => {
    await main.run();

    const mockCommandHandledInstance = mockCommandHandler.mock.instances[0];

    expect(mockCommandHandler).toHaveBeenCalled();
    expect(mockCommandHandler).toHaveBeenCalledWith("abc", "test", true, "eyes", true, "write");

    expect(mockCommandHandledInstance.process).toHaveBeenCalledTimes(1);
  });
});
