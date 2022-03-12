import { RequestError } from '@octokit/request-error'
import { StatusCodes } from 'http-status-codes'
import { GitRepository } from '../../../git'
import {
  createLogger,
  LogLevel
} from '../../../logger'
import type { PackageManager } from '../../../package-manager'
import { SemVer } from '../../../semver'
import type { GitHub } from '../../GitHub'
import { ReleasesFetcher } from './ReleasesFetcher'

describe('ReleasesFetcher', () => {
  describe('fetch', () => {
    const fetchReleaseByTagMock = jest.fn()
    const github = {
      fetchReleaseByTag: fetchReleaseByTagMock
    } as unknown as GitHub
    const getVersionsMock = jest.fn()
    const packageManager = {
      getVersions: getVersionsMock
    } as unknown as PackageManager
    const logger = createLogger(LogLevel.Off)

    afterEach(() => {
      fetchReleaseByTagMock.mockReset()
      getVersionsMock.mockReset()
    })

    it('returns releases', async () => {
      const versions = [
        '1.0.0',
        '1.1.0',
        '1.1.1',
        '2.0.0',
        '2.1.0'
      ]
      getVersionsMock.mockResolvedValue(versions)
      fetchReleaseByTagMock.mockImplementation(async ({ tag }: { tag: string }) => {
        if (tag === 'v1.1.1') {
          return await Promise.reject(new RequestError('test error', StatusCodes.NOT_FOUND, {
            request: {
              method: 'GET',
              url: 'https://example.com/',
              headers: {}
            }
          }))
        } else {
          return await Promise.resolve({
            tag_name: tag
          })
        }
      })
      const gitRepo = GitRepository.of('https://github.com/npm-update-package/example')

      const releasesFetcher = new ReleasesFetcher({
        github,
        packageManager,
        logger
      })
      const actual = await releasesFetcher.fetch({
        gitRepo,
        packageName: '@npm-update-package/example',
        from: SemVer.of('1.1.0'),
        to: SemVer.of('2.0.0')
      })

      expect(actual).toEqual([
        {
          tag_name: 'v1.1.0'
        },
        {
          tag_name: 'v2.0.0'
        }
      ])
      expect(getVersionsMock).toBeCalledWith('@npm-update-package/example')
      expect(fetchReleaseByTagMock).toBeCalledTimes(3)
      expect(fetchReleaseByTagMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        tag: 'v1.1.0'
      })
      expect(fetchReleaseByTagMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        tag: 'v1.1.1'
      })
      expect(fetchReleaseByTagMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        tag: 'v2.0.0'
      })
    })
  })
})
