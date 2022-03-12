import { URL } from 'url'

/**
 * Convert URL to prevent linking to other repositories.
 */
export const optimizeGitHubUrl = (url: string): string => {
  const newUrl = new URL(url)

  if (newUrl.host === 'github.com') {
    newUrl.host = 'togithub.com'
  }

  return newUrl.toString()
}
