import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { canReadWrite } from '../file'
import { detectPackageManager } from './detectPackageManager'
import { PackageManagerName } from './PackageManagerName'

jest.mock('../file')

describe('detectPackageManager', () => {
  const canReadWriteMock = jest.mocked(canReadWrite)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns PackageManagerName.Npm if package-lock.json exists', async () => {
    canReadWriteMock.mockImplementation(async (path) => await Promise.resolve(path === 'package-lock.json'))

    const actual = await detectPackageManager()

    expect(actual).toBe(PackageManagerName.Npm)
    expect(canReadWriteMock).toHaveBeenCalledTimes(1)
    expect(canReadWriteMock).toHaveBeenCalledWith('package-lock.json')
  })

  it('returns PackageManagerName.Yarn if package-lock.json does not exist and yarn.lock exists', async () => {
    canReadWriteMock.mockImplementation(async (path) => await Promise.resolve(path === 'yarn.lock'))

    const actual = await detectPackageManager()

    expect(actual).toBe(PackageManagerName.Yarn)
    expect(canReadWriteMock).toHaveBeenCalledTimes(2)
    expect(canReadWriteMock).toHaveBeenCalledWith('package-lock.json')
    expect(canReadWriteMock).toHaveBeenCalledWith('yarn.lock')
  })

  it('throws error if no lock file exists', async () => {
    canReadWriteMock.mockResolvedValue(false)

    await expect(async () => await detectPackageManager()).rejects.toThrow(Error)

    expect(canReadWriteMock).toHaveBeenCalledTimes(2)
    expect(canReadWriteMock).toHaveBeenCalledWith('package-lock.json')
    expect(canReadWriteMock).toHaveBeenCalledWith('yarn.lock')
  })
})
