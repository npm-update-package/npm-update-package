// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
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
import { OutdatedPackageProcessorCreator } from './OutdatedPackageProcessorCreator.js'
import { OutdatedPullRequestStrategy } from './OutdatedPullRequestStrategy.js'
import { Recreate } from './recreate/Recreate.js'
import { Skip } from './skip/Skip.js'

describe('OutdatedPackageProcessorCreator', () => {
  describe('create', () => {
    describe('returns new OutdatedPackageProcessor instance', () => {
      it.each([
        [OutdatedPullRequestStrategy.Create, Create],
        [OutdatedPullRequestStrategy.Recreate, Recreate],
        [OutdatedPullRequestStrategy.Skip, Skip]
      ])('outdatedPrStrategy=%p', async (outdatedPrStrategy, expected) => {
        const options = {
          outdatedPrStrategy
        }
        const outdatedPackageProcessorCreator = new OutdatedPackageProcessorCreator(options as Options)
        const git = {} as unknown as Git
        const packageManager = {} as unknown as PackageManager
        const pullRequestCreator = {} as unknown as PullRequestCreator
        const branchFinder = {} as unknown as BranchFinder
        const commitMessageCreator = {} as unknown as CommitMessageCreator
        const pullRequestFinder = {} as unknown as PullRequestFinder
        const pullRequestsCloser = {} as unknown as PullRequestsCloser
        const packageUpdater = {} as unknown as PackageUpdater

        const actual = outdatedPackageProcessorCreator.create({
          git,
          packageManager,
          pullRequestCreator,
          branchFinder,
          commitMessageCreator,
          pullRequestFinder,
          pullRequestsCloser,
          packageUpdater
        })

        expect(actual).toBeInstanceOf(expected)
      })
    })
  })
})
