// TODO: Replace Jest with Node.js's test runner

import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { Options } from '../options/Options.js'
import type { Terminal } from '../terminal/Terminal.js'
import { detectPackageManager } from './detectPackageManager.js'
import { Npm } from './npm/Npm.js'
import { PackageManagerCreator } from './PackageManagerCreator.js'
import { PackageManagerName } from './PackageManagerName.js'
import { Yarn } from './yarn/Yarn.js'

jest.mock('./detectPackageManager')

describe('PackageManagerCreator', () => {
  describe('create', () => {
    const detectPackageManagerMock = jest.mocked(detectPackageManager)
    const terminal = {} as unknown as Terminal

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
