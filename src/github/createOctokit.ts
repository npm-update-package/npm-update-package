import { Octokit } from '@octokit/rest'
import pkg from '../../package.json'
import type { GitRepository } from '../git'

export const createOctokit = ({
  repository,
  token
}: {
  repository: GitRepository
  token: string
}): Octokit => {
  const auth = `token ${token}`
  const userAgent = `${pkg.name}/${pkg.version}`

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
