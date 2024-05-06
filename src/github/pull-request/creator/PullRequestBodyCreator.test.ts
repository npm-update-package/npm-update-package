import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import { readFile } from '../../../file/readFile.js'
import { GitRepository } from '../../../git/GitRepository.js'
import type { Options } from '../../../options/Options.js'
import { DependencyType } from '../../../package-json/DependencyType.js'
import { extractRepository } from '../../../package-json/extractRepository.js'
import type { PackageMetadata } from '../../../package-json/PackageMetadata.js'
import { parsePackageJson } from '../../../package-json/parsePackageJson.js'
import { SemVer } from '../../../semver/SemVer.js'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'
import type { ReleasesFetcher } from '../../releases/fetcher/ReleasesFetcher.js'
import type { Release } from '../../releases/Release.js'
import { createFooter } from './createFooter.js'
import { createMetadataSection } from './createMetadataSection.js'
import { createNotesSection } from './createNotesSection.js'
import { createOutdatedPackagesTable } from './createOutdatedPackagesTable.js'
import type { PackageDiffsSectionCreator } from './PackageDiffsSectionCreator.js'
import { PullRequestBodyCreator } from './PullRequestBodyCreator.js'
import type { ReleaseNotesSectionCreator } from './ReleaseNotesSectionCreator.js'

jest.mock('../../../file/readFile.js')
jest.mock('../../../package-json/extractRepository.js')
jest.mock('../../../package-json/parsePackageJson.js')
jest.mock('./createFooter.js')
jest.mock('./createMetadataSection.js')
jest.mock('./createNotesSection.js')
jest.mock('./createOutdatedPackagesTable.js')

