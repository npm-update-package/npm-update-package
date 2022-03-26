import type { OutdatedPackage } from '../../../core'
import { readFile } from '../../../file'
import { GitRepository } from '../../../git'
import type { ReleasesFetcher } from '../../../github'
import type { Options } from '../../../options'
import {
  DependencyType,
  extractRepository,
  parsePackageJson,
  type PackageMetadata
} from '../../../package-json'
import {
  SemVer,
  SemVerLevel
} from '../../../semver'
import type { Release } from '../../releases'
import { createFooter } from './createFooter'
import { createMetadataSection } from './createMetadataSection'
import { createNotesSection } from './createNotesSection'
import { createOutdatedPackagesTable } from './createOutdatedPackagesTable'
import { createPackageDiffsSection } from './createPackageDiffsSection'
import { createReleaseNotesSection } from './createReleaseNotesSection'
import { PullRequestBodyCreator } from './PullRequestBodyCreator'

jest.mock('../../../file')
jest.mock('../../../package-json')
jest.mock('./createFooter')
jest.mock('./createMetadataSection')
jest.mock('./createNotesSection')
jest.mock('./createOutdatedPackagesTable')
jest.mock('./createPackageDiffsSection')
jest.mock('./createReleaseNotesSection')

describe('PullRequestBodyCreator', () => {
  describe('create', () => {
    const readFileMock = jest.mocked(readFile)
    const parsePackageJsonMock = jest.mocked(parsePackageJson)
    const extractRepositoryMock = jest.mocked(extractRepository)
    const createOutdatedPackagesTableMock = jest.mocked(createOutdatedPackagesTable)
    const createPackageDiffsSectionMock = jest.mocked(createPackageDiffsSection)
    const createNotesSectionMock = jest.mocked(createNotesSection)
    const createMetadataSectionMock = jest.mocked(createMetadataSection)
    const createReleaseNotesSectionMock = jest.mocked(createReleaseNotesSection)
    const createFooterMock = jest.mocked(createFooter)
    const releasesFetcherFetchMock = jest.fn()
    const releasesFetcher = {
      fetch: releasesFetcherFetchMock
    } as unknown as ReleasesFetcher

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
        // Repository does not exist
        {
          options: {} as unknown as Options,
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
          options: {} as unknown as Options,
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
          options: {} as unknown as Options,
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
          ] as Release[],
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
        createPackageDiffsSectionMock.mockReturnValue(packageDiffsSection)
        createNotesSectionMock.mockReturnValue(notesSection)
        createMetadataSectionMock.mockReturnValue(metadataSection)
        createFooterMock.mockReturnValue(footer)
        releasesFetcherFetchMock.mockResolvedValue(releases)
        createReleaseNotesSectionMock.mockReturnValue(releaseNotesSection)
        const pullRequestBodyCreator = new PullRequestBodyCreator({
          options,
          releasesFetcher
        })

        const actual = await pullRequestBodyCreator.create(outdatedPackage)

        expect.assertions(11)
        expect(actual).toBe(expected)
        expect(readFileMock).toBeCalledWith('node_modules/@npm-update-package/example/package.json')
        expect(parsePackageJsonMock).toBeCalledWith(packageJson)
        expect(extractRepositoryMock).toBeCalledWith(packageMetadata)
        expect(createOutdatedPackagesTableMock).toBeCalledWith(outdatedPackage)
        expect(createPackageDiffsSectionMock).toBeCalledWith({
          outdatedPackage,
          gitRepo
        })
        expect(createMetadataSectionMock).toBeCalledWith(outdatedPackage)
        expect(createFooterMock).toBeCalledWith()

        if (gitRepo?.isGitHub === true) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(releasesFetcherFetchMock).toBeCalledWith({
            gitRepo,
            packageName: outdatedPackage.name,
            from: outdatedPackage.currentVersion,
            to: outdatedPackage.newVersion
          })

          if (releases.length > 0) {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(createReleaseNotesSectionMock).toBeCalledWith(releases)
          } else {
            // eslint-disable-next-line jest/no-conditional-expect
            expect(createReleaseNotesSectionMock).not.toBeCalled()
          }
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(releasesFetcherFetchMock).not.toBeCalled()
          // eslint-disable-next-line jest/no-conditional-expect
          expect(createReleaseNotesSectionMock).not.toBeCalled()
        }

        if (options.prBodyNotes !== undefined) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(createNotesSectionMock).toBeCalledWith(options.prBodyNotes)
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(createNotesSectionMock).not.toBeCalled()
        }
      })
    })
  })
})
