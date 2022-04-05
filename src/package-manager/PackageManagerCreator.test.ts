import {
  createLogger,
  LogLevel
} from '../logger'
import type { Options } from '../options'
import { Terminal } from '../terminal'
import { detectPackageManager } from './detectPackageManager'
import { Npm } from './npm/Npm'
import { PackageManagerCreator } from './PackageManagerCreator'
import { PackageManagerName } from './PackageManagerName'
import { Yarn } from './Yarn'

jest.mock('./detectPackageManager')

describe('PackageManagerCreator', () => {
  describe('create', () => {
    const detectPackageManagerMock = jest.mocked(detectPackageManager)
    const logger = createLogger(LogLevel.Off)
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
        } as unknown as Options
        const packageManagerCreator = new PackageManagerCreator({
          options,
          logger
        })

        const actual = await packageManagerCreator.create(terminal)

        expect(actual).toBeInstanceOf(expected)
        expect(detectPackageManagerMock).not.toBeCalled()
      })
    })

    describe('returns new PackageManager instance if packageManager option does not exist', () => {
      it.each([
        [PackageManagerName.Npm, Npm],
        [PackageManagerName.Yarn, Yarn]
      ])('packageManager=%p', async (packageManager, expected) => {
        detectPackageManagerMock.mockResolvedValue(packageManager)
        const options = {} as unknown as Options
        const packageManagerCreator = new PackageManagerCreator({
          options,
          logger
        })

        const actual = await packageManagerCreator.create(terminal)

        expect(actual).toBeInstanceOf(expected)
        expect(detectPackageManagerMock).toBeCalledWith()
      })
    })
  })
})
