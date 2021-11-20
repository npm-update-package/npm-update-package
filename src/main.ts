import { PullRequestCreator } from './pull-request-creator/PullRequestCreator'
import { createGitHub } from './createGitHub'
import { createPackageManager } from './createPackageManager'
import { getOutdatedPackages } from './getOutdatedPackages'
import { logger } from './logger'
import { Git } from './Git'
import { RemoteBranchExistenceChecker } from './RemoteBranchExistenceChecker'
import { Terminal } from './Terminal'
import { OutdatedPackageUpdater } from './OutdatedPackageUpdater'

// TODO: add test
export const main = async (): Promise<void> => {
  const outdatedPackages = await getOutdatedPackages()
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
  const packageManager = createPackageManager(terminal)
  const pullRequestCreator = new PullRequestCreator({
    github,
    gitRepo,
    githubRepo
  })
  const outdatedPackageUpdater = new OutdatedPackageUpdater({
    git,
    packageManager,
    remoteBranchExistenceChecker,
    pullRequestCreator
  })

  for (const outdatedPackage of outdatedPackages) {
    logger.debug(`outdatedPackage=${JSON.stringify(outdatedPackage)}`)
    await outdatedPackageUpdater.update(outdatedPackage)
  }

  // TODO: show numbers of updated/skipped package
}
