import {
  Git,
  BranchCleaner
} from './git'
import {
  createGitHub,
  PullRequestCreator,
  RemoteBranchExistenceChecker
} from './github'
import { logger } from './logger'
import { Ncu } from './ncu'
import { OutdatedPackageProcessor } from './outdated-package-processor'
import { OutdatedPackageUpdater } from './outdated-package-updater'
import { OutdatedPackagesProcessor } from './outdated-packages-processor'
import { createPackageManager } from './package-manager'
import { Terminal } from './terminal'

// TODO: add test
export const main = async (): Promise<void> => {
  const ncu = new Ncu()
  const outdatedPackages = await ncu.check()
  logger.debug(`outdatedPackages=${JSON.stringify(outdatedPackages)}`)

  if (outdatedPackages.length === 0) {
    logger.info('All packages are up-to-date.')
    return
  }

  logger.info(`There are ${outdatedPackages.length} outdated packages.`)

  const terminal = new Terminal()
  const packageManager = createPackageManager(terminal)
  const git = new Git(terminal)
  const gitRepo = await git.getRepository()
  logger.debug(`gitRepo=${JSON.stringify(gitRepo)}`)

  const github = createGitHub(gitRepo)
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
  const pullRequestCreator = new PullRequestCreator({
    github,
    gitRepo,
    githubRepo
  })
  const branchCleaner = new BranchCleaner(git)
  const outdatedPackageUpdater = new OutdatedPackageUpdater({
    packageManager,
    ncu
  })
  const outdatedPackageProcessor = new OutdatedPackageProcessor({
    git,
    outdatedPackageUpdater,
    remoteBranchExistenceChecker,
    pullRequestCreator,
    branchCleaner
  })
  const outdatedPackagesProcessor = new OutdatedPackagesProcessor(outdatedPackageProcessor)
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
