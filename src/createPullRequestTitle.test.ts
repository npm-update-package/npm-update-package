import { PackageVersion } from './values/PackageVersion'
import { createPullRequestTitle } from './createPullRequestTitle'

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
