import { LogLevel } from '../logger'
import { PackageManagerName } from '../package-manager'
import {
  isOptions,
  type Options
} from './Options'

describe('isOptions', () => {
  const options: Options = {
    commitMessage: 'test commitMessage',
    githubToken: 'test githubToken',
    logLevel: LogLevel.Info,
    packageManager: PackageManagerName.Npm,
    prTitle: 'test prTitle',
    ignorePackages: ['@npm-update-package/example'],
    prBodyNotes: 'test prBodyNotes',
    reviewers: ['npm-update-package-bot']
  }

  it('returns true if value is Options', () => {
    expect(isOptions(options)).toBe(true)
  })

  it('returns false if value is not Options', () => {
    expect(isOptions(JSON.stringify(options))).toBe(false)
  })
})
