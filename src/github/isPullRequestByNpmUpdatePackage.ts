import type { PullRequest } from './PullRequest'

// TODO: Add test
export const isPullRequestByNpmUpdatePackage = (pullRequest: PullRequest): boolean => {
  return pullRequest.labels.map(({ name }) => name).includes('npm-update-package')
}
