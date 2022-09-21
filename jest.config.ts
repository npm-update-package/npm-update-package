import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/index.ts'
  ]
}

export default config
