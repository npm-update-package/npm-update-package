// @ts-check

/** @typedef {import('eslint').ESLint.ConfigData} ConfigData */

/**
 * @type {ConfigData}
 * @see https://eslint.org/docs/latest/use/configure/configuration-files-deprecated
 */
const config = {
  extends: [
    '@munierujp/eslint-config-typescript',
    'plugin:jest/recommended',
    'lodash'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'no-console': 'error'
  },
  overrides: [
    // https://typescript-eslint.io/troubleshooting/#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
    {
      files: [
        './**/*.{js,cjs,mjs}'
      ],
      extends: [
        'plugin:@typescript-eslint/disable-type-checked'
      ]
    }
  ]
}

module.exports = config
