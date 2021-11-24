import type { OutdatedPackage } from '../types/OutdatedPackage'

export interface Result {
  outdatedPackage: OutdatedPackage
  updated?: boolean
  skipped?: boolean
}
