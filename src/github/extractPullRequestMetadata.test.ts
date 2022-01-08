import { extractPullRequestMetadata } from './extractPullRequestMetadata'

describe('extractPullRequestMetadata', () => {
  it('returns parsed metadata if body contains metadata', () => {
    const body = `<div id="npm-update-package-metadata">

\`\`\`json
{
  "version": "1.0.0",
  "packages": [
    {
      "name": "@typescript-eslint/eslint-plugin",
      "type": "major",
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
          name: '@typescript-eslint/eslint-plugin',
          type: 'major',
          currentVersion: '1.0.0',
          newVersion: '2.0.0'
        }
      ]
    })
  })

  it('throws error if body does not contain metadata', () => {
    const body = ''
    expect(() => extractPullRequestMetadata(body)).toThrow(Error)
  })

  it('throws error if metadata is invalid', () => {
    const body = `<div id="npm-update-package-metadata">

\`\`\`json
{}
\`\`\`

</div>`
    expect(() => extractPullRequestMetadata(body)).toThrow(Error)
  })
})
