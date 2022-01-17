import { extractPullRequestMetadata } from './extractPullRequestMetadata'

describe('extractPullRequestMetadata', () => {
  it('returns PullRequestMetadata if body contains metadata', () => {
    const body = `<div id="npm-update-package-metadata">

\`\`\`json
{
  "version": "1.0.0",
  "packages": [
    {
      "name": "@npm-update-package/example",
      "level": "major",
      "currentVersion": "1.0.0",
      "newVersion": "2.0.0"
    }
  ]
}
\`\`\`

</div>`
    const metadata = extractPullRequestMetadata(body)
    expect(metadata).toEqual({
      version: '1.0.0',
      packages: [
        {
          name: '@npm-update-package/example',
          level: 'major',
          currentVersion: '1.0.0',
          newVersion: '2.0.0'
        }
      ]
    })
  })

  it('returns undefined if body does not contain metadata', () => {
    const body = ''
    const metadata = extractPullRequestMetadata(body)
    expect(metadata).toBeUndefined()
  })

  it('returns undefined if metadata is invalid', () => {
    const body = `<div id="npm-update-package-metadata">

\`\`\`json
{}
\`\`\`

</div>`
    const metadata = extractPullRequestMetadata(body)
    expect(metadata).toBeUndefined()
  })
})
