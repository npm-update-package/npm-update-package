import type { OutdatedPackage } from './OutdatedPackage'

export interface Result {
  outdatedPackage: OutdatedPackage
  updated?: boolean
  skipped?: boolean
}
