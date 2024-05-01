import type { PullRequestMetadata } from './PullRequestMetadata.js'
import { isPullRequestMetadata } from './PullRequestMetadata.js'

export const extractPullRequestMetadata = (pullRequestBody: string): PullRequestMetadata | undefined => {
  const matched = pullRequestBody.match(/<div id="npm-update-package-metadata">\s*```json\s*([\S\s]+?)\s*```\s*<\/div>/)

  if (matched === null) {
    return undefined
  }

  const json = matched[1]

  /* istanbul ignore if: I can't write a test to reach here. */
  if (json === undefined) {
    return undefined
  }

  const metadata: unknown = JSON.parse(json)

  if (!isPullRequestMetadata(metadata)) {
    return undefined
  }

  return metadata
}
