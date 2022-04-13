module.exports = {
  extends: [
    'standard-with-typescript',
    'plugin:jest/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible'
  ],
  plugins: [
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
    'no-console': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: 'lodash',
            message: "Please use `import foo from 'lodash/foo'` instead."
          }
        ]
      }
    ],
    'sort-imports': 'off',
    'tsdoc/syntax': 'warn'
  }
}
