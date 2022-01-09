import { PackageVersion } from '../ncu'
import { BranchNameCreator } from './BranchNameCreator'

describe('BranchNameCreator', () => {
  describe('create', () => {
    it('returns branch name', () => {
      const branchNameCreator = new BranchNameCreator()
      const actual = branchNameCreator.create({
        name: '@typescript-eslint/eslint-plugin',
        currentVersion: PackageVersion.of('1.0.0'),
        newVersion: PackageVersion.of('1.2.3'),
        type: 'major'
      })
      expect(actual).toBe('npm-update-package/@typescript-eslint/eslint-plugin/v1.2.3')
    })
  })
})
