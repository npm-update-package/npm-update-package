import type { NcuOutdatedPackages } from '../types'

// TODO: add test
export const isNcuOutdatedPackages = (value: unknown): value is NcuOutdatedPackages => {
  return typeof value === 'object' && value !== null && Object.values(value).every(value => typeof value === 'string')
}
