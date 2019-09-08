"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const command_1 = require("./command");
const reaction_1 = require("./reaction");
const permission_1 = require("./permission");
class CommandHandler {
    constructor(repoToken, commandName, addReaction, reactionType, allowEdits, requiredPermissionLevel) {
        this.addReaction = addReaction;
        this.allowEdits = allowEdits;
        this.requiredPermissionLevel = requiredPermissionLevel;
        this.command = new command_1.Command(commandName);
        this.reaction = new reaction_1.Reaction(reactionType);
        this.client = new github_1.GitHub(repoToken);
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            core_1.debug("Checking if step should run on this event action");
            if (!this.shouldRunForAction()) {
                return false;
            }
            core_1.debug("Getting the comment and checking it for a command");
            const comment = github_1.context.payload["comment"];
            const commandResults = this.command.checkComment(comment.body);
            if (!commandResults) {
                core_1.setFailed("Comment didn't contain a valid slash command");
                return false;
            }
            core_1.debug("Passing the command details along for any other actions to use");
            core_1.setOutput("command-name", commandResults.name);
            core_1.setOutput("command-arguments", commandResults.arguments);
            core_1.debug("Checking if user has the required access to the repo for this command");
            const actorPermissionLevel = yield this.permissionLevel();
            if (!permission_1.checkPermission(this.requiredPermissionLevel, actorPermissionLevel)) {
                core_1.setFailed("User doesn't have enough access to the repo");
                return false;
            }
            core_1.debug("Adding a reaction to the comment if enabled");
            yield this.createReaction(comment.id);
            core_1.debug("Command passed, able to execute job");
            return true;
        });
    }
    shouldRunForAction() {
        if (github_1.context.payload.action === "created") {
            core_1.debug("Comment was created");
            return true;
        }
        if (github_1.context.payload.action === "edited") {
            if (this.allowEdits) {
                core_1.setFailed("Comment was edited and allow edits is enabled");
                return true;
            }
            core_1.setFailed("Comment was edited and allow edits is disabled, no action to take");
            return false;
        }
        core_1.debug(`Comment action is assumed to be deleted, no action to take, actual value '${github_1.context.payload.action}'`);
        return false;
    }
    permissionLevel() {
        return __awaiter(this, void 0, void 0, function* () {
            const actorAccess = yield this.client.repos.getCollaboratorPermissionLevel(Object.assign(Object.assign({}, github_1.context.repo), { username: github_1.context.actor }));
            const actorPermissionLevel = actorAccess.data.permission;
            return actorPermissionLevel;
        });
    }
    createReaction(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.addReaction) {
                return false;
            }
            yield this.client.reactions.createForIssueComment(Object.assign(Object.assign({}, github_1.context.repo), { comment_id: commentId, content: this.reaction.type }));
            return true;
        });
    }
}
exports.CommandHandler = CommandHandler;
//# sourceMappingURL=commandHandler.js.map