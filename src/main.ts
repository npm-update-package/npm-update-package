import {
  isLeft,
  isRight
} from 'fp-ts/lib/Either.js'
import { OutdatedPackagesProcessor } from './core/OutdatedPackagesProcessor.js'
import { PackageUpdater } from './core/PackageUpdater.js'
import { CommitMessageCreator } from './git/CommitMessageCreator.js'
import { Git } from './git/Git.js'
import { GitConfigInitializer } from './git/GitConfigInitializer.js'
import { GitRepository } from './git/GitRepository.js'
import { BranchFinder } from './github/branch/finder/BranchFinder.js'
import { createGitHub } from './github/createGitHub.js'
import { LabelCreator } from './github/label/creator/LabelCreator.js'
import { PullRequestCloser } from './github/pull-request/closer/PullRequestCloser.js'
import { PullRequestsCloser } from './github/pull-request/closer/PullRequestsCloser.js'
import { AssigneesAdder } from './github/pull-request/creator/AssigneesAdder.js'
import { GitHubUrlOptimizer } from './github/pull-request/creator/GitHubUrlOptimizer.js'
import { LabelsAdder } from './github/pull-request/creator/LabelsAdder.js'
import { PackageDiffsSectionCreator } from './github/pull-request/creator/PackageDiffsSectionCreator.js'
import { PullRequestBodyCreator } from './github/pull-request/creator/PullRequestBodyCreator.js'
import { PullRequestCreator } from './github/pull-request/creator/PullRequestCreator.js'
import { PullRequestTitleCreator } from './github/pull-request/creator/PullRequestTitleCreator.js'
import { ReleaseNotesSectionCreator } from './github/pull-request/creator/ReleaseNotesSectionCreator.js'
import { ReviewersAdder } from './github/pull-request/creator/ReviewersAdder.js'
import { PullRequestFinder } from './github/pull-request/finder/PullRequestFinder.js'
import { ReleasesFetcher } from './github/releases/fetcher/ReleasesFetcher.js'
import { logger } from './logger/logger.js'
import { NpmCheckUpdates } from './npm-check-updates/NpmCheckUpdates.js'
import type { Options } from './options/Options.js'
import { OutdatedPackageProcessorCreator } from './outdated-package-processor/OutdatedPackageProcessorCreator.js'
import { PackageManagerCreator } from './package-manager/PackageManagerCreator.js'
import { Terminal } from './terminal/Terminal.js'

