[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# @ts-templates/node12

Template for TypeScript project using Node.js v12

## Features

- [ESLint](https://eslint.org/) with [JavaScript Standard Style](https://standardjs.com/)
  - Run on pre-commit hook by [husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/okonet/lint-staged)
  - Run on Pull request by GitHub Action
- Test by [Jest](https://jestjs.io/)
  - Run on Pull request by GitHub Action
- Manage Node.js version by [nvm](https://github.com/nvm-sh/nvm)
- Manage dependency updates by [Renovate](https://renovatebot.com/)

## Usage

1. [Create repository](https://github.com/ts-templates/node14/generate) using template
2. Replace provisional string with actual string
    - `@ts-templates/node12` => your package name
    - `Template for TypeScript project using Node.js v12` => your package description
3. Implement `src/main.ts`
