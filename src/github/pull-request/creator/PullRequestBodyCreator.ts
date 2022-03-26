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
import { optimizeGitHubUrl } from './optimizeGitHubUrl'

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

    if (gitRepo?.isGitHub === true) {
      const releaseNotesSection = await this.createReleaseNotesSection({
        outdatedPackage,
        gitRepo
      })

      if (releaseNotesSection !== undefined) {
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

  private async createReleaseNotesSection ({
    outdatedPackage,
    gitRepo
  }: {
    outdatedPackage: OutdatedPackage
    gitRepo: GitRepository
  }): Promise<string | undefined> {
    const releases = await this.releasesFetcher.fetch({
      gitRepo,
      packageName: outdatedPackage.name,
      from: outdatedPackage.currentVersion,
      to: outdatedPackage.newVersion
    })

    if (releases.length === 0) {
      return undefined
    }

    const items = releases.map(({ tag, url }) => {
      const optimizedUrl = optimizeGitHubUrl(url).toString()
      return `- [${tag}](${optimizedUrl})`
    })
    return `## Release notes

${items.join('\n')}`
  }

  private async extractRepository (outdatedPackage: OutdatedPackage): Promise<GitRepository | undefined> {
    const packageJson = await readFile(`node_modules/${outdatedPackage.name}/package.json`)
    const pkg = parsePackageJson(packageJson)
    return extractRepository(pkg)
  }
}
