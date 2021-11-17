// TODO: Keep it less than 100 lines.

import { createBranchName } from './createBranchName'
import { createCommitMessage } from './createCommitMessage'
import { createGitHub } from './createGitHub'
import { createPackageManager } from './createPackageManager'
import { createPullRequestBody } from './createPullRequestBody'
import { createPullRequestTitle } from './createPullRequestTitle'
import { getOutdatedPackages } from './getOutdatedPackages'
import { logger } from './logger'
import { updateOutdatedPackage } from './updateOutdatedPackage'
import { Git } from './Git'
import { Terminal } from './Terminal'

// TODO: add logs using logger
export const main = async (): Promise<void> => {
  const outdatedPackages = await getOutdatedPackages()
  logger.debug(`outdatedPackages=${JSON.stringify(outdatedPackages)}`)

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

  const remoteBranchNames = remoteBranches.map(({ name }) => name)
  logger.debug(`remoteBranchNames=${JSON.stringify(remoteBranchNames)}`)

  const packageManager = createPackageManager(terminal)

  for (const outdatedPackage of outdatedPackages) {
    logger.debug(`outdatedPackage=${JSON.stringify(outdatedPackage)}`)

    const branchName = createBranchName(outdatedPackage)
    logger.debug(`branchName=${branchName}`)

    if (remoteBranchNames.includes(branchName)) {
      logger.info(`${branchName} branch already exists on ${gitRepo.url}`)
      continue
    }

    await git.createBranch(branchName)
    const updatedPackages = await updateOutdatedPackage(outdatedPackage)
    logger.debug(`updatedPackages=${JSON.stringify(updatedPackages)}`)

    if (updatedPackages.length !== 1) {
      throw new Error(`Failed to update packages. name=${outdatedPackage.name}`)
    }

    await packageManager.install()
    // TODO: add only necessary files （package.json & package-lock.json or yarn.lock）
    await git.addAll()
    const message = createCommitMessage(outdatedPackage)
    logger.debug(`message=${message}`)

    if (process.env.GIT_USER_NAME !== undefined && process.env.GIT_USER_EMAIL !== undefined) {
      const name = await git.getConfig('user.name')
      logger.debug(`name=${name}`)

      const email = await git.getConfig('user.email')
      logger.debug(`email=${email}`)

      await git.setConfig('user.name', process.env.GIT_USER_NAME)
      await git.setConfig('user.email', process.env.GIT_USER_EMAIL)
      await git.commit(message)
      await git.setConfig('user.name', name)
      await git.setConfig('user.email', email)
    } else {
      await git.commit(message)
    }

    await git.push(branchName)
    const title = createPullRequestTitle(outdatedPackage)
    logger.debug(`title=${title}`)

    const body = createPullRequestBody(outdatedPackage)
    logger.debug(`body=${body}`)

    await github.createPullRequest({
      owner: gitRepo.owner,
      repo: gitRepo.name,
      base: githubRepo.default_branch,
      head: branchName,
      title,
      body
    })
    await git.checkout('-')
    await git.removeBranch(branchName)
  }
}
