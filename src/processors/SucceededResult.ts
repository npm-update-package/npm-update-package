import type { OutdatedPackage } from '../ncu'

export interface SucceededResult {
  outdatedPackage: OutdatedPackage
  created?: boolean
  skipped?: boolean
}
