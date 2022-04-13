import type { Either } from 'fp-ts/lib/Either'
import type {
  FailedResult,
  OutdatedPackage,
  SucceededResult
} from '../core'

export interface OutdatedPackageProcessor {
  /**
   * Don't run in parallel because it includes file operations.
   */
  process: (outdatedPackage: OutdatedPackage) => Promise<Either<FailedResult, SucceededResult>>
}
