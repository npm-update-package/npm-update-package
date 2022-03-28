import type { OutdatedPackage } from '../../../core'
import { readFile } from '../../../file'
import type { GitRepository } from '../../../git'
import type { Options } from '../../../options'
import {
  extractRepository,
  parsePackageJson
} from '../../../package-json'
import type { ReleasesFetcher } from '../../releases'
import { createFooter } from './createFooter'
import { createMetadataSection } from './createMetadataSection'
import { createNotesSection } from './createNotesSection'
import { createOutdatedPackagesTable } from './createOutdatedPackagesTable'
import { createPackageDiffsSection } from './createPackageDiffsSection'
import { createReleaseNotesSection } from './createReleaseNotesSection'

// TODO: Split into multiple classes and functions
export class PullRequestBodyCreator {
  private readonly options: Options
  private readonly releasesFetcher: ReleasesFetcher

  constructor ({
    options,
    releasesFetcher
  }: {
    options: Options
    releasesFetcher: ReleasesFetcher
  }) {
    this.options = options
    this.releasesFetcher = releasesFetcher
  }

  async create (outdatedPackage: OutdatedPackage): Promise<string> {
    const sections: string[] = []
    const outdatedPackagesTable = createOutdatedPackagesTable(outdatedPackage)
    sections.push(`This PR updates these packages:\n\n${outdatedPackagesTable}`)
    const gitRepo = await this.extractRepository(outdatedPackage)
    const diffSection = createPackageDiffsSection({
      outdatedPackage,
      gitRepo
    })
    sections.push(diffSection)

    if (this.options.fetchReleaseNotes && gitRepo?.isGitHub === true) {
      const releases = await this.releasesFetcher.fetch({
        gitRepo,
        packageName: outdatedPackage.name,
        from: outdatedPackage.currentVersion,
        to: outdatedPackage.newVersion
      })

      if (releases.length > 0) {
        const releaseNotesSection = createReleaseNotesSection(releases)
        sections.push(releaseNotesSection)
      }
    }

    if (this.options.prBodyNotes !== undefined) {
      const notesSection = createNotesSection(this.options.prBodyNotes)
      sections.push(notesSection)
    }

    const metadataSection = createMetadataSection(outdatedPackage)
    sections.push(`---\n${metadataSection}`)
    const footer = createFooter()
    sections.push(`---\n${footer}`)
    return sections.join('\n\n')
  }

  private async extractRepository (outdatedPackage: OutdatedPackage): Promise<GitRepository | undefined> {
    const packageJson = await readFile(`node_modules/${outdatedPackage.name}/package.json`)
    const pkg = parsePackageJson(packageJson)
    return extractRepository(pkg)
  }
}
