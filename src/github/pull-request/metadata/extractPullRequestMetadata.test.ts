import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import { extractPullRequestMetadata } from './extractPullRequestMetadata.js'

await describe('extractPullRequestMetadata', async () => {
  await it('returns PullRequestMetadata if body contains metadata', () => {
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

    assert.deepStrictEqual(actual, {
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

  await describe('returns undefined if body does not contain metadata', async () => {
    const inputs: string[] = [
      '',
      `<div id="npm-update-package-metadata">

\`\`\`json
{}
\`\`\`

</div>`
    ]
    each(inputs, ({ title }, body) => {
      void it(title, () => {
        const actual = extractPullRequestMetadata(body)

        assert.strictEqual(actual, undefined)
      })
    })
  })
})
