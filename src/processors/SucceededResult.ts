import type { OutdatedPackage } from '../nup'

export interface SucceededResult {
  outdatedPackage: OutdatedPackage
  created?: boolean
  skipped?: boolean
}
