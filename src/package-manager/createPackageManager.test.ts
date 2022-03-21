import { Terminal } from '../terminal'
import { createPackageManager } from './createPackageManager'
import { Npm } from './Npm'
import { PackageManagerName } from './PackageManagerName'
import { Yarn } from './Yarn'

describe('createPackageManager', () => {
  const terminal = new Terminal()

  describe('returns new PackageManager instance', () => {
    type TestCase = [PackageManagerName, typeof Npm | typeof Yarn]
    const cases: TestCase[] = [
      [PackageManagerName.Npm, Npm],
      [PackageManagerName.Yarn, Yarn]
    ]

    it.each(cases)('packageManager=%p', (packageManager, expected) => {
      const actual = createPackageManager({
        terminal,
        packageManager
      })

      expect(actual).toBeInstanceOf(expected)
    })
  })
})
