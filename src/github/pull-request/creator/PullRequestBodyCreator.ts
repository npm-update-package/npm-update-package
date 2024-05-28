import { readFile } from 'node:fs/promises'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import type { GitRepository } from '../../../git/GitRepository.js'
import type { Options } from '../../../options/Options.js'
import { extractRepository } from '../../../package-json/extractRepository.js'
import { parsePackageJson } from '../../../package-json/parsePackageJson.js'
import type { ReleasesFetcher } from '../../releases/fetcher/ReleasesFetcher.js'
import { createFooter } from './createFooter.js'
import { createMetadataSection } from './createMetadataSection.js'
import { createNotesSection } from './createNotesSection.js'
import { createOutdatedPackagesTable } from './createOutdatedPackagesTable.js'
import type { PackageDiffsSectionCreator } from './PackageDiffsSectionCreator.js'
import type { ReleaseNotesSectionCreator } from './ReleaseNotesSectionCreator.js'

// TODO: Split into multiple classes and functions
export class PullRequestBodyCreator {
  private readonly options: Options
  private readonly releasesFetcher: ReleasesFetcher
  private readonly packageDiffsSectionCreator: PackageDiffsSectionCreator
  private readonly releaseNotesSectionCreator: ReleaseNotesSectionCreator

  constructor ({
    options,
    releasesFetcher,
    packageDiffsSectionCreator,
    releaseNotesSectionCreator
  }: {
    options: Options
    releasesFetcher: ReleasesFetcher
    packageDiffsSectionCreator: PackageDiffsSectionCreator
    releaseNotesSectionCreator: ReleaseNotesSectionCreator
  }) {
    this.options = options
    this.releasesFetcher = releasesFetcher
    this.packageDiffsSectionCreator = packageDiffsSectionCreator
    this.releaseNotesSectionCreator = releaseNotesSectionCreator
  }

  async create (outdatedPackage: OutdatedPackage): Promise<string> {
    const sections: string[] = []
    const outdatedPackagesTable = createOutdatedPackagesTable(outdatedPackage)
    sections.push(`This PR updates these packages:\n\n${outdatedPackagesTable}`)
    const gitRepo = await this.extractRepository(outdatedPackage)
    const diffSection = this.packageDiffsSectionCreator.create({
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
        const releaseNotesSection = this.releaseNotesSectionCreator.create(releases)
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
    const packageJson = await readFile(`node_modules/${outdatedPackage.name}/package.json`, 'utf8')
    const pkg = parsePackageJson(packageJson)
    return extractRepository(pkg)
  }
}
