import type { OutdatedPackage } from '../types'

export interface Result {
  outdatedPackage: OutdatedPackage
  updated?: boolean
  skipped?: boolean
}
