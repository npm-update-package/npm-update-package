module.exports = {
  extends: [
    '@npm-update-package/eslint-config-typescript',
    'plugin:sonarjs/recommended',
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
