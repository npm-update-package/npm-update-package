import { StatusCodes } from 'http-status-codes'
import fetch from 'node-fetch'
import type { Response } from 'node-fetch'
import { GitRepository } from '../../../git'
import type { PackageManager } from '../../../package-manager'
import { SemVer } from '../../../semver'
import { ReleasesFetcher } from './ReleasesFetcher'

jest.mock('node-fetch')

describe('ReleasesFetcher', () => {
  describe('fetch', () => {
    const fetchMock = jest.mocked(fetch)
    const getVersionsMock = jest.fn()
    const packageManager = {
      getVersions: getVersionsMock
    } as unknown as PackageManager
    const releasesFetcher = new ReleasesFetcher({ packageManager })

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
      fetchMock.mockImplementation(async (url) => {
        if (typeof url === 'string' && url.endsWith('v1.1.1')) {
          return await Promise.resolve({
            ok: false,
            status: StatusCodes.NOT_FOUND
          } as unknown as Response)
        } else {
          return await Promise.resolve({
            ok: true,
            status: StatusCodes.OK
          } as unknown as Response)
        }
      })
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
      expect(getVersionsMock).toBeCalledWith('@npm-update-package/example')
      expect(fetchMock).toBeCalledTimes(3)
      expect(fetchMock).toBeCalledWith('https://github.com/npm-update-package/example/releases/tag/v1.1.0')
      expect(fetchMock).toBeCalledWith('https://github.com/npm-update-package/example/releases/tag/v1.1.1')
      expect(fetchMock).toBeCalledWith('https://github.com/npm-update-package/example/releases/tag/v2.0.0')
    })
  })
})
