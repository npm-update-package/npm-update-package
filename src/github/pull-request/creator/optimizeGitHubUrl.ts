import { URL } from 'url'

/**
 * Convert URL to prevent linking to other repositories.
 */
export const optimizeGitHubUrl = (url: string | URL): URL => {
  const newUrl = url instanceof URL ? url : new URL(url)

  if (newUrl.host === 'github.com') {
    newUrl.host = 'togithub.com'
  }

  return newUrl
}
