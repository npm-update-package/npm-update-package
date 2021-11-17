import { GitHub } from './GitHub'
import type { GitRepository } from './GitRepository'
import { createOctokit } from './createOctokit'

// TODO: add logs using logger
export const createGitHub = (repository: GitRepository): GitHub => {
  const octokit = createOctokit(repository)
  return new GitHub(octokit)
}
