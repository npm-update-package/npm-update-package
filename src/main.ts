import { Git } from './git'
import { GitBranchCleaner } from './git-branch-cleaner'
import { createGitHub } from './github'
import { logger } from './logger'
import { Ncu } from './ncu'
import { OutdatedPackageUpdater } from './outdated-package-updater'
import { OutdatedPackagesUpdater } from './outdated-packages-updater'
import { createPackageManager } from './package-manager'
import { PullRequestCreator } from './pull-request-creator'
import { RemoteBranchExistenceChecker } from './remote-branch-existence-checker'
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
  const gitBranchCleaner = new GitBranchCleaner(git)
  const outdatedPackageUpdater = new OutdatedPackageUpdater({
    git,
    packageManager,
    ncu,
    remoteBranchExistenceChecker,
    pullRequestCreator,
    gitBranchCleaner
  })
  const outdatedPackagesUpdater = new OutdatedPackagesUpdater(outdatedPackageUpdater)
  const results = await outdatedPackagesUpdater.update(outdatedPackages)
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
