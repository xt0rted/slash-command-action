import {
  getInput,
  setFailed,
  setOutput,
} from "@actions/core";

import { CommandHandler } from "./commandHandler";
import { PermissionLevel } from "./interfaces";

export async function run(): Promise<void> {
  try {
    const hasCommand = await new CommandHandler(
      getInput("repo-token", { required: true }),
      getInput("command", { required: true }),
      getInput("reaction") === "true",
      getInput("reaction-type"),
      getInput("allow-edits") === "true",
      getInput("permission-level") as PermissionLevel,
    ).process();

    setOutput("has-command", hasCommand.toString());
  } catch (error) {
    setFailed(error.message);
    throw error;
  }
}

run();
