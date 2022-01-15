import type { OutdatedPackage } from './OutdatedPackage'

export interface SucceededResult {
  outdatedPackage: OutdatedPackage
  created?: boolean
  skipped?: boolean
}
