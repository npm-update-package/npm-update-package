import { GitRepository } from '../../../git'
import { SemVer } from '../../../semver'
import type { GitHub } from '../../GitHub'
import { ReleasesFetcher } from './ReleasesFetcher'

describe('ReleasesFetcher', () => {
  describe('fetch', () => {
    const fetchReleasesMock = jest.fn()
    const github = {
      fetchReleases: fetchReleasesMock
    } as unknown as GitHub

    afterEach(() => {
      fetchReleasesMock.mockReset()
    })

    it('returns releases', async () => {
      fetchReleasesMock.mockResolvedValue([
        {
          tag_name: 'test'
        },
        {
          tag_name: 'v1.0.0'
        },
        {
          tag_name: 'v1.1.0'
        },
        {
          tag_name: 'v2.0.0'
        },
        {
          tag_name: 'v2.1.0'
        },
        {
          tag_name: 'v2.2.0'
        }
      ])

      const gitRepo = GitRepository.of('https://github.com/npm-update-package/example')
      const releasesFetcher = new ReleasesFetcher(github)
      const releases = await releasesFetcher.fetch({
        gitRepo,
        from: SemVer.of('1.1.0'),
        to: SemVer.of('2.1.0')
      })

      expect(releases).toEqual([
        {
          tag_name: 'v1.1.0'
        },
        {
          tag_name: 'v2.0.0'
        },
        {
          tag_name: 'v2.1.0'
        }
      ])
      expect(fetchReleasesMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name
      })
    })
  })
})
