import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { DependencyType } from '../../../package-json/DependencyType.js'
import { SemVer } from '../../../semver/SemVer.js'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'
import { PullRequestTitleCreator } from './PullRequestTitleCreator.js'

await describe('PullRequestTitleCreator', async () => {
  await describe('create', async () => {
    await it('returns pull request title', () => {
      const pullRequestTitleCreator = new PullRequestTitleCreator('chore({{{dependencyType}}}): {{{level}}} update {{{packageName}}} from {{{currentVersion}}} to v{{{newVersion}}}')

      const actual = pullRequestTitleCreator.create({
        name: '@npm-update-package/example',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('2.0.0'),
        level: SemVerLevel.Major,
        dependencyType: DependencyType.Dependencies
      })

      assert.strictEqual(actual, 'chore(dependencies): major update @npm-update-package/example from 1.0.0 to v2.0.0')
    })
  })
})
