import { Release } from '../../releases'
import { optimizeGitHubUrl } from './optimizeGitHubUrl'

export const createReleaseNotesSection = (releases: Release[]): string => {
  const items = releases.map(({
    tag,
    url
  }) => {
    const optimizedUrl = optimizeGitHubUrl(url).toString()
    return `- [${tag}](${optimizedUrl})`
  })
  return `## Release notes

${items.join('\n')}`
}
