import { GitRepository } from '../git'
import type { PackageMetadata } from './PackageMetadata'
import { parseRepositoryString } from './parseRepositoryString'

export const extractRepository = ({
  repository
}: PackageMetadata): GitRepository | undefined => {
  if (repository === undefined) {
    return undefined
  }

  if (typeof repository === 'string') {
    const {
      owner,
      repo,
      isGitHub
    } = parseRepositoryString(repository)

    if (!isGitHub) {
      return undefined
    }

    return GitRepository.of(`${owner}/${repo}`)
  }

  const { url } = repository
  return GitRepository.of(url.replace(/^git\+/, ''))
}
