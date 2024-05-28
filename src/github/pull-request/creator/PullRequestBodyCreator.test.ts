import assert from 'node:assert'
import { readFile } from 'node:fs/promises'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
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

await describe('PullRequestBodyCreator', async () => {
  await describe('create', async () => {
    await describe('returns Markdown string', async () => {
      const inputs: Array<{
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
      }> = [
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
      each(inputs, ({ title }, {
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
        // TODO: Activate when mock.module can use.
        void it.skip(title, async ({ mock }) => {
          const readFileMock = mock.fn(readFile)
          const parsePackageJsonMock = mock.fn(parsePackageJson)
          const extractRepositoryMock = mock.fn(extractRepository)
          const createOutdatedPackagesTableMock = mock.fn(createOutdatedPackagesTable)
          const createNotesSectionMock = mock.fn(createNotesSection)
          const createMetadataSectionMock = mock.fn(createMetadataSection)
          const createFooterMock = mock.fn(createFooter)
          const releasesFetcherFetchMock = mock.fn<ReleasesFetcher['fetch']>()
          const releasesFetcher = {
            fetch: releasesFetcherFetchMock
          } as unknown as ReleasesFetcher
          const packageDiffsSectionCreatorCreateMock = mock.fn<PackageDiffsSectionCreator['create']>()
          const packageDiffsSectionCreator = {
            create: packageDiffsSectionCreatorCreateMock
          } as unknown as PackageDiffsSectionCreator
          const releaseNotesSectionCreatorCreateMock = mock.fn<ReleaseNotesSectionCreator['create']>()
          const releaseNotesSectionCreator = {
            create: releaseNotesSectionCreatorCreateMock
          } as unknown as ReleaseNotesSectionCreator
          const pullRequestBodyCreator = new PullRequestBodyCreator({
            options,
            releasesFetcher,
            packageDiffsSectionCreator,
            releaseNotesSectionCreator
          })
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
          readFileMock.mock.mockImplementation(async () => await Promise.resolve(packageJson))
          parsePackageJsonMock.mock.mockImplementation(() => packageMetadata)
          extractRepositoryMock.mock.mockImplementation(() => gitRepo)
          createOutdatedPackagesTableMock.mock.mockImplementation(() => outdatedPackagesTable)
          packageDiffsSectionCreatorCreateMock.mock.mockImplementation(() => packageDiffsSection)
          createNotesSectionMock.mock.mockImplementation(() => notesSection)
          createMetadataSectionMock.mock.mockImplementation(() => metadataSection)
          createFooterMock.mock.mockImplementation(() => footer)
          releasesFetcherFetchMock.mock.mockImplementation(async () => await Promise.resolve(releases))
          releaseNotesSectionCreatorCreateMock.mock.mockImplementation(() => releaseNotesSection)

          const actual = await pullRequestBodyCreator.create(outdatedPackage)

          assert.strictEqual(actual, expected)
          assert.strictEqual(readFileMock.mock.callCount(), 1)
          assert.deepStrictEqual(readFileMock.mock.calls.map(call => call.arguments), [
            ['node_modules/@npm-update-package/example/package.json']
          ])
          assert.strictEqual(parsePackageJsonMock.mock.callCount(), 1)
          assert.deepStrictEqual(parsePackageJsonMock.mock.calls.map(call => call.arguments), [
            [packageJson]
          ])
          assert.strictEqual(extractRepositoryMock.mock.callCount(), 1)
          assert.deepStrictEqual(extractRepositoryMock.mock.calls.map(call => call.arguments), [
            [packageMetadata]
          ])
          assert.strictEqual(createOutdatedPackagesTableMock.mock.callCount(), 1)
          assert.deepStrictEqual(createOutdatedPackagesTableMock.mock.calls.map(call => call.arguments), [
            [outdatedPackage]
          ])
          assert.strictEqual(packageDiffsSectionCreatorCreateMock.mock.callCount(), 1)
          assert.deepStrictEqual(packageDiffsSectionCreatorCreateMock.mock.calls.map(call => call.arguments), [
            [
              {
                outdatedPackage,
                gitRepo
              }
            ]
          ])
          assert.strictEqual(createMetadataSectionMock.mock.callCount(), 1)
          assert.deepStrictEqual(createMetadataSectionMock.mock.calls.map(call => call.arguments), [
            [outdatedPackage]
          ])
          assert.strictEqual(createFooterMock.mock.callCount(), 1)
          assert.deepStrictEqual(createFooterMock.mock.calls.map(call => call.arguments), [
            []
          ])

          if (options.fetchReleaseNotes && gitRepo?.isGitHub === true) {
            assert.strictEqual(releasesFetcherFetchMock.mock.callCount(), 1)
            assert.deepStrictEqual(releasesFetcherFetchMock.mock.calls.map(call => call.arguments), [
              [
                {
                  gitRepo,
                  packageName: outdatedPackage.name,
                  from: outdatedPackage.currentVersion,
                  to: outdatedPackage.newVersion
                }
              ]
            ])

            if (releases.length > 0) {
              assert.strictEqual(releaseNotesSectionCreatorCreateMock.mock.callCount(), 1)
              assert.deepStrictEqual(releaseNotesSectionCreatorCreateMock.mock.calls.map(call => call.arguments), [
                [releases]
              ])
            } else {
              assert.strictEqual(releaseNotesSectionCreatorCreateMock.mock.callCount(), 0)
            }
          } else {
            assert.strictEqual(releasesFetcherFetchMock.mock.callCount(), 0)
            assert.strictEqual(releaseNotesSectionCreatorCreateMock.mock.callCount(), 0)
          }

          if (options.prBodyNotes === undefined) {
            assert.strictEqual(createNotesSectionMock.mock.callCount(), 0)
          } else {
            assert.strictEqual(createNotesSectionMock.mock.callCount(), 1)
            assert.deepStrictEqual(createNotesSectionMock.mock.calls.map(call => call.arguments), [
              [options.prBodyNotes]
            ])
          }
        })
      })
    })
  })
})
