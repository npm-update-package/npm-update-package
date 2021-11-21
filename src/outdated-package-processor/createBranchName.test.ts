import { PackageVersion } from '../values'
import { createBranchName } from './createBranchName'

describe('createBranchName', () => {
  it('returns branch name', () => {
    const actual = createBranchName({
      name: '@typescript-eslint/eslint-plugin',
      currentVersion: PackageVersion.of('1.0.0'),
      newVersion: PackageVersion.of('1.2.3'),
      type: 'major'
    })
    expect(actual).toBe('npm-update-package/@typescript-eslint/eslint-plugin/v1.2.3')
  })
})
