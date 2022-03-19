import { URL } from 'url'
import parse from 'parse-github-url'

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
    const parsed = parse(repository)

    if (parsed === null) {
      throw new Error(`Failed to parse repository. repository=${repository}`)
    }

    const {
      owner,
      name
    } = parsed

    if (owner === null || name === null) {
      throw new Error(`Failed to parse repository. repository=${repository}`)
    }

    const { protocol } = parsed

    if (protocol === 'github:') {
      return new GitRepository({
        url: new URL(`https://github.com/${owner}/${name}`),
        owner,
        name
      })
    }

    const { host } = parsed

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
