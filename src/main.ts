import { createBranchName } from './createBranchName'
import { createGitHub } from './createGitHub'
import { getOutdatedPackages } from './getOutdatedPackages'
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

  for (const outdatedPackage of outdatedPackages) {
    console.debug({ outdatedPackage })

    const branchName = createBranchName(outdatedPackage)
    console.debug({ branchName })

    if (remoteBranchNames.includes(branchName)) {
      console.log(`${branchName} branch already exists on ${gitRepo.url}`)
      continue
    }

    await git.createBranch(branchName)

    // TODO: update packages

    // TODO: commit & push

    // TODO: create PR

    // TODO: remove branch
  }
}
