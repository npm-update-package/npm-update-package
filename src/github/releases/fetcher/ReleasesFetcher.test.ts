import assert from 'node:assert'
import {
  afterEach,
  describe,
  it
} from 'node:test'
import timers from 'node:timers/promises'
import { StatusCodes } from 'http-status-codes'
import nock from 'nock'
import { GitRepository } from '../../../git/GitRepository.js'
import type { Options } from '../../../options/Options.js'
import type { PackageManager } from '../../../package-manager/PackageManager.js'
import { SemVer } from '../../../semver/SemVer.js'
import { ReleasesFetcher } from './ReleasesFetcher.js'

await describe('ReleasesFetcher', async () => {
  await describe('fetch', async () => {
    afterEach(() => {
      nock.restore()
    })

    await it('returns releases', async ({ mock }) => {
      const setTimeoutMock = mock.method(timers, 'setTimeout')
      const getVersionsMock = mock.fn<PackageManager['getVersions']>()
      const options = {
        fetchInterval: 1000
      } as unknown as Options
      const packageManager = {
        getVersions: getVersionsMock
      } as unknown as PackageManager
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const gitRepo = GitRepository.of('https://github.com/npm-update-package/example')!
      const packageName = '@npm-update-package/example'
      const versions: string[] = [
        '1.0.0',
        '1.1.0',
        '1.1.1',
        '2.0.0',
        '2.1.0'
      ]
      const from = SemVer.of('1.1.0')
      const to = SemVer.of('2.0.0')
      getVersionsMock.mock.mockImplementation(async () => await Promise.resolve(versions))
      setTimeoutMock.mock.mockImplementation(async () => { await Promise.resolve(undefined) })
      nock('https://github.com')
        .get(`/${gitRepo.owner}/${gitRepo.name}/releases/tag/v1.1.0`)
        .reply(StatusCodes.OK)
        .get(`/${gitRepo.owner}/${gitRepo.name}/releases/tag/v1.1.1`)
        .reply(StatusCodes.NOT_FOUND)
        .get(`/${gitRepo.owner}/${gitRepo.name}/releases/tag/v2.0.0`)
        .reply(StatusCodes.OK)

      const releasesFetcher = new ReleasesFetcher({
        options,
        packageManager
      })
      const actual = await releasesFetcher.fetch({
        gitRepo,
        packageName,
        from,
        to
      })

      assert.deepStrictEqual(actual, [
        {
          tag: 'v1.1.0',
          url: `${gitRepo.url.toString()}/releases/tag/v1.1.0`
        },
        {
          tag: 'v2.0.0',
          url: `${gitRepo.url.toString()}/releases/tag/v2.0.0`
        }
      ])
      assert.strictEqual(getVersionsMock.mock.callCount(), 1)
      assert.deepStrictEqual(getVersionsMock.mock.calls.map(call => call.arguments), [
        [packageName]
      ])
      assert.strictEqual(setTimeoutMock.mock.callCount(), 2)
      assert.deepStrictEqual(setTimeoutMock.mock.calls.map(call => call.arguments), [
        [options.fetchInterval],
        [options.fetchInterval]
      ])
      assert.ok(nock.isDone())
    })
  })
})
