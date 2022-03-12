import { optimizeGitHubUrl } from './optimizeGitHubUrl'

describe('optimizeGitHubUrl', () => {
  describe('returns optimized URL', () => {
    type TestCase = [string, string]
    const cases: TestCase[] = [
      ['https://github.com/foo/', 'https://togithub.com/foo/'],
      ['https://foo.github.com/bar/', 'https://foo.github.com/bar/'],
      ['https://test-github.com/foo/', 'https://test-github.com/foo/'],
      ['https://github.com.test/foo/', 'https://github.com.test/foo/']
    ]

    it.each<TestCase>(cases)('url=%p', (url, expected) => {
      const actual = optimizeGitHubUrl(url)

      expect(actual).toBe(expected)
    })
  })
})
