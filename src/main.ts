import { createBranchName } from './createBranchName'
import { createCommitMessage } from './createCommitMessage'
import { createGitHub } from './createGitHub'
import { createPackageManager } from './createPackageManager'
import { getOutdatedPackages } from './getOutdatedPackages'
import { updateOutdatedPackage } from './updateOutdatedPackage'
import { Git } from './Git'
import { Terminal } from './Terminal'

export const main = async (): Promise<void> => {
  const outdatedPackages = await getOutdatedPackages()
  console.debug({ outdatedPackages })

  const terminal = new Terminal()
  const git = new Git(terminal)
  const gitRepo = await git.getRepository()
  const github = createGitHub(gitRepo)
  const remoteBranches = await github.fetchBranches({
    owner: gitRepo.owner,
    repo: gitRepo.name
  })
  console.debug({ remoteBranches })

  const remoteBranchNames = remoteBranches.map(({ name }) => name)
  console.debug({ remoteBranchNames })

  const packageManager = createPackageManager(terminal)

  for (const outdatedPackage of outdatedPackages) {
    console.debug({ outdatedPackage })

    const branchName = createBranchName(outdatedPackage)
    console.debug({ branchName })

    if (remoteBranchNames.includes(branchName)) {
      console.log(`${branchName} branch already exists on ${gitRepo.url}`)
      continue
    }

    await git.createBranch(branchName)
    const updatedPackages = await updateOutdatedPackage(outdatedPackage)
    console.debug({ updatedPackages })

    if (updatedPackages.length !== 1) {
      throw new Error(`Failed to update packages. name=${outdatedPackage.name}`)
    }

    await packageManager.install()

    // TODO: add only necessary files （package.json & package-lock.json or yarn.lock）
    await git.addAll()
    const message = createCommitMessage(outdatedPackage)
    console.debug({ message })

    if (process.env.AUTHOR_NAME !== undefined && process.env.AUTHOR_EMAIL !== undefined) {
      const name = await git.getConfig('user.name')
      console.debug({ name })

      const email = await git.getConfig('user.email')
      console.debug({ email })

      await git.setConfig('user.name', process.env.AUTHOR_NAME)
      await git.setConfig('user.email', process.env.AUTHOR_EMAIL)
      await git.commit(message)
      await git.setConfig('user.name', name)
      await git.setConfig('user.email', email)
    } else {
      await git.commit(message)
    }

    // TODO: push to remote repository

    // TODO: create PR

    // TODO: remove branch
  }
}
