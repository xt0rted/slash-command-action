import {
  debug,
  setFailed,
  setOutput,
} from "@actions/core";
import {
  context,
  getOctokit,
} from "@actions/github";

import { Command } from "./command";
import { Reaction } from "./reaction";
import { checkPermission } from "./permission";

import type { GitHub } from "@actions/github/lib/utils";

import type { PermissionLevel, CommentEvent } from "./interfaces";

export class CommandHandler {
  private readonly command: Command;
  private readonly reaction: Reaction;
  private readonly client: InstanceType<typeof GitHub>;

  constructor(
    repoToken: string,
    commandName: string,
    private readonly addReaction: boolean,
    reactionType: string,
    private readonly allowEdits: boolean,
    private readonly requiredPermissionLevel: PermissionLevel,
  ) {
    this.command = new Command(commandName);
    this.reaction = new Reaction(reactionType);
    this.client = getOctokit(repoToken);
  }

  public async process(): Promise<boolean> {
    debug("Checking if step should run on this event action");

    if (!this.shouldRunForAction()) {
      return false;
    }

    debug("Getting the comment and checking it for a command");

    const comment = context.payload.comment as CommentEvent;
    const commandResults = this.command.checkComment(comment.body);

    if (!commandResults) {
      setFailed("Comment didn't contain a valid slash command");

      return false;
    }

    debug("Passing the command details along for any other actions to use");

    setOutput("command-name", commandResults.name);
    setOutput("command-arguments", commandResults.arguments as string);

    debug("Checking if user has the required access to the repo for this command");

    const actorPermissionLevel = await this.permissionLevel();

    if (!checkPermission(this.requiredPermissionLevel, actorPermissionLevel)) {
      setFailed("User doesn't have enough access to the repo");

      return false;
    }

    debug("Adding a reaction to the comment if enabled");

    await this.createReaction(comment.id);

    debug("Command passed, able to execute job");

    return true;
  }

  public shouldRunForAction(): boolean {
    if (context.payload.action === "created") {
      debug("Comment was created");

      return true;
    }

    if (context.payload.action === "edited") {
      if (this.allowEdits) {
        debug("Comment was edited and allow edits is enabled");

        return true;
      }

      setFailed("Comment was edited and allow edits is disabled, no action to take");

      return false;
    }

    debug(`Comment action is assumed to be deleted, no action to take, actual value '${context.payload.action}'`);

    return false;
  }

  public async permissionLevel(): Promise<PermissionLevel> {
    const actorAccess = await this.client.rest.repos.getCollaboratorPermissionLevel({
      ...context.repo,
      username: context.actor
    });

    const actorPermissionLevel = actorAccess.data.permission as PermissionLevel;

    return actorPermissionLevel;
  }

  public async createReaction(commentId: number): Promise<boolean> {
    if (!this.addReaction) {
      return false;
    }

    await this.client.rest.reactions.createForIssueComment({
      ...context.repo,
      comment_id: commentId,
      content: this.reaction.type,
    });

    return true;
  }
}
