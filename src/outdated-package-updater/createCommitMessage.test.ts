import { PackageVersion } from '../values'
import { createCommitMessage } from './createCommitMessage'

describe('createCommitMessage', () => {
  it('returns commit message', () => {
    const actual = createCommitMessage({
      name: 'package-name',
      currentVersion: PackageVersion.of('1.0.0'),
      newVersion: PackageVersion.of('1.2.3')
    })
    expect(actual).toBe('chore(deps): update package-name to v1.2.3')
  })
})
