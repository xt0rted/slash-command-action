# Changelog

## Unreleased

- Bumped `@actions/core` from 1.10.0 to 1.10.1

## [2.0.0](https://github.com/xt0rted/slash-command-action/compare/v1.2.0...v2.0.0) - 2022-10-23

- Updated node runtime from 12 to 16
- Updated the `repo-token` input so it defaults to `GITHUB_TOKEN`. If you're already using this value you can remove this setting from your workflow.

## [1.2.0](https://github.com/xt0rted/slash-command-action/compare/v1.1.0...v1.2.0) - 2022-10-23

- Bumped `@actions/core` from 1.2.2 to 1.10.0
- Bumped `@actions/github` from 2.1.1 to 5.1.1
- Bumped `node-fetch` from 2.6.1 to 2.6.7

## [1.1.0](https://github.com/xt0rted/slash-command-action/compare/v1.0.0...v1.1.0) - 2020-02-22

- Fixed edit comment with allow edits enabled so it doesn't set `process.exitCode` to `1`

## [1.0.0](https://github.com/xt0rted/slash-command-action/releases/tag/v1.0.0) - 2019-09-07

- Initial release
