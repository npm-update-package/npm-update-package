import { Octokit } from '@octokit/rest'
import * as app from '../app.js'

export const createOctokit = ({
  host,
  token
}: {
  host: string
  token?: string
}): Octokit => {
  const userAgent = `${app.name}/${app.version}`

  if (token === undefined) {
    return new Octokit({
      userAgent
    })
  }

  const auth = `token ${token}`

  if (host === 'github.com') {
    return new Octokit({
      auth,
      userAgent
    })
  }

  return new Octokit({
    auth,
    userAgent,
    baseUrl: `https://${host}/api/v3`
  })
}
