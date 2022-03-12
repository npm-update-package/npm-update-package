import { URL } from 'url'

// TODO: Add test
export const optimizeUrl = (url: URL): URL => {
  const newUrl = new URL(url.toString())

  // NOTE: Prevent linking to other repositories.
  if (newUrl.host === 'github.com') {
    newUrl.host = 'togithub.com'
  }

  return newUrl
}
