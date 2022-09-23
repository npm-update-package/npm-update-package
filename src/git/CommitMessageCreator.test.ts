import { describe, expect, it } from '@jest/globals'
import { DependencyType } from '../package-json'
import { SemVer, SemVerLevel } from '../semver'
import { CommitMessageCreator } from './CommitMessageCreator'

describe('CommitMessageCreator', () => {
  describe('create', () => {
    const commitMessageCreator = new CommitMessageCreator('chore({{{dependencyType}}}): {{{level}}} update {{{packageName}}} from {{{currentVersion}}} to v{{{newVersion}}}')

    it('returns commit message', () => {
      const actual = commitMessageCreator.create({
        name: '@npm-update-package/example',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('2.0.0'),
        level: SemVerLevel.Major,
        dependencyType: DependencyType.Dependencies
      })

      expect(actual).toBe('chore(dependencies): major update @npm-update-package/example from 1.0.0 to v2.0.0')
    })
  })
})
