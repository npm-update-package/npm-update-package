import { isPullRequestMetadata, PullRequestMetadata } from './PullRequestMetadata'

export const extractPullRequestMetadata = (pullRequestBody: string): PullRequestMetadata => {
  const matched = pullRequestBody.match(/<div id="npm-update-package-metadata">\s*```json\s*([\s\S]+?)\s*```\s*<\/div>/)
  const json = matched?.[1]

  if (json === undefined) {
    throw new Error(`Failed to parse pull request body. pullRequestBody=${pullRequestBody}`)
  }

  const metadata: unknown = JSON.parse(json)

  if (!isPullRequestMetadata(metadata)) {
    throw new Error(`Failed to parse pull request body. pullRequestBody=${pullRequestBody}`)
  }

  return metadata
}
