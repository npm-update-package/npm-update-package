
import app from '../../../../package.json'
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
import type { Release } from '../../GitHub'
import { PullRequestBodyCreator } from './PullRequestBodyCreator'

jest.mock('../../../file')
jest.mock('../../../package-json')

describe('PullRequestBodyCreator', () => {
  describe('create', () => {
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
    const gitRepo = GitRepository.of('https://github.com/npm-update-package/example')

    const readFileMock = jest.mocked(readFile)
    const parsePackageJsonMock = jest.mocked(parsePackageJson)
    const extractRepositoryMock = jest.mocked(extractRepository)
    const releasesFetcherFetchMock = jest.fn()
    const releasesFetcher = {
      fetch: releasesFetcherFetchMock
    } as unknown as ReleasesFetcher

    beforeEach(() => {
      readFileMock.mockResolvedValue(packageJson)
      parsePackageJsonMock.mockReturnValue(packageMetadata)
      extractRepositoryMock.mockReturnValue(gitRepo)
    })

    afterEach(() => {
      readFileMock.mockReset()
      parsePackageJsonMock.mockReset()
      extractRepositoryMock.mockReset()
      releasesFetcherFetchMock.mockReset()
    })

    describe('returns Markdown string', () => {
      interface TestCase {
        options: Options
        releases: Release[]
        expected: string
      }
      const cases: TestCase[] = [
        // Base
        {
          options: {} as unknown as Options,
          releases: [],
          expected: `This PR updates these packages:

|Package|Dependency type|Level|Version|
|---|---|---|---|
|[@npm-update-package/example](https://www.npmjs.com/package/@npm-update-package/example)|dependencies|major|[\`1.0.0\`](https://www.npmjs.com/package/@npm-update-package/example/v/1.0.0) -> [\`2.0.0\`](https://www.npmjs.com/package/@npm-update-package/example/v/2.0.0) ([diff](https://renovatebot.com/diffs/npm/@npm-update-package/example/1.0.0/2.0.0))|

---
<details>
<summary>Metadata</summary>

**Don't remove or edit this section because it will be used by npm-update-package.**

<div id="npm-update-package-metadata">

\`\`\`json
{
  "version": "${app.version}",
  "packages": [
    {
      "name": "@npm-update-package/example",
      "currentVersion": "1.0.0",
      "newVersion": "2.0.0",
      "level": "major"
    }
  ]
}
\`\`\`

</div>
</details>

---
This PR has been generated by [${app.name}](${app.homepage}) v${app.version}`
        },
        // Release notes section
        {
          options: {} as unknown as Options,
          releases: [
            {
              tag_name: 'v1.0.0',
              html_url: 'https://github.com/npm-update-package/example/releases/tag/v1.0.0'
            },
            {
              tag_name: 'v2.0.0',
              html_url: 'https://github.com/npm-update-package/example/releases/tag/v2.0.0'
            }
          ] as Release[],
          expected: `This PR updates these packages:

|Package|Dependency type|Level|Version|
|---|---|---|---|
|[@npm-update-package/example](https://www.npmjs.com/package/@npm-update-package/example)|dependencies|major|[\`1.0.0\`](https://www.npmjs.com/package/@npm-update-package/example/v/1.0.0) -> [\`2.0.0\`](https://www.npmjs.com/package/@npm-update-package/example/v/2.0.0) ([diff](https://renovatebot.com/diffs/npm/@npm-update-package/example/1.0.0/2.0.0))|

## Release notes

- [v1.0.0](https://github.com/npm-update-package/example/releases/tag/v1.0.0)
- [v2.0.0](https://github.com/npm-update-package/example/releases/tag/v2.0.0)

---
<details>
<summary>Metadata</summary>

**Don't remove or edit this section because it will be used by npm-update-package.**

<div id="npm-update-package-metadata">

\`\`\`json
{
  "version": "${app.version}",
  "packages": [
    {
      "name": "@npm-update-package/example",
      "currentVersion": "1.0.0",
      "newVersion": "2.0.0",
      "level": "major"
    }
  ]
}
\`\`\`

</div>
</details>

---
This PR has been generated by [${app.name}](${app.homepage}) v${app.version}`
        },
        // Notes section
        {
          options: {
            prBodyNotes: '**:warning: Please see diff and release notes before merging.**'
          } as unknown as Options,
          releases: [],
          expected: `This PR updates these packages:

|Package|Dependency type|Level|Version|
|---|---|---|---|
|[@npm-update-package/example](https://www.npmjs.com/package/@npm-update-package/example)|dependencies|major|[\`1.0.0\`](https://www.npmjs.com/package/@npm-update-package/example/v/1.0.0) -> [\`2.0.0\`](https://www.npmjs.com/package/@npm-update-package/example/v/2.0.0) ([diff](https://renovatebot.com/diffs/npm/@npm-update-package/example/1.0.0/2.0.0))|

## Notes

**:warning: Please see diff and release notes before merging.**

---
<details>
<summary>Metadata</summary>

**Don't remove or edit this section because it will be used by npm-update-package.**

<div id="npm-update-package-metadata">

\`\`\`json
{
  "version": "${app.version}",
  "packages": [
    {
      "name": "@npm-update-package/example",
      "currentVersion": "1.0.0",
      "newVersion": "2.0.0",
      "level": "major"
    }
  ]
}
\`\`\`

</div>
</details>

---
This PR has been generated by [${app.name}](${app.homepage}) v${app.version}`
        }
      ]

      it.each<TestCase>(cases)('options=$options, releases=$releases', async ({ options, releases, expected }) => {
        releasesFetcherFetchMock.mockResolvedValue(releases)

        const pullRequestBodyCreator = new PullRequestBodyCreator({
          options,
          releasesFetcher
        })
        const actual = await pullRequestBodyCreator.create(outdatedPackage)

        expect(actual).toBe(expected)
        expect(readFileMock).toBeCalledWith('node_modules/@npm-update-package/example/package.json')
        expect(parsePackageJsonMock).toBeCalledWith(packageJson)
        expect(extractRepositoryMock).toBeCalledWith(packageMetadata)
        expect(releasesFetcherFetchMock).toBeCalledWith({
          gitRepo,
          from: outdatedPackage.currentVersion,
          to: outdatedPackage.newVersion
        })
      })
    })
  })
})
