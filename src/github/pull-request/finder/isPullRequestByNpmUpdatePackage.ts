import type { PullRequest } from '../../GitHub.js'

export const isPullRequestByNpmUpdatePackage = (pullRequest: PullRequest): boolean => {
  return pullRequest.labels.some(({ name }) => name === 'npm-update-package')
}
