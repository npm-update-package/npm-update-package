import type { OutdatedPackage } from '../ncu'

export interface Result {
  outdatedPackage: OutdatedPackage
  updated?: boolean
  skipped?: boolean
}
