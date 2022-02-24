import app from '../../../../package.json'
import type { OutdatedPackage } from '../../../core'
import { readFile } from '../../../file'
import type { GitRepository } from '../../../git'
import { toJSON } from '../../../json'
import {
  extractRepository,
  parsePackageJson
} from '../../../package-json'
import { createPullRequestMetadata } from '../metadata'

export class PullRequestBodyCreator {
  async create (outdatedPackage: OutdatedPackage): Promise<string> {
    const packageJson = await readFile(`node_modules/${outdatedPackage.name}/package.json`)
    const pkg = parsePackageJson(packageJson)
    const repository = extractRepository(pkg)
    // TODO: const releaseNotesSection = await createReleaseNotesSection()
    const outdatedPackagesTable = this.createOutdatedPackagesTable({
      outdatedPackage,
      repository
    })
    const metadataSection = this.createMetadataSection(outdatedPackage)
    return `This PR updates these packages:

${outdatedPackagesTable}

${metadataSection}

---
This PR has been generated by [${app.name}](${app.homepage}) v${app.version}`
  }

  // TODO: extractRepository

  // TODO: createReleaseNotesSection

  private createOutdatedPackagesTable ({
    outdatedPackage,
    repository
  }: {
    outdatedPackage: OutdatedPackage
    repository?: GitRepository
  }): string {
    const packageName = outdatedPackage.name
    const packageLink = `[${packageName}](https://www.npmjs.com/package/${packageName})`
    const repositoryLink = repository !== undefined ? `[${repository.owner}/${repository.name}](${repository.url.toString()})` : '-'
    const level = outdatedPackage.level
    const currentVersion = outdatedPackage.currentVersion.version
    const currentVersionLink = `[\`${currentVersion}\`](https://www.npmjs.com/package/${packageName}/v/${currentVersion})`
    const newVersion = outdatedPackage.newVersion.version
    const newVersionLink = `[\`${newVersion}\`](https://www.npmjs.com/package/${packageName}/v/${newVersion})`
    const diffLink = `[diff](https://renovatebot.com/diffs/npm/${packageName}/${currentVersion}/${newVersion})`
    const version = `${currentVersionLink} -> ${newVersionLink} (${diffLink})`
    return `|Package|Repository|Level|Version|
|---|---|---|---|
|${packageLink}|${repositoryLink}|${level}|${version}|`
  }

  private createMetadataSection (outdatedPackage: OutdatedPackage): string {
    const metadata = createPullRequestMetadata([outdatedPackage])
    const json = toJSON(metadata, { pretty: true })
    return `<details>
<summary>Metadata</summary>

**Don't remove or edit this section because it will be used by npm-update-package.**

<div id="npm-update-package-metadata">

\`\`\`json
${json}
\`\`\`

</div>
</details>`
  }
}
