import type { PackageUpdater } from '../core/PackageUpdater.js'
import type { CommitMessageCreator } from '../git/CommitMessageCreator.js'
import type { Git } from '../git/Git.js'
import type { BranchFinder } from '../github/branch/finder/BranchFinder.js'
import type { PullRequestsCloser } from '../github/pull-request/closer/PullRequestsCloser.js'
import type { PullRequestCreator } from '../github/pull-request/creator/PullRequestCreator.js'
import type { PullRequestFinder } from '../github/pull-request/finder/PullRequestFinder.js'
import type { Options } from '../options/Options.js'
import type { PackageManager } from '../package-manager/PackageManager.js'
import { Create } from './create/Create.js'
import type { OutdatedPackageProcessor } from './OutdatedPackageProcessor.js'
import { OutdatedPullRequestStrategy } from './OutdatedPullRequestStrategy.js'
import { Recreate } from './recreate/Recreate.js'
import { Skip } from './skip/Skip.js'

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
