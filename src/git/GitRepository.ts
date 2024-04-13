import { URL } from 'node:url'
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

  /**
   * Parses a repository string.
   * @example Valid strings
   * - `<owner>/<repo>`
   * - `github:<owner>/<repo>`
   * - `https://<host>/<owner>/<repo>`
   * - `https://<host>/<owner>/<repo>.git`
   * - `git://<host>/<owner>/<repo>`
   * - `git://<host>/<owner>/<repo>.git`
   * - `git+https://<host>/<owner>/<repo>`
   * - `git+https://<host>/<owner>/<repo>.git`
   * - `git+ssh://<host>/<owner>/<repo>`
   * - `git+ssh://<host>/<owner>/<repo>.git`
   * - `git@<host>:<owner>/<repo>`
   * - `git@<host>:<owner>/<repo>.git`
   */
  static of (repository: string): GitRepository | undefined {
    const result = gh(repository)

    if (result === null) {
      return undefined
    }

    const {
      protocol,
      owner,
      name
    } = result

    if (owner === null || name === null) {
      return undefined
    }

    const host = protocol === 'github:' ? HOST_GITHUB : result.host

    if (host === null) {
      return undefined
    }

    if (!host.includes('.')) {
      return undefined
    }

    return new GitRepository({
      url: new URL(`https://${host}/${owner}/${name}`),
      owner,
      name,
      isGitHub: host === HOST_GITHUB
    })
  }
}
