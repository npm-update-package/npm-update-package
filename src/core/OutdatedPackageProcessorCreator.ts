import type {
  CommitMessageCreator,
  Git
} from '../git'
import type {
  BranchFinder,
  PullRequestCreator,
  PullRequestFinder,
  PullRequestsCloser
} from '../github'
import { logger } from '../logger'
import type { Options } from '../options'
import type { PackageManager } from '../package-manager'
import type { OutdatedPackageProcessor } from './OutdatedPackageProcessor'
import { OutdatedPullRequestStrategy } from './OutdatedPullRequestStrategy'
import type { PackageUpdater } from './PackageUpdater'
import { Recreate } from './Recreate'

// TODO: Add test
export class OutdatedPackageProcessorCreator {
  constructor (private readonly options: Options) {}

  create ({
    git,
    packageManager,
    pullRequestCreator,
    branchFinder,
    commitMessageCreator,
    pullRequestFinder,
    pullRequestsCloser,
    packageUpdater
  }: {
    git: Git
    packageManager: PackageManager
    pullRequestCreator: PullRequestCreator
    branchFinder: BranchFinder
    commitMessageCreator: CommitMessageCreator
    pullRequestFinder: PullRequestFinder
    pullRequestsCloser: PullRequestsCloser
    packageUpdater: PackageUpdater
  }): OutdatedPackageProcessor {
    const strategy = this.options.outdatedPrStrategy
    logger.trace(`strategy=${strategy}`)

    switch (strategy) {
      case OutdatedPullRequestStrategy.Recreate:
        return new Recreate({
          git,
          packageManager,
          pullRequestCreator,
          branchFinder,
          commitMessageCreator,
          pullRequestFinder,
          pullRequestsCloser,
          packageUpdater
        })
    }
  }
}
