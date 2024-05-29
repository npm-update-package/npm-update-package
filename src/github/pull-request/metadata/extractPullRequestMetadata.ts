import type { PullRequestMetadata } from './PullRequestMetadata.js'
import { isPullRequestMetadata } from './PullRequestMetadata.js'

export const extractPullRequestMetadata = (pullRequestBody: string): PullRequestMetadata | undefined => {
  const json = pullRequestBody.match(/<div id="npm-update-package-metadata">\n+```json\n(.+)\n```\n+<\/div>/s)?.[1]

  if (json === undefined) {
    return undefined
  }

  const metadata: unknown = JSON.parse(json)

  if (isPullRequestMetadata(metadata)) {
    return metadata
  }
}
