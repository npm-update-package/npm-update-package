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
import {
  PackageJsonParser,
  PackageJsonReader
} from './package-json'
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
  logger.debug(`options=${JSON.stringify(options)}`)

  const packageJsonParser = new PackageJsonParser(logger)
  const packageJsonReader = new PackageJsonReader({
    packageJsonParser,
    logger
  })
  const ncu = new Ncu(packageJsonReader)
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
    logger
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

  const updatedPackages = results
    .filter(({ updated }) => updated)
    .map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`updatedPackages=${JSON.stringify(updatedPackages)}`)

  const skippedPackages = results
    .filter(({ skipped }) => skipped)
    .map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`skippedPackages=${JSON.stringify(skippedPackages)}`)

  logger.info(`${updatedPackages.length} packages has updated. ${skippedPackages.length} packages has skipped.`)
}
