import { URL } from 'url'
import gh from 'parse-github-url'

export class GitRepository {
  readonly url: URL
  readonly owner: string
  readonly name: string

  private constructor ({
    url,
    owner,
    name
  }: {
    url: URL
    owner: string
    name: string
  }) {
    this.url = url
    this.owner = owner
    this.name = name
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

    const { protocol } = result

    if (protocol === 'github:') {
      return new GitRepository({
        url: new URL(`https://github.com/${owner}/${name}`),
        owner,
        name
      })
    }

    const { host } = result

    if (host === null) {
      throw new Error(`Failed to parse repository. repository=${repository}`)
    }

    return new GitRepository({
      url: new URL(`https://${host}/${owner}/${name}`),
      owner,
      name
    })
  }
}
