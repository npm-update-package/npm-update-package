import { URL } from 'url'

const TOGITHUB_DOMAIN = 'togithub.com'

/**
 * Convert URL to prevent linking to other repositories.
 */
export const optimizeGitHubUrl = (url: string): string => {
  const newUrl = new URL(url)
  newUrl.host = newUrl.host.replace(/^(.+\.)?github\.com$/, (_matched, subDomain) => {
    return typeof subDomain === 'string' ? `${subDomain}${TOGITHUB_DOMAIN}` : TOGITHUB_DOMAIN
  })
  return newUrl.toString()
}
