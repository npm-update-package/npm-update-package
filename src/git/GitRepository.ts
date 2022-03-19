import { URL } from 'url'
import gh from 'parse-github-url'

const HOST_GITHUB = 'github.com'

export class GitRepository {
  readonly url: URL
  readonly owner: string
  readonly name: string
  readonly isGitHub: boolean

  private constructor ({
    url,
    owner,
    name,
    isGitHub
  }: {
    url: URL
    owner: string
    name: string
    isGitHub: boolean
  }) {
    this.url = url
    this.owner = owner
    this.name = name
    this.isGitHub = isGitHub
  }

  static of (repository: string): GitRepository {
    const result = gh(repository)

    if (result === null) {
      throw new Error(`Failed to parse repository. repository=${repository}`)
    }

    const {
      owner,
      name
    } = result

    if (owner === null || name === null) {
      throw new Error(`Failed to parse repository. repository=${repository}`)
    }

    const host = result.protocol === 'github:' ? HOST_GITHUB : result.host

    if (host === null || !host.includes('.')) {
      throw new Error(`Failed to parse repository. repository=${repository}`)
    }

    return new GitRepository({
      url: new URL(`https://${host}/${owner}/${name}`),
      owner,
      name,
      isGitHub: host === HOST_GITHUB
    })
  }
}
