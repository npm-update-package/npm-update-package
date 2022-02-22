import { parseRepositoryString } from './parseRepositoryString'

describe('parseRepositoryString', () => {
  describe('returns object if string is valid', () => {
    type TestCase = [
      string,
      {
        owner: string
        repo: string
        isGitHub: boolean
      }
    ]
    const cases: TestCase[] = [
      [
        'npm-update-package/example',
        {
          owner: 'npm-update-package',
          repo: 'example',
          isGitHub: true
        }
      ],
      [
        'github:npm-update-package/example',
        {
          owner: 'npm-update-package',
          repo: 'example',
          isGitHub: true
        }
      ],
      [
        'gitlab:npm-update-package/example',
        {
          owner: 'npm-update-package',
          repo: 'example',
          isGitHub: false
        }
      ]
    ]

    it.each<TestCase>(cases)('repository=%s', (repository, expected) => {
      expect(parseRepositoryString(repository)).toEqual(expected)
    })
  })

  it('throws error if string is invalid', () => {
    expect(() => parseRepositoryString('npm-update-package:example')).toThrow(Error)
  })
})
