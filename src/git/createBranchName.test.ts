import { SemVer } from '../semver'
import { createBranchName } from './createBranchName'

describe('createBranchName', () => {
  it('returns branch name', () => {
    const actual = createBranchName({
      name: '@typescript-eslint/eslint-plugin',
      currentVersion: SemVer.of('1.0.0'),
      newVersion: SemVer.of('1.2.3'),
      type: 'major'
    })
    expect(actual).toBe('npm-update-package/@typescript-eslint/eslint-plugin/v1.2.3')
  })
})
