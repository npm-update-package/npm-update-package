import { parseHTML } from '../../../html/parseHTML.js'
import { parseMarkdown } from '../../../markdown/parseMarkdown.js'
import type { PullRequestMetadata } from './PullRequestMetadata.js'
import { isPullRequestMetadata } from './PullRequestMetadata.js'

export const extractPullRequestMetadata = (pullRequestBody: string): PullRequestMetadata | undefined => {
  const html = parseMarkdown(pullRequestBody)
  const document = parseHTML(html)
  const jsonElement = document.querySelector('#npm-update-package-metadata code')
  const json = jsonElement?.textContent ?? undefined

  if (json === undefined) {
    return undefined
  }

  const metadata: unknown = JSON.parse(json)

  if (isPullRequestMetadata(metadata)) {
    return metadata
  }
}
