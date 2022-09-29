import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { Options } from '../options'
import { Terminal } from '../terminal'
import { detectPackageManager } from './detectPackageManager'
import { Npm } from './npm'
import { PackageManagerCreator } from './PackageManagerCreator'
import { PackageManagerName } from './PackageManagerName'
import { Yarn } from './yarn'

jest.mock('./detectPackageManager')

describe('PackageManagerCreator', () => {
  describe('create', () => {
    const detectPackageManagerMock = jest.mocked(detectPackageManager)
    const terminal = new Terminal()

    afterEach(() => {
      jest.resetAllMocks()
    })

    describe('returns new PackageManager instance if packageManager option exists', () => {
      it.each([
        [PackageManagerName.Npm, Npm],
        [PackageManagerName.Yarn, Yarn]
      ])('packageManager=%p', async (packageManager, expected) => {
        const options = {
          packageManager
        }
        const packageManagerCreator = new PackageManagerCreator(options as Options)

        const actual = await packageManagerCreator.create(terminal)

        expect(actual).toBeInstanceOf(expected)
        expect(detectPackageManagerMock).not.toHaveBeenCalled()
      })
    })

    describe('returns new PackageManager instance if packageManager option does not exist', () => {
      it.each([
        [PackageManagerName.Npm, Npm],
        [PackageManagerName.Yarn, Yarn]
      ])('packageManager=%p', async (packageManager, expected) => {
        detectPackageManagerMock.mockResolvedValue(packageManager)
        const options = {}
        const packageManagerCreator = new PackageManagerCreator(options as Options)

        const actual = await packageManagerCreator.create(terminal)

        expect(actual).toBeInstanceOf(expected)
        expect(detectPackageManagerMock).toHaveBeenCalledWith()
      })
    })
  })
})
