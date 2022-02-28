import { createOctokit } from './createOctokit'
import { GitHub } from './GitHub'

export const createGitHub = ({
  host,
  token
}: {
  host: string
  token?: string
}): GitHub => {
  const octokit = createOctokit({
    host,
    token
  })
  return new GitHub(octokit)
}
