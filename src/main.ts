import * as core from "@actions/core";

import { CommandHandler } from "./commandHandler";
import { PermissionLevel } from "./interfaces";

export async function run() {
  try {
    await new CommandHandler(
      core.getInput("repo-token", { required: true }),
      core.getInput("command", { required: true }),
      core.getInput("reaction") === "true",
      core.getInput("reaction-type"),
      core.getInput("allow-edits") === "true",
      core.getInput("permission-level") as PermissionLevel,
    ).process();
  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
}

run();
