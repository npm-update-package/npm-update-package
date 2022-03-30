import {
  isLeft,
  isRight
} from 'fp-ts/lib/Either'
import {
  OutdatedPackageProcessor,
  OutdatedPackagesProcessor,
  PackageUpdater
} from './core'
import {
  CommitMessageCreator,
  Git,
  GitConfigInitializer,
  GitRepository
} from './git'
import {
  BranchFinder,
  createGitHub,
  LabelCreator,
  PullRequestBodyCreator,
  PullRequestCloser,
  PullRequestCreator,
  PullRequestFinder,
  PullRequestsCloser,
  PullRequestTitleCreator,
  ReleasesFetcher
} from './github'
import type { Logger } from './logger'
import { Ncu } from './ncu'
import type { Options } from './options'
import { createPackageManager } from './package-manager'
import { Terminal } from './terminal'

// TODO: Add test
export const main = async ({
  options,
  logger
}: {
  options: Options
  logger: Logger
}): Promise<void> => {
  logger.debug(`options=${JSON.stringify({
    ...options,
    githubToken: options.githubToken !== '' ? '***' : ''
  })}`)

  const ncu = new Ncu({
    options,
    logger
  })
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
    gitRepo,
    logger
  })
  await labelCreator.create({
    name: 'npm-update-package',
    description: 'Created by npm-update-package',
    color: 'A00F21'
  })

  const branchFinder = new BranchFinder(branches)
  const packageManager = createPackageManager({
    terminal,
    packageManager: options.packageManager
  })
  const pullRequestTitleCreator = new PullRequestTitleCreator(options.prTitle)
  const releasesFetcher = new ReleasesFetcher({
    options,
    packageManager
  })
  const pullRequestBodyCreator = new PullRequestBodyCreator({
    options,
    releasesFetcher
  })
  const pullRequestCreator = new PullRequestCreator({
    github,
    gitRepo,
    githubRepo,
    pullRequestTitleCreator,
    pullRequestBodyCreator,
    logger,
    reviewers: options.reviewers,
    assignees: options.assignees
  })
  const commitMessageCreator = new CommitMessageCreator(options.commitMessage)
  const pullRequestFinder = new PullRequestFinder(pullRequests)
  const pullRequestCloser = new PullRequestCloser(github)
  const pullRequestsCloser = new PullRequestsCloser({
    pullRequestCloser,
    logger
  })
  const packageUpdater = new PackageUpdater({
    packageManager,
    ncu
  })
  const outdatedPackageProcessor = new OutdatedPackageProcessor({
    git,
    packageManager,
    pullRequestCreator,
    branchFinder,
    logger,
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
  const outdatedPackagesProcessor = new OutdatedPackagesProcessor({
    outdatedPackageProcessor,
    logger
  })
  const results = await outdatedPackagesProcessor.process(outdatedPackages)
  logger.debug(`results=${JSON.stringify(results)}`)

  const succeededResults = results.filter(isRight).map(({ right }) => right)
  logger.debug(`succeededResults=${JSON.stringify(succeededResults)}`)

  const createdPackages = succeededResults
    .filter(({ created }) => created)
    .map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`createdPackages=${JSON.stringify(createdPackages)}`)

  const skippedPackages = succeededResults
    .filter(({ skipped }) => skipped)
    .map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`skippedPackages=${JSON.stringify(skippedPackages)}`)

  const failedResults = results.filter(isLeft).map(({ left }) => left)
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
