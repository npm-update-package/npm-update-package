import type { PullRequest } from './PullRequest'

export const isPullRequestByNpmUpdatePackage = (pullRequest: PullRequest): boolean => {
  return pullRequest.labels.map(({ name }) => name).includes('npm-update-package')
}
