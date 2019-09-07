# Slash Commands Action

![Build status](https://github.com/xt0rted/slash-command-action/workflows/CI/badge.svg)

Check issue or pull request comments for `/commands` and trigger or block workflows based on them.

## Usage

In the following example comments will be checked for the command `/test` (parameters are optional such as `/test ui`) and will only pass if the user who left the comment has admin access to the repo.
It will only run on the initial comment, not on edits, and when the action runs it will add a reaction of :eyes: to the comment indicating it was seen.

```yaml
on: issue_comment
name: Issue Comments
jobs:
  check_comments:
    name: Check comments for /test
      steps:
        - name: Check for Command
          id: command
          uses: xt0rted/slash-command-action
          with:
            repo-token: ${{ secrets.GITHUB_TOKEN }}
            command: test
            reaction-type: "eyes"
            run-on-edit: "false"
            user-level: admin
        - name: Act on the command
          run: echo "The command was '${{ steps.command.outputs.command-name }}' with arguments '${{ steps.command.outputs.command-arguments }}'"
```

## Options

### Required

Name | Allowed values | Description
-- | -- | --
`repo-token` | `GITHUB_TOKEN` or a custom value | The token to used to leave reactions.
`command` | `[a-zA-Z0-9_]` | The command to act on.

### Optional

Name | Allowed values | Description
-- | -- | --
`reaction` | `true` (default), `false` | Indicates if a reaction is left on the comment indicating it was seen.
`reaction-type` | `+1` (default), `-1`, `laugh`, `confused`, `heart`, `hooray`, `rocket`, `eyes` | The [reaction type](https://developer.github.com/v3/reactions/#reaction-types) to leave on the comment.
`allow-edits` | `true`, `false` (default) | Indicates if the action should run on comment edits, or the initial comment only.
`permission-level` | `admin`, `write` (default), `read`, `none` | The user's [permission level](https://developer.github.com/v3/repos/collaborators/#review-a-users-permission-level) needed to act on the command.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
