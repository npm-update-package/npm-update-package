import {
  describe,
  expect,
  it
} from '@jest/globals'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import { DependencyType } from '../../../package-json/DependencyType.js'
import { SemVer } from '../../../semver/SemVer.js'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'
import { createRequirePackageJSON } from '../../../util/createRequirePackageJSON.js'
import { createMetadataSection } from './createMetadataSection.js'

const requirePackageJSON = createRequirePackageJSON(import.meta.url)
const pkg = requirePackageJSON('../../../../package.json')

describe('createMetadataSection', () => {
  it('returns metadata section', () => {
    const outdatedPackage: OutdatedPackage = {
      name: '@npm-update-package/example',
      currentVersion: SemVer.of('1.0.0'),
      newVersion: SemVer.of('2.0.0'),
      level: SemVerLevel.Major,
      dependencyType: DependencyType.Dependencies
    }

    const actual = createMetadataSection(outdatedPackage)

    expect(actual).toBe(`<details>
<summary>Metadata</summary>

**Don't remove or edit this section because it will be used by npm-update-package.**

<div id="npm-update-package-metadata">

\`\`\`json
{
  "version": "${pkg.version}",
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
</details>`)
  })
})
