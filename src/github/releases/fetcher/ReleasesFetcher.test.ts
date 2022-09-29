import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import { StatusCodes } from 'http-status-codes'
import fetch from 'node-fetch'
import { GitRepository } from '../../../git'
import type { Options } from '../../../options'
import type { PackageManager } from '../../../package-manager'
import { SemVer } from '../../../semver'
import { sleep } from '../../../util'
import { ReleasesFetcher } from './ReleasesFetcher'

jest.mock('node-fetch')
jest.mock('../../../util')

describe('ReleasesFetcher', () => {
  describe('fetch', () => {
    const fetchMock = jest.mocked(fetch)
    const sleepMock = jest.mocked(sleep)
    const getVersionsMock = jest.fn<PackageManager['getVersions']>()
    const options = {
      fetchSleepTime: 1000
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
      sleepMock.mockResolvedValue(undefined)
      fetchMock.mockImplementation((async (url) => {
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
      expect(sleepMock).toHaveBeenCalledTimes(2)
      expect(sleepMock).toHaveBeenCalledWith(options.fetchSleepTime)
      expect(fetchMock).toHaveBeenCalledTimes(3)
      expect(fetchMock).toHaveBeenCalledWith('https://github.com/npm-update-package/example/releases/tag/v1.1.0')
      expect(fetchMock).toHaveBeenCalledWith('https://github.com/npm-update-package/example/releases/tag/v1.1.1')
      expect(fetchMock).toHaveBeenCalledWith('https://github.com/npm-update-package/example/releases/tag/v2.0.0')
    })
  })
})
