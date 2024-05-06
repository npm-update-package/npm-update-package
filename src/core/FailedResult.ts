import type { OutdatedPackage } from './OutdatedPackage.js'

export interface FailedResult {
  outdatedPackage: OutdatedPackage
  error: unknown
}
