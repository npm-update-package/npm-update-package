import { Octokit } from '@octokit/rest'
import { app } from '../app'
import type { GitRepository } from '../git'

// TODO: add test
export const createOctokit = ({
  repository,
  token
}: {
  repository: GitRepository
  token: string
}): Octokit => {
  const auth = `token ${token}`
  const userAgent = `${app.name}/${app.version}`

  if (repository.isGitHubDotCom) {
    return new Octokit({
      auth,
      userAgent
    })
  } else {
    return new Octokit({
      auth,
      userAgent,
      baseUrl: repository.apiEndPoint
    })
  }
}
