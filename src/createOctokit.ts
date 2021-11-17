import { Octokit } from '@octokit/rest'
import pkg from '../package.json'
import type { GitRepository } from './GitRepository'

// TODO: add logs using logger
export const createOctokit = (repository: GitRepository): Octokit => {
  if (process.env.GITHUB_TOKEN === undefined) {
    throw new Error('process.env.GITHUB_TOKEN is undefined')
  }

  const auth = `token ${process.env.GITHUB_TOKEN}`
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
