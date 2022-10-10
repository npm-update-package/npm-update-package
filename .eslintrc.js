const unicornRules = {
  'unicorn/error-message': 'off',
  'unicorn/filename-case': 'off',
  'unicorn/no-array-for-each': 'off',
  'unicorn/no-useless-undefined': 'off',
  'unicorn/prefer-module': 'off',
  // TODO [engine:node@>=16]: Enable this when the minimum supported Node.js version becomes v16 or later.
  'unicorn/prefer-node-protocol': 'off',
  'unicorn/prefer-spread': 'off',
  'unicorn/prefer-top-level-await': 'off',
  'unicorn/prevent-abbreviations': 'off',
  'unicorn/switch-case-braces': ['error', 'avoid']
}

const importRules = {
  'sort-imports': 'off',
  'import/order': ['error', {
    alphabetize: {
      order: 'asc',
      caseInsensitive: true
    }
  }],
  'import-newlines/enforce': ['error', {
    items: 1,
    semi: false
  }]
}

module.exports = {
  extends: [
    '@eslint-recommended/eslint-config-typescript',
    'plugin:jest/recommended'
  ],
  plugins: [
    'import-newlines'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    ...unicornRules,
    ...importRules,
    'no-console': 'error'
  }
}
