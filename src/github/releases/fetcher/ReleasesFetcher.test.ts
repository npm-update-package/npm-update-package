import { setTimeout } from 'node:timers/promises'
import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import { StatusCodes } from 'http-status-codes'
import type { GitRepository } from '../../../git/GitRepository.js'
import type { Options } from '../../../options/Options.js'
import type { PackageManager } from '../../../package-manager/PackageManager.js'
import { SemVer } from '../../../semver/SemVer.js'
import { ReleasesFetcher } from './ReleasesFetcher.js'

jest.mock('node:timers/promises')

describe('ReleasesFetcher', () => {
  describe('fetch', () => {
    const fetchSpy = jest.spyOn(global, 'fetch')
    const setTimeoutMock = jest.mocked(setTimeout)
    const getVersionsMock = jest.fn<PackageManager['getVersions']>()
    const options = {
      fetchInterval: 1000
    }
    const packageManager = {
      getVersions: getVersionsMock
    } as unknown as PackageManager
    const releasesFetcher = new ReleasesFetcher({
      options: options as Options,
      packageManager
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('returns releases', async () => {
      getVersionsMock.mockResolvedValue([
        '1.0.0',
        '1.1.0',
        '1.1.1',
        '2.0.0',
        '2.1.0'
      ])
      setTimeoutMock.mockResolvedValue(undefined)
      fetchSpy.mockImplementation((async (url) => {
        return typeof url === 'string' && url.endsWith('v1.1.1')
          ? await Promise.resolve({
            ok: false,
            status: StatusCodes.NOT_FOUND
          })
          : await Promise.resolve({
            ok: true,
            status: StatusCodes.OK
          })
      }) as typeof fetch)
      const gitRepo = {
        owner: 'npm-update-package',
        name: 'example',
        url: 'https://github.com/npm-update-package/example'
      } as unknown as GitRepository

      const actual = await releasesFetcher.fetch({
        gitRepo,
        packageName: '@npm-update-package/example',
        from: SemVer.of('1.1.0'),
        to: SemVer.of('2.0.0')
      })

      expect(actual).toEqual([
        {
          tag: 'v1.1.0',
          url: 'https://github.com/npm-update-package/example/releases/tag/v1.1.0'
        },
        // v1.1.1 is missing
        {
          tag: 'v2.0.0',
          url: 'https://github.com/npm-update-package/example/releases/tag/v2.0.0'
        }
      ])
      expect(getVersionsMock).toHaveBeenCalledWith('@npm-update-package/example')
      expect(setTimeoutMock).toHaveBeenCalledTimes(2)
      expect(setTimeoutMock).toHaveBeenCalledWith(options.fetchInterval)
      expect(fetchSpy).toHaveBeenCalledTimes(3)
      expect(fetchSpy).toHaveBeenCalledWith('https://github.com/npm-update-package/example/releases/tag/v1.1.0')
      expect(fetchSpy).toHaveBeenCalledWith('https://github.com/npm-update-package/example/releases/tag/v1.1.1')
      expect(fetchSpy).toHaveBeenCalledWith('https://github.com/npm-update-package/example/releases/tag/v2.0.0')
    })
  })
})
