import * as main from "../src/main";
import { CommandHandler } from "../src/commandHandler";
import * as core  from "@actions/core";

jest.mock("../src/commandHandler");

const mockCommandHandler = CommandHandler as jest.MockedClass<typeof CommandHandler>;

describe("main", () => {
  beforeEach(() => {
    mockCommandHandler.mockClear();

    jest.spyOn(core, "setOutput");

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
    delete process.env["INPUT_REPO-TOKEN"];

    await expect(main.run()).rejects.toThrow('repo-token');
  });

  it("throws if command isn't provided", async () => {
    delete process.env["INPUT_COMMAND"];

    await expect(main.run()).rejects.toThrow('command');
  });

  it("calls 'process' and sets output", async () => {
    const mockedSetOutput = core.setOutput as jest.Mock<typeof core.setOutput>;

    const mockProcess = jest.fn().mockResolvedValue(true);
    mockCommandHandler.prototype.process = mockProcess;

    await main.run();

    expect(mockCommandHandler).toHaveBeenCalled();
    expect(mockCommandHandler).toHaveBeenCalledWith("abc", "test", true, "eyes", true, "write");

    expect(mockProcess).toHaveBeenCalledTimes(1);
    expect(mockProcess).toReturnWith(Promise.resolve(true));

    expect(mockedSetOutput).toHaveBeenCalledWith("has-command", "true");
  });
});
