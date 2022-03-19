import { GitRepository } from '../git'
import type { PackageMetadata } from './PackageMetadata'

export const extractRepository = ({
  repository
}: PackageMetadata): GitRepository | undefined => {
  if (repository === undefined) {
    return undefined
  }

  const repositoryString = typeof repository === 'string' ? repository : repository.url
  const gitRepo = GitRepository.of(repositoryString)

  if (gitRepo === undefined || !gitRepo.isGitHub) {
    return undefined
  }

  return gitRepo
}
