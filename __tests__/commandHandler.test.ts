import { join } from "path";

import nock from "nock";

import * as core from "@actions/core";
jest.mock("@actions/core", () => {
  return {
    debug: jest.fn(),
    setFailed: jest.fn(),
    setOutput: jest.fn(),
  };
});

import { context } from "@actions/github";

import { CommandHandler } from "../src/commandHandler";

describe("commandHandler", () => {
  beforeEach(() => {
    context.action = "run1";
    context.actor = "test-user";
    context.eventName = "issue_comment";
    context.ref = "refs/heads/main";
    context.sha = "cb2fd97b6eae9f2c7fee79d5a86eb9c3b4ac80d8";
    context.workflow = "Issue comments";
  });

  describe("process", () => {
    it("should return false when incorrect action", async () => {
      context.payload = require(join(__dirname, "payloads", "edited.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "read",
      );

      await expect(commandHandler.process()).resolves.toBe(false);
    });

    it("should return false when no slash command in comment", async () => {
      context.payload = require(join(__dirname, "payloads", "created-no-command.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "read",
      );

      await expect(commandHandler.process()).resolves.toBe(false);
    });

    it("should return false when incorrect slash command", async () => {
      context.payload = require(join(__dirname, "payloads", "created.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "read",
      );

      await expect(commandHandler.process()).resolves.toBe(false);
    });

    it("should return false when correct slash command but incorrect repo access", async () => {
      const mockedSetOutput = core.setOutput as jest.Mock<typeof core.setOutput>;

      context.payload = require(join(__dirname, "payloads", "created.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "test",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "write",
      );

      const scoped = nock("https://api.github.com")
        .get("/repos/xt0rted/slash-command-action/collaborators/test-user/permission")
        .reply(200, { permission: "read" });

      await expect(commandHandler.process()).resolves.toBe(false);

      expect(scoped.isDone()).toBe(true);
    });

    it("should return true and not create reaction when correct slash command and repo access", async () => {
      context.payload = require(join(__dirname, "payloads", "created.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "test",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "write",
      );

      const permissionScope = nock("https://api.github.com")
        .get("/repos/xt0rted/slash-command-action/collaborators/test-user/permission")
        .reply(200, { permission: "write" });

      const reactionScope = nock("https://api.github.com")
        .post("/repos/xt0rted/slash-command-action/issues/comments/123/reactions", { content: "+1" })
        .reply(201);

      await expect(commandHandler.process()).resolves.toBe(true);

      expect(permissionScope.isDone()).toBe(true);
      expect(reactionScope.isDone()).toBe(false);
    });

    it("should return true & create reaction when correct slash command and repo access", async () => {
      context.payload = require(join(__dirname, "payloads", "created.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "test",
        /* addReaction */ true,
        /* reactionType */ "eyes",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "write",
      );

      const permissionScope = nock("https://api.github.com")
        .get("/repos/xt0rted/slash-command-action/collaborators/test-user/permission")
        .reply(200, { permission: "write" });

      const reactionScope = nock("https://api.github.com")
        .post("/repos/xt0rted/slash-command-action/issues/comments/123/reactions", { content: "eyes" })
        .reply(201);

      await expect(commandHandler.process()).resolves.toBe(true);

      expect(permissionScope.isDone()).toBe(true);
      expect(reactionScope.isDone()).toBe(true);
    });

    it("should set command details as out params", async () => {
      const mockedSetOutput = core.setOutput as jest.Mock<typeof core.setOutput>;

      context.payload = require(join(__dirname, "payloads", "created.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "test",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "write",
      );

      const scoped = nock("https://api.github.com")
        .get("/repos/xt0rted/slash-command-action/collaborators/test-user/permission")
        .reply(200, { permission: "write" });

      await expect(commandHandler.process()).resolves.toBe(true);

      expect(scoped.isDone()).toBe(true);

      expect(mockedSetOutput).toHaveBeenNthCalledWith(1, "command-name", "test");
      expect(mockedSetOutput).toHaveBeenNthCalledWith(2, "command-arguments", "this out");
    });
  });

  describe("shouldRunForAction", () => {
    it("returns 'true' when action is 'created'", () => {
      context.payload = require(join(__dirname, "payloads", "created.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "read",
      );

      expect(commandHandler.shouldRunForAction()).toBe(true);
    });

    it("returns 'true' when action is 'edited' and allowEdits is 'true'", () => {
      context.payload = require(join(__dirname, "payloads", "edited.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ true,
        /* requiredPermissionLevel */ "read",
      );

      expect(commandHandler.shouldRunForAction()).toBe(true);
    });

    it("returns 'false' when action is 'edited' and allowEdits is 'false'", () => {
      context.payload = require(join(__dirname, "payloads", "edited.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "read",
      );

      expect(commandHandler.shouldRunForAction()).toBe(false);
    });

    it("returns 'false' when action is 'deleted'", () => {
      context.payload = require(join(__dirname, "payloads", "deleted.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "read",
      );

      expect(commandHandler.shouldRunForAction()).toBe(false);
    });

    it("returns 'false' when action is unknown", () => {
      context.payload = require(join(__dirname, "payloads", "modified.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "read",
      );

      expect(commandHandler.shouldRunForAction()).toBe(false);
    });
  });

  describe("permissionLevel", () => {
    it("gets permission from api for actor user", async () => {
      context.payload = require(join(__dirname, "payloads", "created.json"));

      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ false,
        /* reactionType */ "+1",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "read",
      );

      const scoped = nock("https://api.github.com")
        .get("/repos/xt0rted/slash-command-action/collaborators/test-user/permission")
        .reply(200, { permission: "admin" });

      const result = await commandHandler.permissionLevel();

      expect(scoped.isDone()).toBe(true);
      expect(result).toBe("admin");
    });
  });

  describe("createReaction", () => {
    beforeEach(() => {
      context.payload = require(join(__dirname, "payloads", "created.json"));
    });

    it("skips reaction if disabled", async () => {
      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ false,
        /* reactionType */ "eyes",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "write",
      );

      await expect(commandHandler.createReaction(123)).resolves.toBe(false);
    });

    it("creates reaction if enabled", async () => {
      const commandHandler = new CommandHandler(
        /* repoToken */ "-token-",
        /* commandName */ "format",
        /* addReaction */ true,
        /* reactionType */ "eyes",
        /* allowEdits */ false,
        /* requiredPermissionLevel */ "write",
      );

      const scoped = nock("https://api.github.com")
        .post("/repos/xt0rted/slash-command-action/issues/comments/123/reactions", { content: "eyes" })
        .reply(201);

      await expect(commandHandler.createReaction(123)).resolves.toBe(true);

      expect(scoped.isDone()).toBe(true);
    });
  });
});
