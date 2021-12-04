[![npm version](https://badge.fury.io/js/npm-update-package.svg)](https://badge.fury.io/js/npm-update-package)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# npm-update-package

CLI tool for creating pull request to update npm packages

## Caution

This package is currently under development, so the major version is 0 yet.

## Requirements

- Git v2.23.0 or higher

## Usage

```sh
npx npm-update-package --github-token $GITHUB_TOKEN
```

## Options

You can customize behavior via command-line options.  
Template strings such as `--branch-name` can embed variables like `{{packageName}}`(HTML-escaped) or `{{{packageName}}}`(not HTML-escaped).

### `--branch-name`

Branch name template

- value: template string
- variables:
  - `currentVersion`
  - `newVersion`
  - `packageName`
  - `updateType`
- required: false
- default: `npm-update-package/{{{packageName}}}/v{{newVersion}}`

### `--commit-message`

Commit message template

- value: template string
- variables:
  - `currentVersion`
  - `newVersion`
  - `packageName`
  - `updateType`
- required: false
- default: `chore(deps): {{updateType}} update {{{packageName}}} to v{{newVersion}}`

### `--github-token`

GitHub token

- value: string
- required: true

### `--log-level`

Log level to show

- value: string
  - `error`
  - `info`
  - `debug`
- required: false
- default: `info`

### `--package-manager`

Package manager of your project

- value: string
  - `npm`
  - `yarn`
- required: false
- default: `npm`

### `--pull-request-body`

Pull request body template

- value: template string
- variables:
  - `appName`
  - `appVersion`
  - `appWeb`
  - `currentVersion`
  - `newVersion`
  - `packageName`
  - `updateType`
- required: false
- default:

```
This PR updates these packages:

|package|type|current version|new version|
|---|---|---|---|
|[{{{packageName}}}](https://www.npmjs.com/package/{{{packageName}}})|{{updateType}}|\`{{currentVersion}}\`|\`{{newVersion}}\`|

---
This PR has been generated by [{{{appName}}}]({{{appWeb}}}) v{{appVersion}}
```

### `--pull-request-title`

Pull request title template

- value: template string
- variables:
  - `currentVersion`
  - `newVersion`
  - `packageName`
  - `updateType`
- required: false
- default: `chore(deps): {{updateType}} update {{{packageName}}} to v{{newVersion}}`
