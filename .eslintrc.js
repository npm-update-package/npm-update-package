module.exports = {
  extends: [
    'standard-with-typescript',
    'plugin:jest/recommended',
    'plugin:lodash/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible'
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
    // Use native API rather than Lodash
    'lodash/prefer-lodash-chain': 'off',
    'lodash/prefer-lodash-method': 'off',
    'lodash/prefer-lodash-typecheck': 'off',
    // Use logger
    'no-console': 'error'
  }
}
