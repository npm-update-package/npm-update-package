import type { OutdatedPackage } from '../nup'

export interface FailedResult {
  outdatedPackage: OutdatedPackage
  error: unknown
}
