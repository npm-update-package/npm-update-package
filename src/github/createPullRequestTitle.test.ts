import { UpdateType } from '../enums'
import { PackageVersion } from '../values'
import { createPullRequestTitle } from './createPullRequestTitle'

describe('createPullRequestTitle', () => {
  const currentVersion = PackageVersion.of('1.0.0')

  describe('if update type is patch', () => {
    it('returns pull request title', () => {
      const actual = createPullRequestTitle({
        name: '@typescript-eslint/eslint-plugin',
        currentVersion,
        newVersion: PackageVersion.of('1.0.1'),
        type: UpdateType.Patch
      })
      expect(actual).toBe('chore(deps): patch update @typescript-eslint/eslint-plugin to v1.0.1')
    })
  })

  describe('if update type is minor', () => {
    it('returns pull request title', () => {
      const actual = createPullRequestTitle({
        name: '@typescript-eslint/eslint-plugin',
        currentVersion,
        newVersion: PackageVersion.of('1.1.0'),
        type: UpdateType.Minor
      })
      expect(actual).toBe('chore(deps): minor update @typescript-eslint/eslint-plugin to v1.1.0')
    })
  })

  describe('if update type is major', () => {
    it('returns pull request title', () => {
      const actual = createPullRequestTitle({
        name: '@typescript-eslint/eslint-plugin',
        currentVersion,
        newVersion: PackageVersion.of('2.0.0'),
        type: UpdateType.Major
      })
      expect(actual).toBe('chore(deps): major update @typescript-eslint/eslint-plugin to v2.0.0')
    })
  })
})
