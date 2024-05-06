import type { JestConfigWithTsJest } from 'ts-jest'

/**
 * @see https://jestjs.io/ja/docs/configuration
 * @see https://kulshekhar.github.io/ts-jest/docs/getting-started/options
 * @see https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
 */
const esmConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  }
}

/**
 * @see https://jestjs.io/ja/docs/configuration
 * @see https://kulshekhar.github.io/ts-jest/docs/getting-started/options
 */
const coverageConfig: JestConfigWithTsJest = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts'
  ]
}

/**
 * @see https://jestjs.io/ja/docs/configuration
 * @see https://kulshekhar.github.io/ts-jest/docs/getting-started/options
 */
const config: JestConfigWithTsJest = {
  ...esmConfig,
  ...coverageConfig

}

export default config
