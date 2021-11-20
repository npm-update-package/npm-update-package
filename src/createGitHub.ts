import type { GitRepository } from './values/GitRepository'
import { GitHub } from './GitHub'
import { createOctokit } from './createOctokit'

// TODO: add test
// TODO: add logs using logger
export const createGitHub = (repository: GitRepository): GitHub => {
  const octokit = createOctokit(repository)
  return new GitHub(octokit)
}
