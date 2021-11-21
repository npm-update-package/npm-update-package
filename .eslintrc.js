module.exports = {
  extends: [
    'standard-with-typescript',
    'plugin:jest/recommended'
  ],
  plugins: [
    'eslint-plugin-tsdoc'
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
    'tsdoc/syntax': 'warn'
  }
}
