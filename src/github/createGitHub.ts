import type { GitRepository } from '../git'
import { createOctokit } from './createOctokit'
import { GitHub } from './GitHub'

// TODO: Replace repository with host
export const createGitHub = ({
  repository,
  token
}: {
  repository: GitRepository
  token: string
}): GitHub => {
  const octokit = createOctokit({
    repository,
    token
  })
  return new GitHub(octokit)
}
