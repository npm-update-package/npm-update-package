import { isPullRequestMetadata, PullRequestMetadata } from './PullRequestMetadata'

export const extractPullRequestMetadata = (pullRequestBody: string): PullRequestMetadata | undefined => {
  const matched = pullRequestBody.match(/<div id="npm-update-package-metadata">\s*```json\s*([\s\S]+?)\s*```\s*<\/div>/)
  const json = matched?.[1]

  if (json === undefined) {
    return undefined
  }

  const metadata: unknown = JSON.parse(json)

  if (!isPullRequestMetadata(metadata)) {
    return undefined
  }

  return metadata
}
