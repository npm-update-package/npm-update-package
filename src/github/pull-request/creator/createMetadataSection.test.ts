import app from '../../../../package.json'
import type { OutdatedPackage } from '../../../core'
import { DependencyType } from '../../../package-json'
import {
  SemVer,
  SemVerLevel
} from '../../../semver'
import { createMetadataSection } from './createMetadataSection'

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
</details>`)
  })
})
