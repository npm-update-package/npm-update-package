module.exports = {
  extends: [
    'standard-with-typescript',
    'plugin:jest/recommended',
    'lodash'
  ],
  plugins: [
    'tsdoc'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    // Better TSDoc
    'tsdoc/syntax': 'warn',
    // Sort imports alphabetically
    'sort-imports': 'off',
    'import/order': ['error', {
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],
    // Use logger
    'no-console': 'error'
  }
}
