import {
  Committer,
  Git
} from './git'
import {
  createGitHub,
  PullRequestCreator,
  RemoteBranchExistenceChecker
} from './github'
import type { Logger } from './logger'
import { Ncu } from './ncu'
import type { Options } from './options'
import { OutdatedPackageProcessor } from './outdated-package-processor'
import { OutdatedPackagesProcessor } from './outdated-packages-processor'
import { createPackageManager } from './package-manager'
import { Terminal } from './terminal'

// TODO: add test
export const main = async ({
  options,
  logger
}: {
  options: Options
  logger: Logger
}): Promise<void> => {
  const ncu = new Ncu()
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
  const committer = new Committer({
    git,
    user: {
      name: options.gitUserName,
      email: options.gitUserEmail
    }
  })
  const packageManager = createPackageManager({
    terminal,
    packageManager: options.packageManager
  })
  const pullRequestCreator = new PullRequestCreator({
    github,
    gitRepo,
    githubRepo,
    logger
  })
  const outdatedPackageProcessor = new OutdatedPackageProcessor({
    committer,
    git,
    ncu,
    packageManager,
    pullRequestCreator,
    remoteBranchExistenceChecker,
    logger
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
  logger.info(`${updatedPackages.length} packages has updated.`)

  const skippedPackages = results
    .filter(({ skipped }) => skipped)
    .map(({ outdatedPackage }) => outdatedPackage)
  logger.debug(`skippedPackages=${JSON.stringify(skippedPackages)}`)
  logger.info(`${skippedPackages.length} packages has skipped.`)
}
