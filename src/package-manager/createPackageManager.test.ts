import { Terminal } from '../terminal'
import { createPackageManager } from './createPackageManager'
import { Npm } from './Npm'
import { PackageManagerName } from './PackageManagerName'
import { Yarn } from './Yarn'

describe('createPackageManager', () => {
  const terminal = new Terminal()

  it(`returns new Npm instance if packageManager is ${PackageManagerName.Npm}`, () => {
    const packageManager = createPackageManager({
      terminal,
      packageManager: PackageManagerName.Npm
    })

    expect(packageManager).toBeInstanceOf(Npm)
  })

  it(`returns new Yarn instance if packageManager is ${PackageManagerName.Yarn}`, () => {
    const packageManager = createPackageManager({
      terminal,
      packageManager: PackageManagerName.Yarn
    })

    expect(packageManager).toBeInstanceOf(Yarn)
  })
})
