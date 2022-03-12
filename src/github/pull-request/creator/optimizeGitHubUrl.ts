import { URL } from 'url'

// TODO: Add test
export const optimizeGitHubUrl = (url: string): string => {
  const newUrl = new URL(url)

  // NOTE: Prevent linking to other repositories.
  if (newUrl.host === 'github.com') {
    newUrl.host = 'togithub.com'
  }

  return newUrl.toString()
}
