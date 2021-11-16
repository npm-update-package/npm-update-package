import { createPullRequestTitle } from './createPullRequestTitle'
import { PackageVersion } from './PackageVersion'

describe('createPullRequestTitle', () => {
  it('returns pull request title', () => {
    const actual = createPullRequestTitle({
      name: 'package-name',
      currentVersion: PackageVersion.of('1.0.0'),
      newVersion: PackageVersion.of('1.2.3')
    })
    expect(actual).toBe('chore(deps): update dependency package-name to v1.2.3')
  })
})
