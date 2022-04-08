import type { Either } from 'fp-ts/lib/Either'
import type { FailedResult } from './FailedResult'
import type { OutdatedPackage } from './OutdatedPackage'
import type { SucceededResult } from './SucceededResult'

export interface OutdatedPackageProcessor {
  /**
   * Don't run in parallel because it includes file operations.
   */
  process: (outdatedPackage: OutdatedPackage) => Promise<Either<FailedResult, SucceededResult>>
}
