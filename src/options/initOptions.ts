import {
  Option,
  program
} from 'commander'
import { app } from '../app'
import { isOptions } from './Options'
import type { Options } from './Options'

// TODO: add test
export const initOptions = (): Options => {
  program
    .version(app.version)
    .option('--git-user-email <value>', 'User email of commit')
    .option('--git-user-name <value>', 'User name of commit')
    .requiredOption('--github-token <value>', 'GitHub token')
    .addOption(
      new Option('--log-level <value>', 'Log level to show')
        .choices(['info', 'debug'])
        .default('info')
    )
    .addOption(
      new Option('--package-manager <value>', 'Package manager of your project')
        .choices(['npm', 'yarn'])
        .default('npm')
    )
  program.parse(process.argv)
  const options = program.opts()

  if (!isOptions(options)) {
    throw new Error(`Failed to parse command-line options. options=${JSON.stringify(options)}`)
  }

  return options
}
