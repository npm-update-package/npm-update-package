import type { PullRequest } from '../../PullRequest'

export const isPullRequestByNpmUpdatePackage = (pullRequest: PullRequest): boolean => {
  return pullRequest.labels.some(({ name }) => name === 'npm-update-package')
}
