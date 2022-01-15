import { SemVer } from '../semver'
import { CommitMessageCreator } from './CommitMessageCreator'

describe('CommitMessageCreator', () => {
  describe('create', () => {
    it('returns commit message', () => {
      const commitMessageCreator = new CommitMessageCreator('chore(deps): {{updateType}} update {{{packageName}}} from {{currentVersion}} to v{{newVersion}}')
      const actual = commitMessageCreator.create({
        name: '@typescript-eslint/eslint-plugin',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('2.0.0'),
        level: 'major'
      })
      expect(actual).toBe('chore(deps): major update @typescript-eslint/eslint-plugin from 1.0.0 to v2.0.0')
    })
  })
})
