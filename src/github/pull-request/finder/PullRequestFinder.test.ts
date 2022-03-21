import type { PullRequest } from '../../GitHub'
import { PullRequestFinder } from './PullRequestFinder'

describe('PullRequestFinder', () => {
  describe('findByPackageName', () => {
    it('returns pull requests for specified package', () => {
      const expected = [
        {
          labels: [
            {
              name: 'npm-update-package'
            }
          ],
          body: `<div id="npm-update-package-metadata">
    
    \`\`\`json
    {
    "version": "1.0.0",
    "packages": [
      {
        "name": "@npm-update-package/foo",
        "currentVersion": "1.0.0",
        "newVersion": "2.0.0",
        "level": "major"
      }
    ]
    }
    \`\`\`
    
    </div>`
        }
      ] as unknown as PullRequest[]
      const pullRequests = [
        ...expected,
        {
          labels: [
            {
              name: 'npm-update-package'
            }
          ],
          body: `<div id="npm-update-package-metadata">
  
  \`\`\`json
  {
    "version": "1.0.0",
    "packages": [
      {
        "name": "@npm-update-package/bar",
        "currentVersion": "1.0.0",
        "newVersion": "2.0.0",
        "level": "major"
      }
    ]
  }
  \`\`\`
  
  </div>`
        },
        {
          labels: [
            {
              name: 'npm-update-package'
            }
          ],
          body: ''
        },
        {
          labels: [
            {
              name: 'npm-update-package'
            }
          ],
          body: null
        },
        {
          labels: [],
          body: null
        }
      ] as unknown as PullRequest[]
      const pullRequestFinder = new PullRequestFinder(pullRequests)

      const actual = pullRequestFinder.findByPackageName('@npm-update-package/foo')

      expect(actual).toEqual(expected)
    })
  })
})
