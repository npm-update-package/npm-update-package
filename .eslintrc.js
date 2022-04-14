module.exports = {
  extends: [
    'standard-with-typescript',
    'plugin:jest/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible'
  ],
  plugins: [
    'jest',
    'lodash',
    'tsdoc',
    'you-dont-need-lodash-underscore'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'import/order': ['error', {
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],
    'lodash/import-scope': 'error',
    'no-console': 'error',
    'sort-imports': 'off',
    'tsdoc/syntax': 'warn'
  }
}
