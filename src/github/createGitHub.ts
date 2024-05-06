import { createOctokit } from './createOctokit.js'
import { GitHub } from './GitHub.js'

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
