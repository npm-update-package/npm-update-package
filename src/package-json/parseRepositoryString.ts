export const parseRepositoryString = (repository: string): {
  owner: string
  repo: string
  isGitHub: boolean
} => {
  const matched = repository.match(/^((.+):)?(.+)\/(.+)/)

  if (matched === null) {
    throw new Error(`Failed to parse repository. repository=${repository}`)
  }

  const [, , type, owner, repo] = matched

  /* istanbul ignore if: I can't write a test to reach here. */
  if (owner === undefined || repo === undefined) {
    throw new Error(`Failed to parse repository. repository=${repository}`)
  }

  return {
    owner,
    repo,
    isGitHub: type === undefined || type === 'github'
  }
}
