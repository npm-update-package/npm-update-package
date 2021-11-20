import type { GitRepository } from '../git'
import { createOctokit } from './createOctokit'
import { GitHub } from './GitHub'

// TODO: add test
export const createGitHub = (repository: GitRepository): GitHub => {
  const octokit = createOctokit(repository)
  return new GitHub(octokit)
}
