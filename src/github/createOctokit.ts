import { Octokit } from '@octokit/rest'
import pkg from '../../package.json'
import type { GitRepository } from '../git'
import { logger } from '../logger'

// TODO: add test
export const createOctokit = (repository: GitRepository): Octokit => {
  // TODO replace environments with options
  if (process.env.GITHUB_TOKEN === undefined) {
    throw new Error('process.env.GITHUB_TOKEN is undefined')
  }

  const auth = `token ${process.env.GITHUB_TOKEN}`
  const userAgent = `${pkg.name}/${pkg.version}`
  logger.debug(`userAgent=${userAgent}`)

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
