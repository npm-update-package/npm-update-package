import {
  describe,
  expect,
  it
} from '@jest/globals'
import { extractPullRequestMetadata } from './extractPullRequestMetadata.js'

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

    const actual = extractPullRequestMetadata(body)

    expect(actual).toEqual({
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

  describe('returns undefined if body does not contain metadata', () => {
    type TestCase = string
    const cases: TestCase[] = [
      '',
      `<div id="npm-update-package-metadata">

\`\`\`json
{}
\`\`\`

</div>`
    ]

    it.each(cases)('body=%p', (body) => {
      const actual = extractPullRequestMetadata(body)

      expect(actual).toBeUndefined()
    })
  })
})
