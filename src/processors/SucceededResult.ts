import type { OutdatedPackage } from '../ncu'

export interface SucceededResult {
  outdatedPackage: OutdatedPackage
  // TODO: rename to created
  updated?: boolean
  skipped?: boolean
}