describe('PullRequestBodyCreator', () => {
  describe('create', () => {
    const readFileMock = jest.mocked(readFile)
    const parsePackageJsonMock = jest.mocked(parsePackageJson)
    const extractRepositoryMock = jest.mocked(extractRepository)
    const createOutdatedPackagesTableMock = jest.mocked(createOutdatedPackagesTable)
    const createNotesSectionMock = jest.mocked(createNotesSection)
    const createMetadataSectionMock = jest.mocked(createMetadataSection)
    const createFooterMock = jest.mocked(createFooter)
    const releasesFetcherFetchMock = jest.fn<ReleasesFetcher['fetch']>()
    const releasesFetcher = {
      fetch: releasesFetcherFetchMock
    } as unknown as ReleasesFetcher
    const packageDiffsSectionCreatorCreateMock = jest.fn<PackageDiffsSectionCreator['create']>()
    const packageDiffsSectionCreator = {
      create: packageDiffsSectionCreatorCreateMock
    } as unknown as PackageDiffsSectionCreator
    const releaseNotesSectionCreatorCreateMock = jest.fn<ReleaseNotesSectionCreator['create']>()
    const releaseNotesSectionCreator = {
      create: releaseNotesSectionCreatorCreateMock
    } as unknown as ReleaseNotesSectionCreator

    afterEach(() => {
      jest.resetAllMocks()
    })

    describe('returns Markdown string', () => {
      interface TestCase {
        options: Options
        gitRepo?: GitRepository
        outdatedPackagesTable: string
        packageDiffsSection: string
        notesSection: string
        metadataSection: string
        footer: string
        releases: Release[]
        releaseNotesSection: string
        expected: string
      }
      const cases: TestCase[] = [
        // options.fetchReleaseNotes is false
        {
          options: {
            fetchReleaseNotes: false
          } as unknown as Options,
          gitRepo: GitRepository.of('https://github.com/npm-update-package/example'),
          outdatedPackagesTable: '<outdated-packages-table>',
          packageDiffsSection: '<package-diffs>',
          notesSection: '<notes>',
          metadataSection: '<metadata>',
          footer: '<footer>',
          releases: [],
          releaseNotesSection: '<release-notes>',
          expected: `This PR updates these packages:

<outdated-packages-table>

<package-diffs>

---
<metadata>

---
<footer>`
        },
        // Repository does not exist
        {
          options: {
            fetchReleaseNotes: true
          } as unknown as Options,
          gitRepo: undefined,
          outdatedPackagesTable: '<outdated-packages-table>',
          packageDiffsSection: '<package-diffs>',
          notesSection: '<notes>',
          metadataSection: '<metadata>',
          footer: '<footer>',
          releases: [],
          releaseNotesSection: '<release-notes>',
          expected: `This PR updates these packages:

<outdated-packages-table>

<package-diffs>

---
<metadata>

---
<footer>`
        },
        // Repository exists / Repository is not GitHub
        {
          options: {
            fetchReleaseNotes: true
          } as unknown as Options,
          gitRepo: GitRepository.of('https://git.test/npm-update-package/example'),
          outdatedPackagesTable: '<outdated-packages-table>',
          packageDiffsSection: '<package-diffs>',
          notesSection: '<notes>',
          metadataSection: '<metadata>',
          footer: '<footer>',
          releases: [],
          releaseNotesSection: '<release-notes>',
          expected: `This PR updates these packages:

<outdated-packages-table>

<package-diffs>

---
<metadata>

---
<footer>`
        },
        // Repository exists / Repository is GitHub / Release notes exists
        {
          options: {
            fetchReleaseNotes: true
          } as unknown as Options,
          gitRepo: GitRepository.of('https://github.com/npm-update-package/example'),
          outdatedPackagesTable: '<outdated-packages-table>',
          packageDiffsSection: '<package-diffs>',
          notesSection: '<notes>',
          metadataSection: '<metadata>',
          footer: '<footer>',
          releases: [
            {
              tag: 'v1.0.0',
              url: 'https://github.com/npm-update-package/example/releases/tag/v1.0.0'
            },
            {
              tag: 'v2.0.0',
              url: 'https://github.com/npm-update-package/example/releases/tag/v2.0.0'
            }
          ],
          releaseNotesSection: '<release-notes>',
          expected: `This PR updates these packages:

<outdated-packages-table>

<package-diffs>

<release-notes>

---
<metadata>

---
<footer>`
        },
        // Repository exists / Repository is GitHub / prBodyNotes option exists
        {
          options: {
            fetchReleaseNotes: true,
            prBodyNotes: '**:warning: Please see diff and release notes before merging.**'
          } as unknown as Options,
          gitRepo: GitRepository.of('https://github.com/npm-update-package/example'),
          outdatedPackagesTable: '<outdated-packages-table>',
          packageDiffsSection: '<package-diffs>',
          notesSection: '<notes>',
          metadataSection: '<metadata>',
          footer: '<footer>',
          releases: [],
          releaseNotesSection: '<release-notes>',
          expected: `This PR updates these packages:

<outdated-packages-table>

<package-diffs>

<notes>

---
<metadata>

---
<footer>`
        }
      ]
      const outdatedPackage: OutdatedPackage = {
        name: '@npm-update-package/example',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('2.0.0'),
        level: SemVerLevel.Major,
        dependencyType: DependencyType.Dependencies
      }
      const packageMetadata: PackageMetadata = {
        name: '@npm-update-package/example',
        version: '1.0.0',
        repository: 'npm-update-package/example'
      }
      const packageJson = JSON.stringify(packageMetadata)

      it.each(cases)('options=$options, gitRepo=$gitRepo, releases=$releases', async ({
        options,
        gitRepo,
        outdatedPackagesTable,
        packageDiffsSection,
        notesSection,
        metadataSection,
        footer,
        releases,
        releaseNotesSection,
        expected
      }) => {
        readFileMock.mockResolvedValue(packageJson)
        parsePackageJsonMock.mockReturnValue(packageMetadata)
        extractRepositoryMock.mockReturnValue(gitRepo)
        createOutdatedPackagesTableMock.mockReturnValue(outdatedPackagesTable)
        packageDiffsSectionCreatorCreateMock.mockReturnValue(packageDiffsSection)
        createNotesSectionMock.mockReturnValue(notesSection)
        createMetadataSectionMock.mockReturnValue(metadataSection)
        createFooterMock.mockReturnValue(footer)
        releasesFetcherFetchMock.mockResolvedValue(releases)
        releaseNotesSectionCreatorCreateMock.mockReturnValue(releaseNotesSection)
        const pullRequestBodyCreator = new PullRequestBodyCreator({
          options,
          releasesFetcher,
          packageDiffsSectionCreator,
          releaseNotesSectionCreator
        })

        const actual = await pullRequestBodyCreator.create(outdatedPackage)

        expect.assertions(11)
        expect(actual).toBe(expected)
        expect(readFileMock).toHaveBeenCalledWith('node_modules/@npm-update-package/example/package.json')
        expect(parsePackageJsonMock).toHaveBeenCalledWith(packageJson)
        expect(extractRepositoryMock).toHaveBeenCalledWith(packageMetadata)
        expect(createOutdatedPackagesTableMock).toHaveBeenCalledWith(outdatedPackage)
        expect(packageDiffsSectionCreatorCreateMock).toHaveBeenCalledWith({
          outdatedPackage,
          gitRepo
        })
        expect(createMetadataSectionMock).toHaveBeenCalledWith(outdatedPackage)
        expect(createFooterMock).toHaveBeenCalledWith()

        if (options.fetchReleaseNotes && gitRepo?.isGitHub === true) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(releasesFetcherFetchMock).toHaveBeenCalledWith({
            gitRepo,
            packageName: outdatedPackage.name,
            from: outdatedPackage.currentVersion,
            to: outdatedPackage.newVersion
          })

          if (releases.length > 0) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(releaseNotesSectionCreatorCreateMock).toHaveBeenCalledWith(releases)
          } else {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(releaseNotesSectionCreatorCreateMock).not.toHaveBeenCalled()
          }
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(releasesFetcherFetchMock).not.toHaveBeenCalled()
          // eslint-disable-next-line jest/no-conditional-expect
          expect(releaseNotesSectionCreatorCreateMock).not.toHaveBeenCalled()
        }

        if (options.prBodyNotes === undefined) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(createNotesSectionMock).not.toHaveBeenCalled()
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(createNotesSectionMock).toHaveBeenCalledWith(options.prBodyNotes)
        }
      })
    })
  })
})
