import type { OutdatedPackage } from './OutdatedPackage'

export interface FailedResult {
  outdatedPackage: OutdatedPackage
  error: unknown
}