// TODO: Add test
export const main = async (options: Options): Promise<void> => {
  logger.debug(`options=${JSON.stringify({
    ...options,
    githubToken: options.githubToken === '' ? '' : '***'
  })}`)

  const ncu = new NpmCheckUpdates(options)
  const outdatedPackages = await ncu.check()
  logger.debug(`outdatedPackages=${JSON.stringify(outdatedPackages)}`)

  if (outdatedPackages.length === 0) {
    logger.info('All packages are up-to-date.')
    return
  }

  logger.info(`There are ${outdatedPackages.length} outdated packages.`)

  const terminal = new Terminal()
  const git = new Git(terminal)
  const remoteUrl = await git.getRemoteUrl()
  const gitRepo = GitRepository.of(remoteUrl)
  logger.debug(`gitRepo=${JSON.stringify(gitRepo)}`)

  if (gitRepo === undefined) {
    throw new Error(`Failed to parse remote url. URL=${remoteUrl}`)
  }

  const github = createGitHub({
    host: gitRepo.url.host,
    token: options.githubToken
  })
  const githubRepo = await github.fetchRepository({
    owner: gitRepo.owner,
    repo: gitRepo.name
  })
  logger.debug(`githubRepo=${JSON.stringify(githubRepo)}`)

  const branches = await github.fetchBranches({
    owner: gitRepo.owner,
    repo: gitRepo.name
  })
  logger.debug(`branches=${JSON.stringify(branches)}`)

  const pullRequests = await github.fetchPullRequests({
    owner: gitRepo.owner,
    repo: gitRepo.name
  })
  logger.debug(`pullRequests=${JSON.stringify(pullRequests)}`)

  const labelCreator = new LabelCreator({
    github,
    gitRepo
  })
  await labelCreator.create({
    name: 'npm-update-package',
    description: 'Created by npm-update-package',
    color: 'A00F21'
  })

  const branchFinder = new BranchFinder(branches)
  const packageManagerCreator = new PackageManagerCreator(options)
  const packageManager = await packageManagerCreator.create(terminal)
  const pullRequestTitleCreator = new PullRequestTitleCreator(options.prTitle)
  const releasesFetcher = new ReleasesFetcher({
    options,
    packageManager
  })
  const githubUrlOptimizer = new GitHubUrlOptimizer(options)
  const packageDiffsSectionCreator = new PackageDiffsSectionCreator(githubUrlOptimizer)
  const releaseNotesSectionCreator = new ReleaseNotesSectionCreator(githubUrlOptimizer)
  const pullRequestBodyCreator = new PullRequestBodyCreator({
    options,
    releasesFetcher,
    packageDiffsSectionCreator,
    releaseNotesSectionCreator
  })
  const labelsAdder = new LabelsAdder({
    options,
    github,
    gitRepo
  })
  const assigneesAdder = new AssigneesAdder({
    github,
    gitRepo
  })
  const reviewersAdder = new ReviewersAdder({
    github,
    gitRepo
  })
  const pullRequestCreator = new PullRequestCreator({
    options,
    github,
    gitRepo,
    githubRepo,
    pullRequestTitleCreator,
    pullRequestBodyCreator,
    labelsAdder,
    assigneesAdder,
    reviewersAdder
  })
  const commitMessageCreator = new CommitMessageCreator(options.commitMessage)
  const pullRequestFinder = new PullRequestFinder(pullRequests)
  const pullRequestCloser = new PullRequestCloser(github)
  const pullRequestsCloser = new PullRequestsCloser(pullRequestCloser)
  const packageUpdater = new PackageUpdater({
    packageManager,
    ncu
  })
  const outdatedPackageProcessorCreator = new OutdatedPackageProcessorCreator(options)
  const outdatedPackageProcessor = outdatedPackageProcessorCreator.create({
    git,
    packageManager,
    pullRequestCreator,
    branchFinder,
    commitMessageCreator,
    pullRequestFinder,
    pullRequestsCloser,
    packageUpdater
  })
  const gitConfigInitializer = new GitConfigInitializer({
    options,
    git
  })
  await gitConfigInitializer.initialize()
  const outdatedPackagesProcessor = new OutdatedPackagesProcessor(outdatedPackageProcessor)
  const results = await outdatedPackagesProcessor.process(outdatedPackages)
  logger.debug(`results=${JSON.stringify(results)}`)

  const succeededResults = results
    // eslint-disable-next-line unicorn/no-array-callback-reference
    .filter(isRight)
    .map(({ right }) => right)
  logger.debug(`succeededResults=${JSON.stringify(succeededResults)}`)

  const createdPackages = succeededResults
    .filter(({ created }) => created)
    .map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`createdPackages=${JSON.stringify(createdPackages)}`)

  const skippedPackages = succeededResults
    .filter(({ skipped }) => skipped)
    .map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`skippedPackages=${JSON.stringify(skippedPackages)}`)

  const failedResults = results
    // eslint-disable-next-line unicorn/no-array-callback-reference
    .filter(isLeft)
    .map(({ left }) => left)
  logger.debug(`failedResults=${JSON.stringify(failedResults)}`)

  const failedPackages = failedResults.map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`failedPackages=${JSON.stringify(failedPackages)}`)

  // TODO: Show as table
  logger.info(`Processed ${succeededResults.length + failedPackages.length} packages:
- ${createdPackages.length} packages: created (${createdPackages.map(({ name }) => name).join(',')})
- ${skippedPackages.length} packages: skipped: (${skippedPackages.map(({ name }) => name).join(',')})
- ${failedPackages.length} packages: failed: (${failedPackages.map(({ name }) => name).join(',')})`)

  if (options.ignorePackages !== undefined) {
    logger.info(`Ignored ${options.ignorePackages.length} packages: ${options.ignorePackages.join(',')}`)
  }
}
