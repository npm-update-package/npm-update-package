import parse from 'parse-github-url'

export class GitRepository {
  readonly host: string
  readonly owner: string
  readonly name: string

  private constructor ({
    host,
    owner,
    name
  }: {
    host: string
    owner: string
    name: string
  }) {
    this.host = host
    this.owner = owner
    this.name = name
  }

  static of (url: string): GitRepository {
    const parsed = parse(url)

    if (parsed === null) {
      throw new Error(`Failed to parse url. url=${url}`)
    }

    const {
      host,
      owner,
      name
    } = parsed

    if (host === null || owner === null || name === null) {
      throw new Error(`Failed to parse url. url=${url}`)
    }

    return new GitRepository({
      host,
      owner,
      name
    })
  }

  get apiEndPoint (): string {
    if (this.isGitHubDotCom) {
      return 'https://api.github.com'
    } else {
      return `https://${this.host}/api/v3`
    }
  }

  get isGitHubDotCom (): boolean {
    return this.host === 'github.com'
  }
}
