import type { GitRepository } from './values'
import { GitHub } from './GitHub'
import { createOctokit } from './createOctokit'

// TODO: add test
export const createGitHub = (repository: GitRepository): GitHub => {
  const octokit = createOctokit(repository)
  return new GitHub(octokit)
}
