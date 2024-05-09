import { Octokit } from '@octokit/rest'
import { createRequirePackageJSON } from '../util/createRequirePackageJSON.js'

const requirePackageJSON = createRequirePackageJSON(import.meta.url)
const pkg = requirePackageJSON('../../package.json')

export const createOctokit = ({
  host,
  token
}: {
  host: string
  token?: string
}): Octokit => {
  const userAgent = `${pkg.name}/${pkg.version}`

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
