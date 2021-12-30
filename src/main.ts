import {
  isLeft,
  isRight
} from 'fp-ts/lib/Either'
import {
  BranchNameCreator,
  CommitMessageCreator,
  Git
} from './git'
import {
  createGitHub,
  PullRequestBodyCreator,
  PullRequestCreator,
  PullRequestTitleCreator,
  RemoteBranchExistenceChecker
} from './github'
import type { Logger } from './logger'
import { Ncu } from './ncu'
import type { Options } from './options'
import { PackageJsonParser } from './package-json'
import { createPackageManager } from './package-manager'
import {
  OutdatedPackageProcessor,
  OutdatedPackagesProcessor
} from './processors'
import { Terminal } from './terminal'

// TODO: add test
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

  const packageJsonParser = new PackageJsonParser(logger)
  const ncu = new Ncu(packageJsonParser)
  const outdatedPackages = await ncu.check()
  logger.debug(`outdatedPackages=${JSON.stringify(outdatedPackages)}`)

  if (outdatedPackages.length === 0) {
    logger.info('All packages are up-to-date.')
    return
  }

  logger.info(`There are ${outdatedPackages.length} outdated packages.`)

  const terminal = new Terminal()
  const git = new Git(terminal)
  const gitRepo = await git.getRepository()
  logger.debug(`gitRepo=${JSON.stringify(gitRepo)}`)

  const github = createGitHub({
    repository: gitRepo,
    token: options.githubToken
  })
  const githubRepo = await github.fetchRepository({
    owner: gitRepo.owner,
    repo: gitRepo.name
  })
  logger.debug(`githubRepo=${JSON.stringify(githubRepo)}`)

  const remoteBranches = await github.fetchBranches({
    owner: gitRepo.owner,
    repo: gitRepo.name
  })
  logger.debug(`remoteBranches=${JSON.stringify(remoteBranches)}`)

  const remoteBranchExistenceChecker = RemoteBranchExistenceChecker.of(remoteBranches)
  const packageManager = createPackageManager({
    terminal,
    packageManager: options.packageManager
  })
  const pullRequestTitleCreator = new PullRequestTitleCreator(options.pullRequestTitle)
  const pullRequestBodyCreator = new PullRequestBodyCreator(options.pullRequestBody)
  const pullRequestCreator = new PullRequestCreator({
    github,
    gitRepo,
    githubRepo,
    pullRequestTitleCreator,
    pullRequestBodyCreator,
    logger,
    labels: options.pullRequestLabels
  })
  const branchNameCreator = new BranchNameCreator(options.branchName)
  const commitMessageCreator = new CommitMessageCreator(options.commitMessage)
  const outdatedPackageProcessor = new OutdatedPackageProcessor({
    git,
    ncu,
    packageManager,
    pullRequestCreator,
    remoteBranchExistenceChecker,
    logger,
    branchNameCreator,
    commitMessageCreator
  })
  const outdatedPackagesProcessor = new OutdatedPackagesProcessor({
    outdatedPackageProcessor,
    logger
  })
  const results = await outdatedPackagesProcessor.process(outdatedPackages)
  logger.debug(`results=${JSON.stringify(results)}`)

  const succeededResults = results.filter(isRight).map(({ right }) => right)
  logger.debug(`succeededResults=${JSON.stringify(succeededResults)}`)

  const updatedPackages = succeededResults
    .filter(({ updated }) => updated)
    .map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`updatedPackages=${JSON.stringify(updatedPackages)}`)

  const skippedPackages = succeededResults
    .filter(({ skipped }) => skipped)
    .map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`skippedPackages=${JSON.stringify(skippedPackages)}`)

  const failedResults = results.filter(isLeft).map(({ left }) => left)
  logger.debug(`failedResults=${JSON.stringify(failedResults)}`)

  const failedPackages = failedResults.map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`failedPackages=${JSON.stringify(failedPackages)}`)

  // TODO: show as table
  logger.info(`Processed ${succeededResults.length + failedPackages.length} packages:
- ${updatedPackages.length} packages has updated: ${updatedPackages.map(({ name }) => name).join(',')}
- ${skippedPackages.length} packages has skipped: ${skippedPackages.map(({ name }) => name).join(',')}
- ${failedPackages.length} packages has failed: ${failedPackages.map(({ name }) => name).join(',')}`)
}
