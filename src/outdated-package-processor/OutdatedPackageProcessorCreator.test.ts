import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import type { Class } from 'utility-types'
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
import { OutdatedPackageProcessorCreator } from './OutdatedPackageProcessorCreator.js'
import { OutdatedPullRequestStrategy } from './OutdatedPullRequestStrategy.js'
import { Recreate } from './recreate/Recreate.js'
import { Skip } from './skip/Skip.js'

await describe('OutdatedPackageProcessorCreator', async () => {
  await describe('create', async () => {
    await describe('returns new OutdatedPackageProcessor instance', async () => {
      const inputs: Array<[outdatedPrStrategy: OutdatedPullRequestStrategy, expected: Class<OutdatedPackageProcessor>]> = [
        [OutdatedPullRequestStrategy.Create, Create],
        [OutdatedPullRequestStrategy.Recreate, Recreate],
        [OutdatedPullRequestStrategy.Skip, Skip]
      ]
      each(inputs, ({ title }, [outdatedPrStrategy, expected]) => {
        void it(title, () => {
          const options = {
            outdatedPrStrategy
          } as unknown as Options
          const outdatedPackageProcessorCreator = new OutdatedPackageProcessorCreator(options)
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

          assert.ok(actual instanceof expected)
        })
      })
    })
  })
})
