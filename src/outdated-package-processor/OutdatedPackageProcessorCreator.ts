import type { PackageUpdater } from '../core'
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
import type { Options } from '../options'
import type { PackageManager } from '../package-manager'
import { Create } from './create'
import type { OutdatedPackageProcessor } from './OutdatedPackageProcessor'
import { OutdatedPullRequestStrategy } from './OutdatedPullRequestStrategy'
import { Recreate } from './recreate'
import { Skip } from './skip'

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
    switch (this.options.outdatedPrStrategy) {
      case OutdatedPullRequestStrategy.Create:
        return new Create({
          git,
          packageManager,
          pullRequestCreator,
          branchFinder,
          commitMessageCreator,
          packageUpdater
        })
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
      case OutdatedPullRequestStrategy.Skip:
        return new Skip({
          git,
          packageManager,
          pullRequestCreator,
          branchFinder,
          commitMessageCreator,
          pullRequestFinder,
          packageUpdater
        })
    }
  }
}
