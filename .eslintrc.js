const sortImportsAlphabetically = {
  'sort-imports': 'off',
  'import/order': ['error', {
    alphabetize: {
      order: 'asc',
      caseInsensitive: true
    }
  }]
}

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
    ...sortImportsAlphabetically,
    'no-console': 'error',
    'tsdoc/syntax': 'warn',
    'unicorn/error-message': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/prefer-module': 'off',
    // TODO [engine:node@>=16]: Enable this when the minimum supported Node.js version becomes v16 or later.
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/prefer-spread': 'off',
    'unicorn/prefer-top-level-await': 'off',
    'unicorn/prevent-abbreviations': 'off'
  }
}
