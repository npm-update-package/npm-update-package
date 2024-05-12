// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
import { DependencyType } from '../package-json/DependencyType.js'
import { SemVer } from '../semver/SemVer.js'
import { SemVerLevel } from '../semver/SemVerLevel.js'
import { CommitMessageCreator } from './CommitMessageCreator.js'

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
