import { URL } from 'url'
import { optimizeGitHubUrl } from './optimizeGitHubUrl'

describe('optimizeGitHubUrl', () => {
  describe('returns optimized URL', () => {
    type TestCase = [string | URL, URL]
    const cases: TestCase[] = [
      ['https://github.com/foo/', new URL('https://togithub.com/foo/')],
      [new URL('https://github.com/foo/'), new URL('https://togithub.com/foo/')],
      ['https://foo.github.com/bar/', new URL('https://foo.github.com/bar/')],
      [new URL('https://foo.github.com/bar/'), new URL('https://foo.github.com/bar/')],
      ['https://test-github.com/foo/', new URL('https://test-github.com/foo/')],
      [new URL('https://test-github.com/foo/'), new URL('https://test-github.com/foo/')],
      ['https://github.com.test/foo/', new URL('https://github.com.test/foo/')],
      [new URL('https://github.com.test/foo/'), new URL('https://github.com.test/foo/')]
    ]

    it.each(cases)('url=%p', (url, expected) => {
      const actual = optimizeGitHubUrl(url)

      expect(actual).toEqual(expected)
    })
  })
})
