import { PackageVersion } from '../ncu'
import { BranchNameCreator } from './BranchNameCreator'

describe('BranchNameCreator', () => {
  describe('create', () => {
    it('returns branch name', () => {
      const branchNameCreator = new BranchNameCreator('npm-update-package/{{{packageName}}}/{{updateType}}/{{currentVersion}}/{{newVersion}}')
      const actual = branchNameCreator.create({
        name: '@typescript-eslint/eslint-plugin',
        currentVersion: PackageVersion.of('1.0.0'),
        newVersion: PackageVersion.of('1.2.3'),
        type: 'major'
      })
      expect(actual).toBe('npm-update-package/@typescript-eslint/eslint-plugin/major/1.0.0/1.2.3')
    })
  })
})
