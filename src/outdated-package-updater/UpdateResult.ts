import type { OutdatedPackage } from '../types'

export interface UpdateResult {
  outdatedPackage: OutdatedPackage
  updated?: boolean
  skipped?: boolean
}
