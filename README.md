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
npm-update-package
```

## Options

You can specify options via environments.

|environments|required|value|
|---|---|---|
|`GIT_USER_EMAIL`||Git's `user.email`|
|`GIT_USER_NAME`||Git's `user.name`|
|`GITHUB_TOKEN`|✓|GitHub token|
|`LOG_LEVEL`||`debug` or `info`|
|`PACKAGE_MANAGER`|✓|`npm` or `yarn`|
