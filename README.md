[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# npm-update-package

CLI tool for creating pull request to update npm packages

## Installation

If you are using npm:

```sh
npm i -g npm-update-package
```

If you are using Yarn:

```sh
yarn global add npm-update-package
```

Or, you can use [npx](https://docs.npmjs.com/cli/v8/commands/npx).

```sh
npx npm-update-package
```

## Usage

```sh
npm-update-package --github-token $GITHUB_TOKEN
```

## Options

You can customize behavior via command-line options.

|Option|Description|Required|Value|Default|
|---|---|---|---|---|
|`--git-user-email`|User email of commit|-|string|-|
|`--git-user-name`|User name of commit|-|string|-|
|`--github-token`|GitHub token|✓|string|-|
|`--log-level`|Log level to show|-|`info`, `debug`|`info`|
|`--package-manager`|Package manager of your project|-|`npm`, `yarn`|`npm`|
