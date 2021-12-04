import type { OutdatedPackage } from '../ncu'

export interface FailedResult<Error = unknown> {
  outdatedPackage: OutdatedPackage
  error: Error
}
