import type { OutdatedPackage } from './OutdatedPackage.js'

export interface SucceededResult {
  outdatedPackage: OutdatedPackage
  created?: boolean
  skipped?: boolean
}
