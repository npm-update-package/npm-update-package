import { logger } from '../logger'

// TODO: create type definition
// eslint-disable-next-line @typescript-eslint/no-var-requires
const parse = require('git-url-parse')

export class GitRepository {
  readonly url: string
  readonly host: string
  readonly owner: string
  readonly name: string

  private constructor ({
    url,
    host,
    owner,
    name
  }: {
    url: string
    host: string
    owner: string
    name: string
  }) {
    this.url = url
    this.host = host
    this.owner = owner
    this.name = name
  }

  static of (url: string): GitRepository {
    const gitUrl = parse(url)
    logger.debug(`gitUrl=${JSON.stringify(gitUrl)}`)
    return new GitRepository({
      url: gitUrl.toString('https'),
      host: gitUrl.resource,
      owner: gitUrl.owner,
      name: gitUrl.name
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
