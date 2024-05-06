import { GitRepository } from '../git/GitRepository.js'
import type { PackageMetadata } from './PackageMetadata.js'

export const extractRepository = (pkg: PackageMetadata): GitRepository | undefined => {
  const { repository } = pkg

  if (repository === undefined) {
    return undefined
  }

  const repositoryString = typeof repository === 'string' ? repository : repository.url
  return GitRepository.of(repositoryString)
}
