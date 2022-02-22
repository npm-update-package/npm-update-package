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
      protocol,
      host,
      owner,
      name
    } = parsed

    if (host === null || owner === null || name === null) {
      throw new Error(`Failed to parse repository. repository=${repository}`)
    }

    return new GitRepository({
      url: new URL(`${protocol ?? 'https:'}//${host}/${owner}/${name}`),
      owner,
      name
    })
  }

  get apiEndPoint (): string {
    if (this.isGitHubDotCom) {
      return 'https://api.github.com'
    } else {
      return `https://${this.url.host}/api/v3`
    }
  }

  get isGitHubDotCom (): boolean {
    return this.url.host === 'github.com'
  }
}
