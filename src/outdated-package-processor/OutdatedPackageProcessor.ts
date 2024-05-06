import type { Either } from 'fp-ts/lib/Either.js'
import type { FailedResult } from '../core/FailedResult.js'
import type { OutdatedPackage } from '../core/OutdatedPackage.js'
import type { SucceededResult } from '../core/SucceededResult.js'

export interface OutdatedPackageProcessor {
  /**
   * Don't run in parallel because it includes file operations.
   */
  process: (outdatedPackage: OutdatedPackage) => Promise<Either<FailedResult, SucceededResult>>
}
