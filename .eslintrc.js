module.exports = {
  extends: [
    'standard-with-typescript',
    'plugin:unicorn/recommended',
    'plugin:eslint-comments/recommended',
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
    'import/order': ['error', {
      alphabetize: {
        order: 'asc',
        caseInsensitive: true
      }
    }],
    'no-console': 'error',
    'sort-imports': 'off',
    'tsdoc/syntax': 'warn',
    'unicorn/error-message': 'off',
    'unicorn/filename-case': 'off',
    // TODO: Maybe enable later
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-useless-undefined': 'off',
    // TODO: Maybe enable later
    'unicorn/prefer-module': 'off',
    // TODO: Maybe enable later
    'unicorn/prefer-spread': 'off',
    // TODO: Maybe enable later
    'unicorn/prefer-ternary': 'off',
    'unicorn/prevent-abbreviations': 'off'
  }
}
