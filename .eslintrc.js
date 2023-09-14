// eslint-disable-next-line unicorn/prefer-module
module.exports = {
  extends: [
    '@munierujp/eslint-config-typescript',
    'plugin:jest/recommended'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'no-console': 'error',
    'sonarjs/no-duplicate-string': 'off'
  }
}
