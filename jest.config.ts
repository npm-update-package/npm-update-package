import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  coverageReporters: [
    // default
    'clover',
    'json',
    'lcov',
    'text',
    // for jest-coverage-badges
    'json-summary'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts'
  ]
}

export default config
