import { DependencyType } from '../package-json'
import {
  SemVer,
  SemVerLevel
} from '../semver'
import { createBranchName } from './createBranchName'

describe('createBranchName', () => {
  it('returns branch name', () => {
    const actual = createBranchName({
      name: '@npm-update-package/example',
      currentVersion: SemVer.of('1.0.0'),
      newVersion: SemVer.of('1.2.3'),
      level: SemVerLevel.Major,
      dependencyType: DependencyType.Dependencies
    })
    expect(actual).toBe('npm-update-package/@npm-update-package/example/v1.2.3')
  })
})
