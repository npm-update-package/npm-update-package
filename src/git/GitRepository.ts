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
      host,
      owner,
      name
    } = parsed

    if (host === null || owner === null || name === null) {
      throw new Error(`Failed to parse repository. repository=${repository}`)
    }

    const protocol = parsed.protocol ?? 'https:'
    return new GitRepository({
      url: new URL(`${protocol}//${host}/${owner}/${name}`),
      owner,
      name
    })
  }
}
