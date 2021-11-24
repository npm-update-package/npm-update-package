import {
  Option,
  program
} from 'commander'
import { app } from '../app'
import { PackageManagerName } from '../enums'
import { LogLevel } from '../logger'
import { isOptions } from './Options'
import type { Options } from './Options'

// TODO: add test
export const initOptions = (): Options => {
  program
    .version(app.version)
    .option('--branch-name <value>', 'Branch name template', 'npm-update-package/{{{packageName}}}/v{{newVersion}}')
    .option('--commit-message <value>', 'Commit message template', 'chore(deps): {{updateType}} update {{{packageName}}} to v{{newVersion}}')
    .option('--git-user-email <value>', 'User email of commit')
    .option('--git-user-name <value>', 'User name of commit')
    .requiredOption('--github-token <value>', 'GitHub token')
    .addOption(
      new Option('--log-level <value>', 'Log level to show')
        .choices([
          LogLevel.Info,
          LogLevel.Debug
        ])
        .default(LogLevel.Info)
    )
    .addOption(
      new Option('--package-manager <value>', 'Package manager of your project')
        .choices([
          PackageManagerName.Npm,
          PackageManagerName.Yarn
        ])
        .default(PackageManagerName.Npm)
    )
  program.parse(process.argv)
  const options = program.opts()

  if (!isOptions(options)) {
    throw new Error(`Failed to parse command-line options. options=${JSON.stringify(options)}`)
  }

  return options
}
