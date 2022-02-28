import { Octokit } from '@octokit/rest'
import pkg from '../../package.json'

export const createOctokit = ({
  host,
  token
}: {
  host: string
  token: string
}): Octokit => {
  const auth = `token ${token}`
  const userAgent = `${pkg.name}/${pkg.version}`

  if (host === 'github.com') {
    return new Octokit({
      auth,
      userAgent
    })
  } else {
    return new Octokit({
      auth,
      userAgent,
      baseUrl: `https://${host}/api/v3`
    })
  }
}
