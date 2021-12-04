import type { OutdatedPackage } from '../ncu'

export interface SucceededResult {
  outdatedPackage: OutdatedPackage
  updated?: boolean
  skipped?: boolean
}
