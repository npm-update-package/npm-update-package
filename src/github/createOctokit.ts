import { Octokit } from '@octokit/rest'
import pkg from '../../package.json'
import type { GitRepository } from '../git'

// TODO: Replace repository with host
export const createOctokit = ({
  repository,
  token
}: {
  repository: GitRepository
  token: string
}): Octokit => {
  const { host } = repository.url
  const auth = `token ${token}`
  const userAgent = `${pkg.name}/${pkg.version}`

  if (host === 'github.com') {
    return new Octokit({
      auth,
      userAgent
    })
  } else {
    return new Octokit({
      auth,
      userAgent,
      baseUrl: `https://${host}/api/v3`
    })
  }
}
