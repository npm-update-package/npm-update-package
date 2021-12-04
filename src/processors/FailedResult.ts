import type { OutdatedPackage } from '../ncu'

export interface FailedResult {
  outdatedPackage: OutdatedPackage
  error: unknown
}
